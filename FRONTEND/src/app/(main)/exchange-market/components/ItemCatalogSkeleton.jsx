import CoinBalanceSkeleton from "./CoinBalanceSkeleton";
import ItemCardSkeleton from "./ItemCardSkeleton";

export default function ItemCatalogSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-6 mb-8 shadow-md relative">
        {/* Shimmer effect for hero section */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="shimmer-effect opacity-25" />
        </div>

        {/* Title Skeleton */}
        <div className="flex items-center mb-3">
          <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 mr-2" />
          <div className="h-8 w-64 bg-white bg-opacity-20 rounded-md" />
        </div>

        {/* Description Skeleton */}
        <div className="h-4 w-full max-w-2xl bg-white bg-opacity-20 rounded-md mb-2" />
        <div className="h-4 w-3/4 max-w-2xl bg-white bg-opacity-20 rounded-md mb-6" />

        {/* CoinBalance Skeleton */}
        <CoinBalanceSkeleton />
      </div>

      {/* Tabs Skeleton */}
      <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200 relative">
        {/* Shimmer effect for tabs */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="shimmer-effect" />
        </div>
        <div className="flex flex-wrap">
          <div className="px-6 py-3 flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-200 mr-2" />
            <div className="h-5 w-16 bg-gray-200 rounded-md" />
          </div>
          <div className="px-6 py-3 flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-200 mr-2" />
            <div className="h-5 w-24 bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>

      {/* Search and Filter Skeleton */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200 shadow-sm relative">
        {/* Shimmer effect for search */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="shimmer-effect" />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow h-10 bg-gray-200 rounded-lg" />
          <div className="h-10 w-24 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Items Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <ItemCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
