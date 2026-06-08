import { motion } from "framer-motion";

export default function ItemCardSkeleton() {
  return (
    <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="shimmer-effect" />
      </div>

      {/* Image skeleton */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200" />

      {/* Content skeleton */}
      <div className="flex-grow p-4">
        {/* Title skeleton */}
        <div className="mb-2 h-7 w-4/5 rounded-md bg-gray-200" />

        {/* Description skeleton - two lines */}
        <div className="mb-1.5 h-4 w-full rounded-md bg-gray-200" />
        <div className="mb-3 h-4 w-3/4 rounded-md bg-gray-200" />

        {/* Price and stock skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-24 rounded-md bg-gray-200" />
          <div className="h-4 w-20 rounded-md bg-gray-200" />
        </div>
      </div>

      {/* Button skeleton */}
      <div className="p-4 pt-2">
        <div className="h-10 w-full rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
