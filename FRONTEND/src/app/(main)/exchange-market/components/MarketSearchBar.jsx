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
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={marketSearchText}
          onChange={(e) => setMarketSearchText(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600"
        />
        {marketSearchText && (
          <button
            onClick={() => setMarketSearchText("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <span className="text-gray-400 hover:text-gray-600">✕</span>
          </button>
        )}
      </div>
      <div className="flex overflow-hidden rounded-lg border border-gray-200">
        <button
          className={`p-2 ${marketListView === "grid" ? "bg-gray-100" : "bg-white"} hover:bg-gray-50`}
          onClick={() => setMarketListView("grid")}
        >
          <Grid2X2 className="h-4 w-4 text-gray-600" />
        </button>
        <button
          className={`p-2 ${marketListView === "list" ? "bg-gray-100" : "bg-white"} hover:bg-gray-50`}
          onClick={() => setMarketListView("list")}
        >
          <LayoutList className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

export default MarketSearchBar;
