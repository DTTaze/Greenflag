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
import { useAuthStore } from "@/src/store/auth/authStore";
import { StatusBadge } from "./StatusBadge";

export default function DataTable({
  title,
  columns,
  rows = [],
  onAdd,
  onEdit,
  onDelete,
  onView,
  loading = false,
  showDeleted = false,
  onToggleShowDeleted,
}) {
  const { user } = useAuthStore();
  const isAdmin = (user?.role || user?.roles?.name || "").toLowerCase() === "admin";
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;
    const lowerQuery = searchQuery.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => {
        const val = col.valueGetter ? col.valueGetter(row[col.field], row) : row[col.field];
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

  return (
    <div className="mb-6 w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
      {/* Header section */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 p-6 sm:flex-row sm:items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">{title}</h3>
        <div className="flex w-full items-center gap-4 sm:w-auto">
          {onToggleShowDeleted && isAdmin && (
            <label className="relative inline-flex items-center cursor-pointer gap-3 select-none">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showDeleted}
                onChange={(e) => onToggleShowDeleted(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
              <span className="text-sm font-medium text-gray-600 dark:text-zinc-400 whitespace-nowrap">
                Hiển thị dữ liệu đã xóa
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
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pr-4 pl-9 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-zinc-850 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-emerald-500"
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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-gray-500 dark:text-zinc-400">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-800">
              {/* Checkbox Column */}
              <th scope="col" className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-emerald-500"
                  />
                </div>
              </th>

              {/* Data Columns */}
              {columns.map((col, index) => {
                const headerText = col.header || col.headerName;
                return (
                  <th
                    key={index}
                    scope="col"
                    className="py-4 px-6 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400 whitespace-nowrap"
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
                  className="w-[150px] py-4 px-6 text-right text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400 whitespace-nowrap"
                >
                  Thao tác
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 2} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent dark:border-emerald-500"></div>
                    <span className="text-sm text-gray-500 dark:text-zinc-400">
                      Loading data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="py-16 text-center text-gray-500 dark:text-zinc-400"
                >
                  No records found
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => {
                const isSelected = selectedIds.has(row.id);
                const hasDeletedAt = !!(row.deletedAt || row.deleted_at);
                return (
                  <tr
                    key={row.id || index}
                    className={`even:bg-gray-50/30 dark:even:bg-zinc-950/30 hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 transition-colors duration-150 border-b border-gray-100 dark:border-zinc-800/50 last:border-0 ${
                      isSelected
                        ? "bg-emerald-50/10 dark:bg-emerald-950/20 even:bg-emerald-50/10 dark:even:bg-emerald-950/20"
                        : ""
                    } ${hasDeletedAt ? "opacity-60 bg-red-50/5 dark:bg-red-950/5" : ""}`}
                  >
                    {/* Selection checkbox */}
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row.id)}
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-850"
                        />
                      </div>
                    </td>

                    {/* Data Cells */}
                    {columns.map((col, colIndex) => {
                      const fieldKey = col.field || col.accessorKey;
                      const rawValue = fieldKey ? row[fieldKey] : undefined;
                      
                      let resolvedValue = rawValue;
                      if (col.valueGetter) {
                        resolvedValue = col.valueGetter(rawValue, row);
                      }

                      let cellContent;
                      if (col.render) {
                        cellContent = col.render(resolvedValue, row);
                      } else if (col.cell) {
                        cellContent = col.cell(row);
                      } else if (col.field === "status") {
                        cellContent = <StatusBadge status={resolvedValue} />;
                      } else {
                        cellContent = resolvedValue != null ? String(resolvedValue) : "";
                      }

                      // Check if resolvedValue is a relation object that has been soft-deleted
                      const isRelationDeleted = resolvedValue && typeof resolvedValue === 'object' && !!(resolvedValue.deletedAt || resolvedValue.deleted_at);

                      if (isRelationDeleted) {
                        const displayName = resolvedValue.fullName || resolvedValue.full_name || resolvedValue.username || resolvedValue.name || resolvedValue.email || "Đã xóa";
                        cellContent = (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="text-gray-400 line-through dark:text-zinc-500">{displayName}</span>
                            <span className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-650 dark:border-red-900/20 dark:bg-red-950/30 dark:text-red-400">
                              Đã xóa
                            </span>
                          </span>
                        );
                      } else if (hasDeletedAt) {
                        // If the row itself is soft-deleted
                        if (col.field === "status") {
                          cellContent = (
                            <span className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-650 dark:border-red-900/20 dark:bg-red-950/30 dark:text-red-400">
                              Đã xóa
                            </span>
                          );
                        } else if (
                          colIndex === 0 &&
                          !columns.some((c) => c.field === "status")
                        ) {
                          // Render "Đã xóa" next to the primary column value if there is no status column
                          cellContent = (
                            <span className="inline-flex items-center gap-1.5">
                              {cellContent}
                              <span className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-605 dark:border-red-900/20 dark:bg-red-950/30 dark:text-red-400">
                                Đã xóa
                              </span>
                            </span>
                          );
                        }
                      }

                      return (
                        <td
                          key={colIndex}
                          className="max-w-xs truncate py-4 px-6 text-sm text-gray-700 dark:text-zinc-300"
                        >
                          {cellContent}
                        </td>
                      );
                    })}

                    {/* Actions Cell */}
                    {(onView || onEdit || onDelete) && (
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex gap-2">
                          {onView && (
                            <button
                              onClick={() => onView(row)}
                              className="rounded-md p-1.5 text-sky-600 transition-colors hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-500/10"
                              title="Chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="rounded-md p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                              title="Chỉnh sửa"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="rounded-md p-1.5 text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
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
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 p-6 sm:flex-row text-sm text-gray-500 dark:text-zinc-400">
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-700 dark:text-zinc-200">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700 dark:text-zinc-200">
              {Math.min(currentPage * pageSize, filteredRows.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700 dark:text-zinc-200">
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
                Page {currentPage} of {totalPages}
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
