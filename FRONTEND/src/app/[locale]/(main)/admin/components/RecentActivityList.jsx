import React, { useState } from "react";

export default function RecentActivityList({ recentActivities = [], loading }) {
  const [showAll, setShowAll] = useState(false);

  const displayedActivities = showAll
    ? recentActivities
    : recentActivities.slice(0, 5);

  return (
    <div className="flex h-full min-h-[400px] flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-950">
          Recent Activities
        </h3>
        {recentActivities.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 hover:underline focus:outline-none"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {/* List content */}
      <div className="flex flex-1 flex-col gap-4 divide-y divide-gray-100 overflow-y-auto">
        {loading ? (
          <p className="py-4 text-sm text-gray-500">Loading activities...</p>
        ) : displayedActivities.length > 0 ? (
          displayedActivities.map((activity, index) => (
            <div
              key={activity.id || index}
              className={`flex flex-col gap-1 ${index > 0 ? "pt-4" : ""}`}
            >
              <div className="text-sm font-semibold text-gray-900">
                {activity.user}
              </div>
              <div className="text-sm text-gray-600">{activity.action}</div>
              <div className="text-xs text-gray-400">{activity.time}</div>
            </div>
          ))
        ) : (
          <p className="py-4 text-sm text-gray-500">No recent activities</p>
        )}
      </div>
    </div>
  );
}
