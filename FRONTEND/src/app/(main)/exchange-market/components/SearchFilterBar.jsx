import { Search, ArrowDownWideNarrow } from "lucide-react";

function SearchFilterBar({ searchQuery, setSearchQuery, sortOption, setSortOption, isFilterOpen, setIsFilterOpen }) {
  return (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm vật phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-medium flex items-center"
          >
            <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
            Sắp xếp
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {["default", "price-asc", "price-desc", "name-asc", "name-desc"].map(option => (
                <button
                  key={option}
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${sortOption === option ? "bg-emerald-50 text-emerald-600" : "text-gray-700"}`}
                  onClick={() => { setSortOption(option); setIsFilterOpen(false); }}
                >
                  {option === "default" ? "Mặc định" : 
                   option === "price-asc" ? "Giá thấp đến cao" :
                   option === "price-desc" ? "Giá cao đến thấp" :
                   option === "name-asc" ? "Tên A-Z" : "Tên Z-A"}
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