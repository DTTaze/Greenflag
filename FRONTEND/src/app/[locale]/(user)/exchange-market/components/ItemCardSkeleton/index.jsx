import React from "react";

export default function ItemCardSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-4.5 space-y-4 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-200" />

      {/* Content skeleton */}
      <div className="flex-grow space-y-2">
        <div className="h-5 w-4/5 rounded bg-gray-200" />
        <div className="space-y-1">
          <div className="h-3.5 w-full rounded bg-gray-150" />
          <div className="h-3.5 w-5/6 rounded bg-gray-150" />
        </div>
      </div>

      {/* Price and Stock info */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="h-5 w-20 rounded bg-gray-200" />
        <div className="h-4 w-14 rounded bg-gray-150" />
      </div>

      {/* Button skeleton */}
      <div className="h-9 w-full rounded-xl bg-gray-250" />
    </div>
  );
}
