import React from "react";

export default function ProfileCardSkeleton() {
  return (
    <div className="relative mx-auto max-w-sm rounded-lg border bg-white p-4 shadow-md">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="shimmer-effect" />
      </div>

      <div className="flex flex-wrap items-center space-x-4 sm:space-x-6">
        <div className="relative flex h-20 w-20 shrink-0 sm:h-16 sm:w-16">
          <div className="h-full w-full rounded-lg bg-gray-200" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="mb-2 h-5 w-32 rounded-md bg-gray-200" />
          <div className="h-4 w-48 rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="my-4 h-px w-full bg-gray-200" />
      <div className="space-y-2">
        <div className="h-8 w-full rounded-lg bg-gray-200" />
        <div className="h-8 w-full rounded-lg bg-gray-200" />
        <div className="h-8 w-full rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
