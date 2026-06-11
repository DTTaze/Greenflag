/* eslint-disable max-lines */
"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";

import { StatusBadge } from "./StatusBadge";

export interface DataTableColumn<T = any> {
  field: keyof T;
  headerName: string;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T = any> {
  title: string;
  columns: DataTableColumn<T>[];
  rows?: T[];
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  loading?: boolean;
  enableSelection?: boolean;
}

export default function DataTable<T extends { id: string | number }>({
  title,
  columns,
  rows = [],
  onAdd,
  onEdit,
  onDelete,
  onView,
  loading = false,
  enableSelection = true,
}: DataTableProps<T>) {
  const t = useTranslations("admin.common");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set(),
  );

  const filteredRows = useMemo(() => {
    let result = rows;

    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const val = row[col.field];
          return val != null && String(val).toLowerCase().includes(lowerQuery);
        }),
      );
    }

    // Apply status filter if applicable
    if (statusFilter) {
      const statusColumns = columns.filter(
        (col) =>
          col.field === "status" ||
          String(col.field).toLowerCase().includes("status"),
      );

      if (statusColumns.length > 0) {
        result = result.filter((row) => {
          return statusColumns.some((col) => {
            const val = row[col.field];
            return (
              val != null &&
              String(val).toLowerCase() === statusFilter.toLowerCase()
            );
          });
        });
      }
    }

    return result;
  }, [rows, columns, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedRows.map((r) => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string | number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const isAllSelected =
    paginatedRows.length > 0 &&
    paginatedRows.every((r) => selectedIds.has(r.id));

  return (
    <div className="mb-6 w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header section */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
          {title}
        </h3>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-emerald-500"
            />
          </div>

          {/* Add Button */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              <Plus size={16} />
              <span>{t("addNew")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table grid container */}
      <div className="relative overflow-x-auto rounded-lg border border-gray-100 dark:border-zinc-800">
        <table className="w-full border-collapse text-left text-sm text-gray-500 dark:text-zinc-400">
          <thead className="border-b border-gray-100 bg-gray-100 text-xs text-gray-700 uppercase dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
            <tr>
              {/* Checkbox Column */}
              {enableSelection && (
                <th scope="col" className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:ring-offset-zinc-800 dark:focus:ring-emerald-500"
                    />
                  </div>
                </th>
              )}

              {/* Data Columns */}
              {columns.map((col) => (
                <th
                  key={String(col.field)}
                  scope="col"
                  className="text-gray-650 px-6 py-4 font-semibold dark:text-zinc-300"
                  style={{ width: col.width }}
                >
                  {col.headerName}
                </th>
              ))}

              {/* Actions Column */}
              {(onView || onEdit || onDelete) && (
                <th
                  scope="col"
                  className="text-gray-650 w-[150px] px-6 py-4 text-right font-semibold dark:text-zinc-300"
                >
                  {t("actions")}
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-gray-150 divide-y dark:divide-zinc-800">
            {loading ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (enableSelection ? 1 : 0) +
                    (onView || onEdit || onDelete ? 1 : 0)
                  }
                  className="py-20 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent dark:border-emerald-500"></div>
                    <span className="text-sm text-gray-500 dark:text-zinc-400">
                      {t("loading")}
                    </span>
                  </div>
                </td>
              </tr>
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (enableSelection ? 1 : 0) +
                    (onView || onEdit || onDelete ? 1 : 0)
                  }
                  className="py-16 text-center text-gray-400 dark:text-zinc-500"
                >
                  {t("noRecords")}
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => {
                const isSelected = selectedIds.has(row.id);
                return (
                  <tr
                    key={row.id || index}
                    className={`transition-colors even:bg-gray-50/50 hover:bg-gray-100/50 dark:even:bg-zinc-900/50 dark:hover:bg-zinc-800/50 ${
                      isSelected
                        ? "bg-emerald-50/10 dark:bg-emerald-950/20"
                        : ""
                    }`}
                  >
                    {/* Selection checkbox */}
                    {enableSelection && (
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(row.id)}
                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:ring-offset-slate-800 dark:focus:ring-emerald-500"
                          />
                        </div>
                      </td>
                    )}

                    {/* Data Cells */}
                    {columns.map((col) => {
                      const value = row[col.field];
                      return (
                        <td
                          key={String(col.field)}
                          className="max-w-xs truncate px-6 py-4 text-gray-700 dark:text-slate-300"
                        >
                          {col.render ? (
                            col.render(value, row)
                          ) : col.field === "status" ||
                            String(col.field)
                              .toLowerCase()
                              .includes("status") ? (
                            <StatusBadge status={String(value)} />
                          ) : (
                            String(value)
                          )}
                        </td>
                      );
                    })}

                    {/* Actions Cell */}
                    {(onView || onEdit || onDelete) && (
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          {onView && (
                            <button
                              onClick={() => onView(row)}
                              className="rounded-md p-1.5 text-sky-600 transition-colors hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-500/10"
                              title={t("view")}
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="rounded-md p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                              title={t("edit")}
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="rounded-md p-1.5 text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                              title={t("delete")}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && filteredRows.length > 0 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row dark:text-slate-400">
          <div>
            {t("showing")}{" "}
            <span className="font-semibold text-gray-700 dark:text-slate-300">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            {t("to")}{" "}
            <span className="font-semibold text-gray-700 dark:text-slate-300">
              {Math.min(currentPage * pageSize, filteredRows.length)}
            </span>{" "}
            {t("of")}{" "}
            <span className="font-semibold text-gray-700 dark:text-slate-300">
              {filteredRows.length}
            </span>{" "}
            {t("records")}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>{t("rowsPerPage")}:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-gray-200 px-2 py-1 text-gray-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {[5, 10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="rounded-lg border border-gray-200 p-1.5 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800 dark:disabled:hover:bg-slate-900"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 font-medium text-gray-700 dark:text-slate-300">
                {t("page")} {currentPage} {t("of")} {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="rounded-lg border border-gray-200 p-1.5 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800 dark:disabled:hover:bg-slate-900"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
