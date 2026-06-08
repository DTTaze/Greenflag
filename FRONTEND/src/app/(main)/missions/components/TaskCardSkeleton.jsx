import React from "react";

/**
 * Skeleton loader component for task cards
 * Displays a placeholder loading UI while task data is being fetched
 */
const TaskCardSkeleton = () => (
  <div className="task-card-skeleton bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse">
    <div className="h-1.5 bg-gray-200 w-full rounded-t-lg"></div>
    <div className="px-5 py-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="w-12 h-6 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-2 bg-gray-200 rounded-full mb-4"></div>
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

export default TaskCardSkeleton;
