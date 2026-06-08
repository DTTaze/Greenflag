import { Search, Grid2X2, LayoutList } from "lucide-react";

function MarketSearchBar({ marketSearchText, setMarketSearchText, marketListView, setMarketListView }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
      <div className="relative w-full sm:w-auto sm:flex-grow max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={marketSearchText}
          onChange={(e) => setMarketSearchText(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
        />
        {marketSearchText && (
          <button
            onClick={() => setMarketSearchText("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <span className="text-gray-400 hover:text-gray-600">✕</span>
          </button>
        )}
      </div>
      <div className="flex border border-gray-200 rounded-lg overflow-hidden">
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