import { MoreVertical, TrendingUp } from "lucide-react";
import React from "react";

export default function StatCard({
  title,
  value,
  bgClassName = "",
  trendText,
  trendSubtext,
  icon: IconComponent,
}) {
  return (
    <div
      className={`relative flex h-40 flex-col justify-between rounded-xl border border-emerald-250 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-950 ${bgClassName}`}
    >
      {/* Top action button */}
      <div className="absolute top-3 right-3">
        <button className="rounded-full p-1 text-gray-500 transition-colors duration-150 hover:bg-black/5">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Main card content */}
      <div className="flex flex-col gap-1">
        <span className="truncate pr-6 text-sm font-medium text-gray-600">
          {title}
        </span>
        <span className="text-3xl font-bold tracking-tight text-gray-900">
          {value}
        </span>
      </div>

      {/* Trend footer */}
      <div className="mt-2 flex items-center text-xs text-gray-500">
        <div className="mr-2 flex items-center gap-0.5 font-semibold text-emerald-600">
          <TrendingUp size={14} />
          <span>{trendText}</span>
        </div>
        <span className="truncate">{trendSubtext}</span>
      </div>

      {/* Background Icon */}
      {IconComponent && (
        <div className="pointer-events-none absolute right-3 bottom-3 text-gray-800 opacity-[0.08]">
          <IconComponent size={64} />
        </div>
      )}
    </div>
  );
}
