export default function CoinBalanceSkeleton() {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-2 relative">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="shimmer-effect" />
      </div>

      <div className="flex items-center">
        <div className="bg-gray-200 w-9 h-9 rounded-full mr-3" />
        <div className="bg-gray-200 h-5 w-24 rounded-md" />
      </div>
      <div className="bg-white h-8 w-32 rounded-full shadow-sm border border-emerald-100" />
    </div>
  );
}
