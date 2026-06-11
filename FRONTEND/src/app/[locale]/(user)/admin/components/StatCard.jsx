import React from "react";
import { TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  trendText,
  trendSubtext,
  icon: IconComponent,
  iconBgClass = "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  textColorClass = "",
}) {
  return (
    <div className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-500 dark:text-zinc-400">
          {title}
        </span>
        {IconComponent && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBgClass}`}>
            <IconComponent size={20} />
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className={`text-2xl font-bold tracking-tight text-gray-900 dark:text-white ${textColorClass}`}>
          {value}
        </h3>
        {(trendText || trendSubtext) && (
          <p className="mt-1 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {trendText && <TrendingUp className="mr-1 h-3.5 w-3.5" />}
            {trendText && <span className="mr-1">{trendText}</span>}
            <span className="text-gray-400 dark:text-zinc-500 font-normal">{trendSubtext}</span>
          </p>
        )}
      </div>
    </div>
  );
}
