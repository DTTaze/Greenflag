import React from "react";

export default function ProfileCardSkeleton() {
  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md border relative">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="shimmer-effect" />
      </div>

      <div className="flex flex-wrap items-center space-x-4 sm:space-x-6">
        <div className="relative flex h-20 w-20 sm:h-16 sm:w-16 shrink-0">
          <div className="bg-gray-200 h-full w-full rounded-lg" />
        </div>
        <div className="flex flex-col flex-1">
          <div className="bg-gray-200 h-5 w-32 rounded-md mb-2" />
          <div className="bg-gray-200 h-4 w-48 rounded-md" />
        </div>
      </div>
      <div className="my-4 h-px w-full bg-gray-200" />
      <div className="space-y-2">
        <div className="bg-gray-200 h-8 w-full rounded-lg" />
        <div className="bg-gray-200 h-8 w-full rounded-lg" />
        <div className="bg-gray-200 h-8 w-full rounded-lg" />
      </div>
    </div>
  );
}