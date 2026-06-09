export default function CoinBalanceSkeleton() {
  return (
    <div className="relative flex flex-col items-center justify-between gap-2 rounded-2xl border border-emerald-100/50 bg-gradient-to-r from-emerald-50/70 to-green-50/70 p-4.5 shadow-2xs sm:flex-row animate-pulse">
      <div className="flex items-center">
        <div className="mr-3.5 h-9 w-9 rounded-full bg-emerald-100/40" />
        <div className="h-5 w-28 rounded-xl bg-gray-200" />
      </div>
      <div className="h-9 w-32 rounded-xl bg-white border border-gray-100 shadow-2xs" />
    </div>
  );
}
