import { Grid2X2, LayoutList, Search } from "lucide-react";

function MarketSearchBar({
  marketSearchText,
  setMarketSearchText,
  marketListView,
  setMarketListView,
}) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <div className="relative w-full max-w-md sm:w-auto sm:flex-grow">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <Search className="h-4.5 w-4.5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={marketSearchText}
          onChange={(e) => setMarketSearchText(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pr-10 pl-10.5 text-sm transition-all focus:border-[#0B6E4F] focus:bg-white focus:ring-4 focus:ring-[#0B6E4F]/10 focus:outline-none"
        />
        {marketSearchText && (
          <button
            onClick={() => setMarketSearchText("")}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
          >
            <span className="text-gray-400 hover:text-gray-600">✕</span>
          </button>
        )}
      </div>
      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white">
        <button
          className={`cursor-pointer p-2.5 transition-colors ${marketListView === "grid" ? "bg-gray-50 text-[#0B6E4F]" : "bg-white text-gray-400"} hover:bg-gray-50`}
          onClick={() => setMarketListView("grid")}
          aria-label="Grid view"
        >
          <Grid2X2 className="h-4.5 w-4.5" />
        </button>
        <button
          className={`cursor-pointer p-2.5 transition-colors ${marketListView === "list" ? "bg-gray-50 text-[#0B6E4F]" : "bg-white text-gray-400"} hover:bg-gray-50`}
          onClick={() => setMarketListView("list")}
          aria-label="List view"
        >
          <LayoutList className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}

export default MarketSearchBar;
