import React, { useState } from "react";

export default function RecentActivityList({ recentActivities = [], loading }) {
  const [showAll, setShowAll] = useState(false);

  const displayedActivities = showAll
    ? recentActivities
    : recentActivities.slice(0, 5);

  return (
    <div className="flex h-full min-h-100 flex-col rounded-xl border border-emerald-200/60 bg-white p-6 shadow-sm dark:border-emerald-500/20 dark:bg-slate-950">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">
          Recent Activities
        </h3>
        {recentActivities.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 hover:underline focus:outline-none dark:text-emerald-300 dark:hover:text-emerald-200"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {/* List content */}
      <div className="flex flex-1 flex-col gap-4 divide-y divide-emerald-100/50 dark:divide-emerald-500/10 overflow-y-auto">
        {loading ? (
          <p className="py-4 text-sm text-slate-500 dark:text-slate-400">
            Loading activities...
          </p>
        ) : displayedActivities.length > 0 ? (
          displayedActivities.map((activity, index) => (
            <div
              key={activity.id || index}
              className={`flex flex-col gap-1 ${index > 0 ? "pt-4" : ""}`}
            >
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {activity.user}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                {activity.action}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">
                {activity.time}
              </div>
            </div>
          ))
        ) : (
          <p className="py-4 text-sm text-slate-500 dark:text-slate-400">
            No recent activities
          </p>
        )}
      </div>
    </div>
  );
}
