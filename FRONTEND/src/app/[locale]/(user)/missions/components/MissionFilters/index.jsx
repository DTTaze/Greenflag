"use client";

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
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 mb-6 shadow-md transition-colors duration-300">
      {/* Flex container chia 2 nửa: Trái (Filters) - Phải (Sort) */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        
        {/* NỬA TRÁI: Các cụm bộ lọc (Hoạt động & Độ khó) */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-8 flex-1">
          {/* Group 1: Loại hoạt động */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              Loại hoạt động
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "Tất cả" },
                { value: "planting", label: "Trồng cây" },
                { value: "recycling", label: "Tái chế / Thu gom" },
                { value: "saving", label: "Tiết kiệm" },
                { value: "other", label: "Khác" },
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setCategoryFilter(cat.value);
                    setDailyCurrentPage(1);
                    setOtherCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-semibold rounded-full cursor-pointer transition-all duration-200 active:scale-95 ${
                    categoryFilter === cat.value
                      ? "border border-[#0B6E4F] bg-[#0B6E4F] text-white shadow-sm dark:border-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-450"
                      : "border border-gray-200 bg-white text-gray-650 dark:border-zinc-800 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-850"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group 2: Độ khó */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              Độ khó
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "Tất cả" },
                { value: "easy", label: "Dễ" },
                { value: "medium", label: "Trung bình" },
                { value: "hard", label: "Khó" },
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
                    className={`px-4 py-2 text-sm font-semibold rounded-full cursor-pointer transition-all duration-200 active:scale-95 ${
                      activeFilter === diff.value
                        ? "border border-[#0B6E4F] bg-[#0B6E4F] text-white shadow-sm dark:border-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-450"
                        : "border border-gray-200 bg-white text-gray-650 dark:border-zinc-800 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-850"
                    }`}
                  >
                    {diff.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* NỬA PHẢI: Nút Sắp xếp */}
        <div className="flex items-center gap-3 lg:shrink-0 mt-4 lg:mt-0 lg:self-start">
          <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap">
            Sắp xếp:
          </span>
          <select
            value={sortByCoins}
            onChange={(e) => {
              setSortByCoins(e.target.value);
              setDailyCurrentPage(1);
              setOtherCurrentPage(1);
            }}
            className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-green-500/50 cursor-pointer transition-all duration-200"
          >
            <option value="none">Mặc định</option>
            <option value="desc">Xu cao nhất</option>
            <option value="asc">Xu thấp nhất</option>
          </select>
        </div>

      </div>
    </div>
  );
}

export default MissionFilters;
