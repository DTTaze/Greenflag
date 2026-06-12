import { Grid2X2, LayoutList, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

function MarketSearchBar({
  marketSearchText,
  setMarketSearchText,
  marketListView,
  setMarketListView,
  children,
}) {
  const t = useTranslations("exchangeMarket");

  const handleClear = () => {
    setMarketSearchText("");
  };

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input Container */}
      <div className="group relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="dark:group-focus-within:text-emerald-450 h-4.5 w-4.5 text-slate-400 transition-colors group-focus-within:text-emerald-600 dark:text-zinc-500" />
        </div>
        <input
          type="text"
          value={marketSearchText || ""}
          onChange={(e) => setMarketSearchText(e.target.value)}
          placeholder={
            t("emptyState.searchPlaceholder") ||
            "Tìm sản phẩm xanh, vật liệu..."
          }
          className="w-full rounded-2xl border border-emerald-100/70 bg-white/70 py-3 pr-11 pl-11 text-sm text-slate-800 shadow-sm transition-all duration-300 placeholder:text-slate-400/90 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:outline-none dark:border-zinc-800/80 dark:bg-zinc-900/65 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-500 dark:focus:bg-zinc-900/80 dark:focus:ring-emerald-500/5"
        />
        {marketSearchText && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200"
            aria-label="Clear search"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Grid/List View Toggle & Actions */}
      <div className="flex items-center gap-3">
        <div className="flex w-fit overflow-hidden rounded-2xl border border-emerald-100/70 bg-white/70 p-1 shadow-sm transition-all dark:border-zinc-800/80 dark:bg-zinc-900/65">
          <button
            className={`cursor-pointer rounded-xl p-2.5 transition-all duration-200 ${
              marketListView === "grid"
                ? "dark:text-emerald-450 bg-emerald-50 text-[#0B6E4F] shadow-sm dark:bg-emerald-950/40"
                : "dark:hover:bg-zinc-850 text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:hover:text-zinc-200"
            }`}
            onClick={() => setMarketListView("grid")}
            aria-label="Grid view"
          >
            <Grid2X2 className="h-4.5 w-4.5" />
          </button>
          <button
            className={`cursor-pointer rounded-xl p-2.5 transition-all duration-200 ${
              marketListView === "list"
                ? "dark:text-emerald-450 bg-emerald-50 text-[#0B6E4F] shadow-sm dark:bg-emerald-950/40"
                : "dark:hover:bg-zinc-850 text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:hover:text-zinc-200"
            }`}
            onClick={() => setMarketListView("list")}
            aria-label="List view"
          >
            <LayoutList className="h-4.5 w-4.5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default MarketSearchBar;
