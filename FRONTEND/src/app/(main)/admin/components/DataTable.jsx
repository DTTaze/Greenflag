"use client";

import React, { useState, useMemo } from "react";
import { Eye, Pencil, Trash2, Plus, ChevronLeft, ChevronRight, Search } from "lucide-react";

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
      })
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

  const isAllSelected = paginatedRows.length > 0 && paginatedRows.every((r) => selectedIds.has(r.id));

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
    const styleClass = statusColors[status] || "bg-gray-50 text-gray-700 border-gray-200";

    return (
      <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full border ${styleClass}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Add Button */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>

      {/* Table grid container */}
      <div className="relative overflow-x-auto border border-gray-100 rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50/70 border-b border-gray-100">
            <tr>
              {/* Checkbox Column */}
              <th scope="col" className="p-4 w-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
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
                <th scope="col" className="px-6 py-4 font-semibold text-gray-600 text-right w-[150px]">
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
                    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-500">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="py-16 text-center text-gray-400">
                  No records found
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => {
                const isSelected = selectedIds.has(row.id);
                return (
                  <tr
                    key={row.id || index}
                    className={`hover:bg-gray-50/50 transition-colors ${
                      isSelected ? "bg-emerald-50/10" : ""
                    }`}
                  >
                    {/* Selection checkbox */}
                    <td className="p-4 w-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row.id)}
                          className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                        />
                      </div>
                    </td>

                    {/* Data Cells */}
                    {columns.map((col) => {
                      const value = row[col.field];
                      return (
                        <td key={col.field} className="px-6 py-4 text-gray-700 max-w-xs truncate">
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
                              className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-md transition-colors"
                              title="Chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-sm text-gray-500">
          <div>
            Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * pageSize + 1}</span> to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(currentPage * pageSize, filteredRows.length)}
            </span>{" "}
            of <span className="font-semibold text-gray-700">{filteredRows.length}</span> records
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
                className="border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-700"
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
                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-gray-700 px-2 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
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
