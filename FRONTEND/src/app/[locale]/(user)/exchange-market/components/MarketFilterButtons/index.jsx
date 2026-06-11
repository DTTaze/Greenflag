import { motion } from "framer-motion";

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
  const filterItems =
    marketView === "my_items" ? userItemStatuses : marketplaceCategories;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="flex flex-wrap gap-2.5"
    >
      {filterItems.map((filterItem) => {
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
              ? "bg-[#0B6E4F] border-[#0B6E4F] text-white shadow-lg shadow-emerald-500/20"
              : "border-emerald-100 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/65 text-slate-700 dark:text-zinc-300 hover:bg-emerald-50/60 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-emerald-200 dark:hover:border-zinc-700";

        return (
          <motion.button
            key={filterKey}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className={`relative inline-flex cursor-pointer items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
              isActive
                ? marketView === "my_items"
                  ? `${statusColor} text-white shadow-md`
                  : "border-[#0B6E4F] bg-[#0B6E4F] text-white shadow-lg shadow-emerald-500/20"
                : statusColor
            }`}
            onClick={() =>
              marketView === "my_items"
                ? setMarketStatusFilter(filterKey)
                : setMarketCategory(filterKey)
            }
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            <span>{filterName}</span>
            {isActive && marketView === "my_items" && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="ml-1 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-extrabold text-white"
              >
                {
                  filteredMarketItems.filter((item) =>
                    filterKey === "all" ? true : item.postStatus === filterKey,
                  ).length
                }
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export default MarketFilterButtons;
