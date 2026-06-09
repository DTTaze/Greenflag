import React from "react";

export function StatusBadge({ status }) {
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
}
