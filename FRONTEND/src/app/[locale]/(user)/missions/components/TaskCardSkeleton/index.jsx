import React from "react";

/**
 * Loading skeleton component for TaskCard
 */
export default function TaskCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gray-200"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4.5 w-3/4 rounded bg-gray-200"></div>
          <div className="h-3 w-1/4 rounded bg-gray-200"></div>
        </div>
        <div className="h-6 w-14 rounded-lg bg-gray-200"></div>
      </div>

      <div className="space-y-1.5">
        <div className="bg-gray-150 h-3 w-full rounded"></div>
        <div className="bg-gray-150 h-3 w-5/6 rounded"></div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between">
          <div className="bg-gray-150 h-3 w-10 rounded"></div>
          <div className="bg-gray-150 h-3 w-8 rounded"></div>
        </div>
        <div className="h-2.5 w-full rounded-full bg-gray-100"></div>
      </div>

      <div className="h-8.5 w-full rounded-xl bg-gray-200"></div>
    </div>
  );
}
