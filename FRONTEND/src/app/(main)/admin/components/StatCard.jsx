import React from "react";
import { MoreVertical, TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  bgColor = "#ffffff",
  trendText,
  trendSubtext,
  icon: IconComponent,
}) {
  return (
    <div
      className="relative p-5 flex flex-col justify-between h-[150px] rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
      style={{ backgroundColor: bgColor }}
    >
      {/* Top action button */}
      <div className="absolute top-3 right-3">
        <button className="p-1 rounded-full text-gray-500 hover:bg-black/5 transition-colors duration-150">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Main card content */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-600 truncate pr-6">
          {title}
        </span>
        <span className="text-3xl font-bold text-gray-900 tracking-tight">
          {value}
        </span>
      </div>

      {/* Trend footer */}
      <div className="flex items-center text-xs text-gray-500 mt-2">
        <div className="flex items-center text-emerald-600 font-semibold gap-0.5 mr-2">
          <TrendingUp size={14} />
          <span>{trendText}</span>
        </div>
        <span className="truncate">{trendSubtext}</span>
      </div>

      {/* Background Icon */}
      {IconComponent && (
        <div className="absolute bottom-3 right-3 opacity-[0.08] text-gray-800 pointer-events-none">
          <IconComponent size={64} />
        </div>
      )}
    </div>
  );
}
