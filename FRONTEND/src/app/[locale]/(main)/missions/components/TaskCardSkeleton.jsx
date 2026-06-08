import React from "react";

/**
 * Skeleton loader component for task cards
 * Displays a placeholder loading UI while task data is being fetched
 */
const TaskCardSkeleton = () => (
  <div className="task-card-skeleton animate-pulse rounded-xl border border-gray-200 bg-white shadow-sm">
    <div className="h-1.5 w-full rounded-t-lg bg-gray-200"></div>
    <div className="px-5 py-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="mb-2 h-4 w-2/3 rounded bg-gray-200"></div>
          <div className="h-3 w-1/3 rounded bg-gray-200"></div>
        </div>
        <div className="h-6 w-12 rounded-lg bg-gray-200"></div>
      </div>
      <div className="mb-2 h-4 rounded bg-gray-200"></div>
      <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
      <div className="mb-4 h-2 rounded-full bg-gray-200"></div>
      <div className="h-10 rounded-lg bg-gray-200"></div>
    </div>
  </div>
);

export default TaskCardSkeleton;
