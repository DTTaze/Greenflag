import React from "react";

export default function ItemCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col justify-between space-y-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4.5">
      {/* Image skeleton */}
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-200" />

      {/* Content skeleton */}
      <div className="flex-grow space-y-2">
        <div className="h-5 w-4/5 rounded bg-gray-200" />
        <div className="space-y-1">
          <div className="bg-gray-150 h-3.5 w-full rounded" />
          <div className="bg-gray-150 h-3.5 w-5/6 rounded" />
        </div>
      </div>

      {/* Price and Stock info */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="h-5 w-20 rounded bg-gray-200" />
        <div className="bg-gray-150 h-4 w-14 rounded" />
      </div>

      {/* Button skeleton */}
      <div className="bg-gray-250 h-9 w-full rounded-xl" />
    </div>
  );
}
