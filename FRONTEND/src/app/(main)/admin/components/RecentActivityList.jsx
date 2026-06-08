import React, { useState } from "react";
import Button from "@/src/components/ui/button";

export default function RecentActivityList({ recentActivities = [], loading }) {
  const [showAll, setShowAll] = useState(false);

  const displayedActivities = showAll
    ? recentActivities
    : recentActivities.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full min-h-[400px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-950">Recent Activities</h3>
        {recentActivities.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors focus:outline-none"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {/* List content */}
      <div className="flex-1 flex flex-col gap-4 divide-y divide-gray-100 overflow-y-auto">
        {loading ? (
          <p className="text-sm text-gray-500 py-4">Loading activities...</p>
        ) : displayedActivities.length > 0 ? (
          displayedActivities.map((activity, index) => (
            <div
              key={activity.id || index}
              className={`flex flex-col gap-1 ${index > 0 ? "pt-4" : ""}`}
            >
              <div className="font-semibold text-sm text-gray-900">
                {activity.user}
              </div>
              <div className="text-sm text-gray-600">
                {activity.action}
              </div>
              <div className="text-xs text-gray-400">
                {activity.time}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 py-4">No recent activities</p>
        )}
      </div>
    </div>
  );
}
