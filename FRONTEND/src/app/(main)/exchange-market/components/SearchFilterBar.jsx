import { ArrowDownWideNarrow, Search } from "lucide-react";

function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  isFilterOpen,
  setIsFilterOpen,
}) {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm vật phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
          >
            <ArrowDownWideNarrow className="mr-2 h-4 w-4" />
            Sắp xếp
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
              {[
                "default",
                "price-asc",
                "price-desc",
                "name-asc",
                "name-desc",
              ].map((option) => (
                <button
                  key={option}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${sortOption === option ? "bg-emerald-50 text-emerald-600" : "text-gray-700"}`}
                  onClick={() => {
                    setSortOption(option);
                    setIsFilterOpen(false);
                  }}
                >
                  {option === "default"
                    ? "Mặc định"
                    : option === "price-asc"
                      ? "Giá thấp đến cao"
                      : option === "price-desc"
                        ? "Giá cao đến thấp"
                        : option === "name-asc"
                          ? "Tên A-Z"
                          : "Tên Z-A"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchFilterBar;
