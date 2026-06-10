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
      {(marketView === "my_items"
        ? userItemStatuses
        : marketplaceCategories
      ).map((filterItem) => {
        const isActive =
          marketView === "my_items"
            ? marketStatusFilter === filterItem.key
            : marketCategory === filterItem.key;
        const filterKey = filterItem.key;
        const filterName = filterItem.name;
        const Icon = marketView === "my_items" && filterItem.icon;
        const statusColor =
          marketView === "my_items"
            ? statusColors[filterKey] || statusColors.all
            : isActive
              ? "bg-[#0B6E4F] border-[#0B6E4F] text-white shadow-md shadow-[#0B6E4F]/10"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300";

        return (
          <button
            key={filterKey}
            className={`flex cursor-pointer items-center rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
              isActive
                ? marketView === "my_items"
                  ? `${statusColor} shadow-md`
                  : "border-[#0B6E4F] bg-[#0B6E4F] text-white shadow-md shadow-[#0B6E4F]/10"
                : "text-gray-650 border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() =>
              marketView === "my_items"
                ? setMarketStatusFilter(filterKey)
                : setMarketCategory(filterKey)
            }
          >
            {Icon && <Icon className="mr-1.5 h-3.5 w-3.5" />}
            {filterName}
            {isActive && marketView === "my_items" && (
              <span className="ml-1.5 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-extrabold text-white">
                {
                  filteredMarketItems.filter((item) =>
                    filterKey === "all" ? true : item.postStatus === filterKey,
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
