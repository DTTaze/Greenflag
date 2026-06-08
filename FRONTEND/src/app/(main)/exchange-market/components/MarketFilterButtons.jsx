import { Filter, CheckCircle, Clock, FileWarning, EyeOff, ClipboardEdit } from "lucide-react";

function MarketFilterButtons({
  marketView,
  marketCategory,
  setMarketCategory,
  marketStatusFilter,
  setMarketStatusFilter,
  filteredMarketItems,
  marketplaceCategories,
  userItemStatuses,
  statusColors,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {(marketView === "my_items" ? userItemStatuses : marketplaceCategories).map((filterItem) => {
        const isActive =
          marketView === "my_items"
            ? marketStatusFilter === filterItem.key
            : marketCategory === filterItem.key;
        const filterKey = filterItem.key;
        const filterName = filterItem.name;
        const Icon = marketView === "my_items" && filterItem.icon;
        const statusColor = marketView === "my_items"
          ? statusColors[filterKey] || statusColors.all
          : isActive
          ? "bg-emerald-100 text-emerald-700 font-medium"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200";

        return (
          <button
            key={filterKey}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center transition-all duration-150 ${
              isActive
                ? marketView === "my_items"
                  ? `${statusColor} font-medium shadow-sm`
                  : "bg-emerald-100 text-emerald-700 font-medium"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() =>
              marketView === "my_items"
                ? setMarketStatusFilter(filterKey)
                : setMarketCategory(filterKey)
            }
          >
            {Icon && <Icon className="h-3.5 w-3.5 mr-1.5" />}
            {filterName}
            {isActive && marketView === "my_items" && (
              <span className="ml-1.5 bg-white bg-opacity-30 text-xs font-normal rounded-full px-1.5 py-0.5">
                {
                  filteredMarketItems.filter((item) =>
                    filterKey === "all" ? true : item.postStatus === filterKey
                  ).length
                }
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default MarketFilterButtons;