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
    <div className="space-y-4 border-x border-gray-200 bg-white p-5 shadow-sm">
      {/* Search bar and Coin sort */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDailyCurrentPage(1);
              setOtherCurrentPage(1);
            }}
            placeholder="Tìm kiếm nhiệm vụ..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pr-4 pl-9 text-sm transition-all focus:ring-2 focus:ring-[#0B6E4F] focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium whitespace-nowrap text-gray-500">
            Sắp xếp:
          </span>
          <select
            value={sortByCoins}
            onChange={(e) => {
              setSortByCoins(e.target.value);
              setDailyCurrentPage(1);
              setOtherCurrentPage(1);
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all focus:ring-2 focus:ring-[#0B6E4F] focus:outline-none"
          >
            <option value="none">Mặc định</option>
            <option value="desc">Xu cao nhất</option>
            <option value="asc">Xu thấp nhất</option>
          </select>
        </div>
      </div>

      {/* Category selector & Difficulty filter */}
      <div className="flex flex-col justify-between gap-4 border-t border-gray-100 pt-2 md:flex-row">
        {/* Category select buttons */}
        <div className="space-y-1">
          <span className="block text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Loại hoạt động:
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
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  categoryFilter === cat.value
                    ? "bg-[#0B6E4F] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty buttons */}
        <div className="space-y-1">
          <span className="block text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Độ khó:
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
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeFilter === diff.value
                      ? "border border-green-200 bg-green-100 text-[#0B6E4F]"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
