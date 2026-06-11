import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

function MissionFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  sortByCoins,
  setSortByCoins,
  selectedTab,
  dailyDifficultyFilter,
  setDailyDifficultyFilter,
  otherDifficultyFilter,
  setOtherDifficultyFilter,
  setDailyCurrentPage,
  setOtherCurrentPage,
}) {
  const t = useTranslations("missions.filters");

  return (
    <div className="space-y-5 rounded-t-3xl border-t border-x border-emerald-200/70 bg-emerald-50/90 p-6 shadow-lg dark:border-emerald-500/20 dark:bg-slate-900/80">
      {/* Search bar and Coin sort */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-3.5 left-3.5 h-4.5 w-4.5 text-gray-400 dark:text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDailyCurrentPage(1);
              setOtherCurrentPage(1);
            }}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pr-4 pl-10.5 text-sm text-gray-800 transition-all placeholder:text-gray-400 focus:border-[#0B6E4F] focus:bg-white focus:ring-4 focus:ring-[#0B6E4F]/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-400 dark:focus:bg-slate-800 dark:focus:ring-emerald-400/10"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold tracking-wider whitespace-nowrap text-gray-400 uppercase dark:text-slate-400">
            {t("sortBy")}
          </span>
          <select
            value={sortByCoins}
            onChange={(e) => {
              setSortByCoins(e.target.value);
              setDailyCurrentPage(1);
              setOtherCurrentPage(1);
            }}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50/50 focus:border-[#0B6E4F] focus:ring-4 focus:ring-[#0B6E4F]/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700/80 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/10"
          >
            <option value="none">{t("default")}</option>
            <option value="desc">{t("coinsDesc")}</option>
            <option value="asc">{t("coinsAsc")}</option>
          </select>
        </div>
      </div>

      {/* Category selector & Difficulty filter */}
      <div className="flex flex-col justify-between gap-5 border-t border-gray-100 pt-5 lg:flex-row dark:border-slate-800">
        {/* Category select buttons */}
        <div className="flex-1 space-y-2.5">
          <span className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-400">
            {t("activityType")}
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: t("all") },
              { value: "planting", label: t("planting") },
              { value: "recycling", label: t("recycling") },
              { value: "saving", label: t("saving") },
              { value: "other", label: t("other") },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setCategoryFilter(cat.value);
                  setDailyCurrentPage(1);
                  setOtherCurrentPage(1);
                }}
                className={`cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
                  categoryFilter === cat.value
                    ? "border-[#0B6E4F] bg-[#0B6E4F] text-white shadow-md shadow-[#0B6E4F]/10 dark:border-emerald-400 dark:bg-emerald-500 dark:text-slate-950 dark:shadow-emerald-500/20"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-emerald-500/50 dark:hover:bg-slate-700/80 dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty buttons */}
        <div className="space-y-2.5">
          <span className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-400">
            {t("difficulty")}
          </span>
          <div className="flex gap-2">
            {[
              { value: "all", label: t("all") },
              { value: "easy", label: t("easy") },
              { value: "medium", label: t("medium") },
              { value: "hard", label: t("hard") },
            ].map((diff) => {
              const isDaily = selectedTab === "daily";
              const activeFilter = isDaily
                ? dailyDifficultyFilter
                : otherDifficultyFilter;
              const setFilter = isDaily
                ? setDailyDifficultyFilter
                : setOtherDifficultyFilter;
              const setPage = isDaily
                ? setDailyCurrentPage
                : setOtherCurrentPage;

              return (
                <button
                  key={diff.value}
                  onClick={() => {
                    setFilter(diff.value);
                    setPage(1);
                  }}
                  className={`cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
                    activeFilter === diff.value
                      ? "border-emerald-200 bg-emerald-50 text-[#0B6E4F] shadow-2xs dark:border-emerald-400/60 dark:bg-emerald-400/15 dark:text-emerald-200"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-emerald-500/50 dark:hover:bg-slate-700/80 dark:hover:text-white"
                  }`}
                >
                  {diff.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MissionFilters;
