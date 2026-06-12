import { MoreVertical, TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  trendText,
  trendSubtext,
  icon: IconComponent,
  iconBgClass = "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  textColorClass = "",
  bgClassName = "",
}) {
  return (
    <div
      className={`border-emerald-250 relative flex h-40 flex-col justify-between rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-950 ${bgClassName}`}
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
        {IconComponent && (
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBgClass}`}
          >
            <IconComponent size={20} />
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3
          className={`text-2xl font-bold tracking-tight text-gray-900 dark:text-white ${textColorClass}`}
        >
          {value}
        </h3>
        {(trendText || trendSubtext) && (
          <p className="mt-1 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {trendText && <TrendingUp className="mr-1 h-3.5 w-3.5" />}
            {trendText && <span className="mr-1">{trendText}</span>}
            <span className="font-normal text-gray-400 dark:text-zinc-500">
              {trendSubtext}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
