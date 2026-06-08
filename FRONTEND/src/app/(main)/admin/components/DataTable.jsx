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
import React, { useMemo, useState } from "react";

export default function DataTable({
  title,
  columns,
  rows = [],
  onAdd,
  onEdit,
  onDelete,
  onView,
  loading = false,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Filter rows based on search query
  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;
    const lowerQuery = searchQuery.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => {
        const val = row[col.field];
        return val != null && String(val).toLowerCase().includes(lowerQuery);
      }),
    );
  }, [rows, columns, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  // Reset page when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedRows.map((r) => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id) => {
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

  // Render status helper
  const renderStatus = (status) => {
    const statusColors = {
      Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Inactive: "bg-rose-50 text-rose-700 border-rose-200",
      Pending: "bg-amber-50 text-amber-700 border-amber-200",
      Todo: "bg-amber-50 text-amber-700 border-amber-200",
      "In Progress": "bg-sky-50 text-sky-700 border-sky-200",
    };
    const styleClass =
      statusColors[status] || "bg-gray-50 text-gray-700 border-gray-200";

    return (
      <span
        className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styleClass}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="mb-6 w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header section */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Add Button */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              <Plus size={16} />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>

      {/* Table grid container */}
      <div className="relative overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full border-collapse text-left text-sm text-gray-500">
          <thead className="border-b border-gray-100 bg-gray-50/70 text-xs text-gray-700 uppercase">
            <tr>
              {/* Checkbox Column */}
              <th scope="col" className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
              </th>

              {/* Data Columns */}
              {columns.map((col) => (
                <th
                  key={col.field}
                  scope="col"
                  className="px-6 py-4 font-semibold text-gray-600"
                  style={{ width: col.width }}
                >
                  {col.headerName}
                </th>
              ))}

              {/* Actions Column */}
              {(onView || onEdit || onDelete) && (
                <th
                  scope="col"
                  className="w-[150px] px-6 py-4 text-right font-semibold text-gray-600"
                >
                  Thao tác
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 2} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                    <span className="text-sm text-gray-500">
                      Loading data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="py-16 text-center text-gray-400"
                >
                  No records found
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => {
                const isSelected = selectedIds.has(row.id);
                return (
                  <tr
                    key={row.id || index}
                    className={`transition-colors hover:bg-gray-50/50 ${
                      isSelected ? "bg-emerald-50/10" : ""
                    }`}
                  >
                    {/* Selection checkbox */}
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row.id)}
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-emerald-600 focus:ring-emerald-500"
                        />
                      </div>
                    </td>

                    {/* Data Cells */}
                    {columns.map((col) => {
                      const value = row[col.field];
                      return (
                        <td
                          key={col.field}
                          className="max-w-xs truncate px-6 py-4 text-gray-700"
                        >
                          {col.field === "status" ? renderStatus(value) : value}
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
                              className="rounded-md p-1.5 text-sky-600 transition-colors hover:bg-sky-50"
                              title="Chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="rounded-md p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50"
                              title="Chỉnh sửa"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="rounded-md p-1.5 text-rose-600 transition-colors hover:bg-rose-50"
                              title="Xóa"
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
        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(currentPage * pageSize, filteredRows.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {filteredRows.length}
            </span>{" "}
            records
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-gray-200 px-2 py-1 text-gray-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
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
                className="rounded-lg border border-gray-200 p-1.5 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="rounded-lg border border-gray-200 p-1.5 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
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
