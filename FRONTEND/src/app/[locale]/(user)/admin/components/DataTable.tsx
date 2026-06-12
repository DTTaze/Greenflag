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

import { useAuthStore } from "@/src/store/auth/authStore";
import { StatusBadge } from "./StatusBadge";

export interface DataTableColumn<T = any> {
  field?: keyof T;
  headerName?: string;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
  valueGetter?: (value: any, row: T) => any;
  header?: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T = any> {
  title: string;
  columns: DataTableColumn<T>[];
  rows?: T[];
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onRowClick?: (row: T) => void;
  onBulkDelete?: (ids: (string | number)[]) => void;
  loading?: boolean;
  enableSelection?: boolean;
  showDeleted?: boolean;
  onToggleShowDeleted?: (show: boolean) => void;
}

export default function DataTable<T extends { id: string | number }>({
  title,
  columns,
  rows = [],
  onAdd,
  onEdit,
  onDelete,
  onView,
  onRowClick,
  onBulkDelete,
  loading = false,
  enableSelection = true,
  showDeleted = false,
  onToggleShowDeleted,
}: DataTableProps<T>) {
  const t = useTranslations("admin.common");
  const colT = useTranslations("admin.columns");
  const { user } = useAuthStore();
  const isAdmin =
    (user?.role || user?.roles?.name || "").toLowerCase() === "admin";
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
          const fieldKey = col.field || col.accessorKey;
          const rawValue = fieldKey ? (row as any)[fieldKey] : undefined;
          const val = col.valueGetter
            ? col.valueGetter(rawValue, row)
            : rawValue;
          return val != null && String(val).toLowerCase().includes(lowerQuery);
        }),
      );
    }

    // Apply status filter if applicable
    if (statusFilter) {
      const statusColumns = columns.filter((col) => {
        const fieldKey = col.field || col.accessorKey;
        return (
          fieldKey === "status" ||
          (fieldKey && String(fieldKey).toLowerCase().includes("status"))
        );
      });

      if (statusColumns.length > 0) {
        result = result.filter((row) => {
          return statusColumns.some((col) => {
            const fieldKey = col.field || col.accessorKey;
            const val = fieldKey ? (row as any)[fieldKey] : undefined;
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
    <div className="mb-6 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header section */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-100 bg-white p-6 sm:flex-row sm:items-center dark:border-zinc-800/50 dark:bg-zinc-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">
          {title}
        </h3>
        <div className="flex w-full items-center gap-4 sm:w-auto">
          {onToggleShowDeleted && isAdmin && (
            <label className="relative inline-flex cursor-pointer items-center gap-3 select-none">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={showDeleted}
                onChange={(e) => onToggleShowDeleted(e.target.checked)}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-emerald-500 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-zinc-700"></div>
              <span className="text-sm font-medium whitespace-nowrap text-gray-600 dark:text-zinc-400">
                {t("showDeleted")}
              </span>
            </label>
          )}

          {/* Search Input */}
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-zinc-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dark:border-zinc-850 w-full rounded-lg border border-gray-200 bg-transparent py-2 pr-4 pl-9 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-emerald-500"
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

      {/* Floating/Contextual Bulk Actions Toolbar */}
      {selectedIds.size > 0 && onBulkDelete && (
        <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50/80 px-6 py-3.5 dark:border-emerald-900/20 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              {t("selectedCount", { count: selectedIds.size })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="cursor-pointer text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              {t("clearSelection")}
            </button>
            <button
              onClick={() => {
                if (window.confirm(t("confirmBulkDelete", { count: selectedIds.size }))) {
                  onBulkDelete(Array.from(selectedIds));
                  setSelectedIds(new Set());
                }
              }}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700"
            >
              <Trash2 size={13} />
              {t("deleteSelected")}
            </button>
          </div>
        </div>
      )}

      {/* Table grid container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-gray-500 dark:text-zinc-400">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-zinc-800 dark:bg-zinc-900/50">
              {/* Checkbox Column */}
              {enableSelection && (
                <th scope="col" className="w-4 p-4">
                  <div className="flex items-center">
                    <label className="relative flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="sr-only peer"
                      />
                      <div className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${
                        isAllSelected 
                          ? "bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500" 
                          : "border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800"
                      }`}>
                        {isAllSelected && (
                          <svg className="h-2.5 w-2.5 fill-current text-white" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        )}
                      </div>
                    </label>
                  </div>
                </th>
              )}

              {/* Data Columns */}
              {columns.map((col, index) => {
                let headerText = col.header || col.headerName;
                if (col.field) {
                  try {
                    const key = String(col.field);
                    if (colT.has(key)) {
                      headerText = colT(key);
                    }
                  } catch (e) {
                    // fallback
                  }
                }
                return (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-4 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-zinc-400"
                    style={{ width: col.width }}
                  >
                    {headerText}
                  </th>
                );
              })}

              {/* Actions Column */}
              {(onView || onEdit || onDelete) && (
                <th
                  scope="col"
                  className="w-[150px] px-6 py-4 text-right text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-zinc-400"
                >
                  {t("actions")}
                </th>
              )}
            </tr>
          </thead>

          <tbody>
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
                  className="py-16 text-center text-gray-500 dark:text-zinc-400"
                >
                  {t("noRecords")}
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => {
                const isSelected = selectedIds.has(row.id);
                const hasDeletedAt = !!(
                  (row as any).deletedAt || (row as any).deleted_at
                );
                return (
                  <tr
                    key={row.id || index}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (
                        target.closest(".selection-cell") ||
                        target.closest(".actions-cell") ||
                        target.closest('input[type="checkbox"]')
                      ) {
                        return;
                      }
                      if (onRowClick) {
                        onRowClick(row);
                      } else if (onView) {
                        onView(row);
                      } else if (onEdit) {
                        onEdit(row);
                      }
                    }}
                    className={`border-b border-gray-100 transition-colors duration-150 last:border-0 even:bg-gray-50/30 hover:bg-gray-100/50 dark:border-zinc-800/50 dark:even:bg-zinc-950/30 dark:hover:bg-zinc-800/50 ${
                      isSelected
                        ? "bg-emerald-50/10 even:bg-emerald-50/10 dark:bg-emerald-950/20 dark:even:bg-emerald-950/20"
                        : ""
                    } ${hasDeletedAt ? "bg-red-50/5 opacity-60 dark:bg-red-950/5" : ""} ${
                      onRowClick || onView || onEdit ? "cursor-pointer" : ""
                    }`}
                  >
                    {/* Selection checkbox */}
                    {enableSelection && (
                      <td
                        className="w-4 p-4 selection-cell cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRow(row.id);
                        }}
                      >
                        <div className="flex items-center">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="sr-only peer"
                            />
                            <div className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${
                              isSelected 
                                ? "bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500" 
                                : "border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800"
                            }`}>
                              {isSelected && (
                                <svg className="h-2.5 w-2.5 fill-current text-white" viewBox="0 0 20 20">
                                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Data Cells */}
                    {columns.map((col, colIndex) => {
                      const fieldKey = col.field || col.accessorKey;
                      const rawValue = fieldKey
                        ? (row as any)[fieldKey]
                        : undefined;

                      let resolvedValue = rawValue;
                      if (col.valueGetter) {
                        resolvedValue = col.valueGetter(rawValue, row);
                      }

                      let cellContent;
                      if (col.render) {
                        cellContent = col.render(resolvedValue, row);
                      } else if (col.cell) {
                        cellContent = col.cell(row);
                      } else if (
                        fieldKey === "status" ||
                        (fieldKey &&
                          String(fieldKey).toLowerCase().includes("status"))
                      ) {
                        cellContent = (
                          <StatusBadge status={String(resolvedValue)} />
                        );
                      } else {
                        cellContent =
                          resolvedValue != null ? String(resolvedValue) : "";
                      }

                      // Check if resolvedValue is a relation object that has been soft-deleted
                      const isRelationDeleted =
                        resolvedValue &&
                        typeof resolvedValue === "object" &&
                        !!(resolvedValue.deletedAt || resolvedValue.deleted_at);

                      if (isRelationDeleted) {
                        const displayName =
                          resolvedValue.fullName ||
                          resolvedValue.full_name ||
                          resolvedValue.username ||
                          resolvedValue.name ||
                          resolvedValue.email ||
                          "Đã xóa";
                        cellContent = (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="text-gray-400 line-through dark:text-zinc-500">
                              {displayName}
                            </span>
                            <span className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:border-red-900/20 dark:bg-red-950/30 dark:text-red-400">
                              Đã xóa
                            </span>
                          </span>
                        );
                      } else if (hasDeletedAt) {
                        // If the row itself is soft-deleted
                        if (
                          fieldKey === "status" ||
                          (fieldKey &&
                            String(fieldKey).toLowerCase().includes("status"))
                        ) {
                          cellContent = (
                            <span className="text-red-650 inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold dark:border-red-900/20 dark:bg-red-950/30 dark:text-red-400">
                              Đã xóa
                            </span>
                          );
                        } else if (
                          colIndex === 0 &&
                          !columns.some((c) => {
                            const k = c.field || c.accessorKey;
                            return (
                              k === "status" ||
                              (k && String(k).toLowerCase().includes("status"))
                            );
                          })
                        ) {
                          // Render "Đã xóa" next to the primary column value if there is no status column
                          cellContent = (
                            <span className="inline-flex items-center gap-1.5">
                              {cellContent}
                              <span className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:border-red-900/20 dark:bg-red-950/30 dark:text-red-400">
                                Đã xóa
                              </span>
                            </span>
                          );
                        }
                      }

                      return (
                        <td
                          key={colIndex}
                          className="max-w-xs truncate px-6 py-4 text-sm text-gray-700 dark:text-zinc-300"
                        >
                          {cellContent}
                        </td>
                      );
                    })}

                    {/* Actions Cell */}
                    {(onView || onEdit || onDelete) && (
                      <td className="px-6 py-4 text-right actions-cell">
                        <div className="inline-flex gap-2" onClick={(e) => e.stopPropagation()}>
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
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 bg-white p-6 text-sm text-gray-500 sm:flex-row dark:border-zinc-800/50 dark:bg-zinc-900 dark:text-zinc-400">
          <div>
            {t("showing")}{" "}
            <span className="font-semibold text-gray-700 dark:text-zinc-200">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            {t("to")}{" "}
            <span className="font-semibold text-gray-700 dark:text-zinc-200">
              {Math.min(currentPage * pageSize, filteredRows.length)}
            </span>{" "}
            {t("of")}{" "}
            <span className="font-semibold text-gray-700 dark:text-zinc-200">
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
                className="rounded-lg border border-gray-200 bg-transparent px-2 py-1 text-gray-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none dark:border-zinc-800 dark:text-zinc-300"
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
                className="rounded-lg border border-gray-200 p-1.5 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white dark:border-zinc-800 dark:hover:bg-zinc-800/50 dark:disabled:hover:bg-transparent"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 font-medium text-gray-700 dark:text-zinc-200">
                {t("page")} {currentPage} {t("of")} {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="rounded-lg border border-gray-200 p-1.5 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white dark:border-zinc-800 dark:hover:bg-zinc-800/50 dark:disabled:hover:bg-transparent"
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
