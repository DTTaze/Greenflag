import React from "react";

/**
 * Progress bar component for task completion
 */
const ProgressBar = React.memo(({ completed, total, level }) => {
  const percentage = Math.round((completed / total) * 100);

  // Gradient configurations for the progress fill
  const getGradientClass = (lvl) => {
    switch (lvl) {
      case "easy":
        return "from-emerald-400 to-green-500 shadow-green-100";
      case "medium":
        return "from-blue-400 to-indigo-500 shadow-blue-100";
      case "hard":
        return "from-amber-400 to-orange-500 shadow-orange-100";
      case "expert":
        return "from-rose-500 to-red-600 shadow-red-100";
      default:
        return "from-gray-400 to-gray-500 shadow-gray-100";
    }
  };

  const trackBgClass = (lvl) => {
    switch (lvl) {
      case "easy":
        return "bg-emerald-50 dark:bg-emerald-950/50";
      case "medium":
        return "bg-blue-50 dark:bg-blue-950/50";
      case "hard":
        return "bg-amber-50 dark:bg-amber-950/50";
      case "expert":
        return "bg-rose-50 dark:bg-rose-950/50";
      default:
        return "bg-gray-50 dark:bg-slate-800";
    }
  };

  return (
    <div className="progress-container w-full">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-300">
          Tiến độ
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-extrabold text-[#0B6E4F] dark:bg-emerald-400/15 dark:text-emerald-200">
          {completed}/{total} ({percentage}%)
        </span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800 border border-transparent"
      >
        <div
          className="h-full rounded-full bg-green-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;
