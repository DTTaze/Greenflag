import { motion } from "framer-motion";

export default function ItemCardSkeleton() {
  return (
    <div className="group flex flex-col justify-between border border-gray-200 rounded-xl overflow-hidden bg-white h-full relative">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="shimmer-effect" />
      </div>

      {/* Image skeleton */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-4 flex-grow">
        {/* Title skeleton */}
        <div className="h-7 w-4/5 bg-gray-200 rounded-md mb-2" />

        {/* Description skeleton - two lines */}
        <div className="h-4 w-full bg-gray-200 rounded-md mb-1.5" />
        <div className="h-4 w-3/4 bg-gray-200 rounded-md mb-3" />

        {/* Price and stock skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-5 w-24 bg-gray-200 rounded-md" />
          <div className="h-4 w-20 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Button skeleton */}
      <div className="p-4 pt-2">
        <div className="h-10 w-full bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}
