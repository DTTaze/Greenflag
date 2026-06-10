import CoinBalanceSkeleton from "../CoinBalanceSkeleton";
import ItemCardSkeleton from "../ItemCardSkeleton";

export default function ItemCatalogSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Hero Section Skeleton */}
      <div className="relative mb-8 animate-pulse rounded-2xl bg-gradient-to-br from-emerald-600/70 to-emerald-500/70 p-7 shadow-xl">
        {/* Title Skeleton */}
        <div className="mb-3 flex items-center">
          <div className="bg-opacity-20 mr-2.5 h-6 w-6 rounded-full bg-white" />
          <div className="bg-opacity-20 h-8 w-64 rounded-md bg-white" />
        </div>

        {/* Description Skeleton */}
        <div className="bg-opacity-20 mb-2 h-4 w-full max-w-2xl rounded-md bg-white" />
        <div className="bg-opacity-20 mb-6 h-4 w-3/4 max-w-2xl rounded-md bg-white" />

        {/* CoinBalance Skeleton */}
        <CoinBalanceSkeleton />
      </div>

      {/* Tabs Skeleton */}
      <div className="mb-6 h-12 w-96 animate-pulse rounded-xl bg-gray-200" />

      {/* Search and Filter Skeleton */}
      <div className="mb-6 animate-pulse space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="h-10 flex-grow rounded-xl bg-gray-100" />
          <div className="h-10 w-24 rounded-xl bg-gray-100" />
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
