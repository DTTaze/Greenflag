"use client";

import { Search } from "lucide-react";
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
    <div className="space-y-5 border-x border-gray-100 bg-white p-6 shadow-xs">
      {/* Search bar and Coin sort */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-3.5 left-3.5 h-4.5 w-4.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDailyCurrentPage(1);
              setOtherCurrentPage(1);
            }}
            placeholder="Tìm kiếm nhiệm vụ..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pr-4 pl-10.5 text-sm transition-all focus:border-[#0B6E4F] focus:bg-white focus:ring-4 focus:ring-[#0B6E4F]/10 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold tracking-wider whitespace-nowrap text-gray-400 uppercase">
            Sắp xếp:
          </span>
          <select
            value={sortByCoins}
            onChange={(e) => {
              setSortByCoins(e.target.value);
              setDailyCurrentPage(1);
              setOtherCurrentPage(1);
            }}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50/50 focus:border-[#0B6E4F] focus:ring-4 focus:ring-[#0B6E4F]/10 focus:outline-none"
          >
            <option value="none">Mặc định</option>
            <option value="desc">Xu cao nhất</option>
            <option value="asc">Xu thấp nhất</option>
          </select>
        </div>
      </div>

      {/* Category selector & Difficulty filter */}
      <div className="flex flex-col justify-between gap-5 border-t border-gray-100 pt-5 lg:flex-row">
        {/* Category select buttons */}
        <div className="flex-1 space-y-2.5">
          <span className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
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
                className={`cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
                  categoryFilter === cat.value
                    ? "border-[#0B6E4F] bg-[#0B6E4F] text-white shadow-md shadow-[#0B6E4F]/10"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty buttons */}
        <div className="space-y-2.5">
          <span className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Độ khó
          </span>
          <div className="flex gap-2">
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
                  className={`cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
                    activeFilter === diff.value
                      ? "border-emerald-200 bg-emerald-50 text-[#0B6E4F] shadow-2xs"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
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
