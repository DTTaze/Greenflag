import { Grid2X2, LayoutList } from "lucide-react";
import React from "react";

function MarketSearchBar({
  marketListView,
  setMarketListView,
}) {
  return (
    <div className="flex justify-end mb-4">
      <div className="flex w-fit overflow-hidden rounded-2xl border border-emerald-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1 shadow-sm">
        <button
          className={`cursor-pointer rounded-xl p-2.5 transition-all ${
            marketListView === "grid"
              ? "bg-emerald-50 text-[#0B6E4F] dark:bg-emerald-950/40 dark:text-emerald-400 shadow-sm"
              : "text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-200"
          }`}
          onClick={() => setMarketListView("grid")}
          aria-label="Grid view"
        >
          <Grid2X2 className="h-4.5 w-4.5" />
        </button>
        <button
          className={`cursor-pointer rounded-xl p-2.5 transition-all ${
            marketListView === "list"
              ? "bg-emerald-50 text-[#0B6E4F] dark:bg-emerald-950/40 dark:text-emerald-400 shadow-sm"
              : "text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-200"
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
