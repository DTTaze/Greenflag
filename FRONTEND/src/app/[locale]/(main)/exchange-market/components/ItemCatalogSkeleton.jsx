import CoinBalanceSkeleton from "./CoinBalanceSkeleton";
import ItemCardSkeleton from "./ItemCardSkeleton";

export default function ItemCatalogSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Hero Section Skeleton */}
      <div className="relative mb-8 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 shadow-md">
        {/* Shimmer effect for hero section */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="shimmer-effect opacity-25" />
        </div>

        {/* Title Skeleton */}
        <div className="mb-3 flex items-center">
          <div className="bg-opacity-20 mr-2 h-6 w-6 rounded-full bg-white" />
          <div className="bg-opacity-20 h-8 w-64 rounded-md bg-white" />
        </div>

        {/* Description Skeleton */}
        <div className="bg-opacity-20 mb-2 h-4 w-full max-w-2xl rounded-md bg-white" />
        <div className="bg-opacity-20 mb-6 h-4 w-3/4 max-w-2xl rounded-md bg-white" />

        {/* CoinBalance Skeleton */}
        <CoinBalanceSkeleton />
      </div>

      {/* Tabs Skeleton */}
      <div className="relative mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Shimmer effect for tabs */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="shimmer-effect" />
        </div>
        <div className="flex flex-wrap">
          <div className="flex items-center px-6 py-3">
            <div className="mr-2 h-4 w-4 rounded-full bg-gray-200" />
            <div className="h-5 w-16 rounded-md bg-gray-200" />
          </div>
          <div className="flex items-center px-6 py-3">
            <div className="mr-2 h-4 w-4 rounded-full bg-gray-200" />
            <div className="h-5 w-24 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Search and Filter Skeleton */}
      <div className="relative mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        {/* Shimmer effect for search */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="shimmer-effect" />
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative h-10 flex-grow rounded-lg bg-gray-200" />
          <div className="h-10 w-24 rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Items Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <ItemCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
