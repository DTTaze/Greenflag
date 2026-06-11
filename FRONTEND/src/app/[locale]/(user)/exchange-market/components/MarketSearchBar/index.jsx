import { motion } from "framer-motion";
import { Grid2X2, LayoutList, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

function MarketSearchBar({
  marketSearchText,
  setMarketSearchText,
  marketListView,
  setMarketListView,
}) {
  const t = useTranslations("exchangeMarket");

  return (
    <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full max-w-xl sm:flex-grow">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="Ftext-emerald-500 h-4.5 w-4.5" />
        </div>
        <input
          type="text"
          placeholder={t("emptyState.searchPlaceholder")}
          value={marketSearchText}
          onChange={(e) => setMarketSearchText(e.target.value)}
          className="w-full rounded-2xl border border-emerald-100 bg-white/85 py-3 pr-12 pl-11 text-sm font-medium text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-[#0B6E4F] focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:outline-none"
        />
        {marketSearchText && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setMarketSearchText("")}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-slate-400 transition hover:text-slate-700"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      <div className="flex w-fit overflow-hidden rounded-2xl border border-emerald-100 bg-white p-1 shadow-sm">
        <button
          className={`cursor-pointer rounded-xl p-2.5 transition-all ${
            marketListView === "grid"
              ? "bg-emerald-50 text-[#0B6E4F] shadow-sm"
              : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          }`}
          onClick={() => setMarketListView("grid")}
          aria-label="Grid view"
        >
          <Grid2X2 className="h-4.5 w-4.5" />
        </button>
        <button
          className={`cursor-pointer rounded-xl p-2.5 transition-all ${
            marketListView === "list"
              ? "bg-emerald-50 text-[#0B6E4F] shadow-sm"
              : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          }`}
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
