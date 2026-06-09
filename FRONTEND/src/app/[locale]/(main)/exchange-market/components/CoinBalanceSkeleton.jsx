export default function CoinBalanceSkeleton() {
  return (
    <div className="relative flex flex-col items-center justify-between gap-2 rounded-lg border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4 shadow-sm sm:flex-row">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="shimmer-effect" />
      </div>

      <div className="flex items-center">
        <div className="mr-3 h-9 w-9 rounded-full bg-gray-200" />
        <div className="h-5 w-24 rounded-md bg-gray-200" />
      </div>
      <div className="h-8 w-32 rounded-full border border-emerald-100 bg-white shadow-sm" />
    </div>
  );
}
