import React, { useEffect, useState } from "react";

import { getUserById, rearrangeRank } from "@/src/utils/api";

function Ranking() {
  const [rankData, setRankData] = useState({
    labels: [],
    values: [],
    avatars: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        setLoading(true);
        const response = await rearrangeRank();
        console.log("ranking response: ", response);

        if (response.data && response.success) {
          const ranks = response.data;

          // Fetch user details for each rank
          const ranksWithUserDetails = await Promise.all(
            ranks.map(async (rank) => {
              try {
                const userResponse = await getUserById(rank.user_id);
                console.log("user response in ranking", userResponse);

                if (userResponse.data && userResponse.success) {
                  return {
                    ...rank,
                    user: userResponse.data,
                  };
                }
                return null; // Return null if user fetch fails
              } catch (err) {
                console.error(
                  `Error fetching user details for user_id ${rank.user_id}:`,
                  err,
                );
                return null; // Return null if there's an error
              }
            }),
          );

          // Filter out null values and users with role_id !== 2
          const filteredRanks = ranksWithUserDetails.filter(
            (rank) => rank !== null && rank.user && rank.user.roles.id === 2,
          );

          // Transform the data for the chart
          const transformedData = {
            labels: filteredRanks.map(
              (rank) => rank.user?.full_name || "Unknown",
            ),
            values: filteredRanks.map((rank) => rank.amount),
            avatars: filteredRanks.map((rank) => rank.user.avatar_url),
          };

          setRankData(transformedData);
          console.log("filteredRanks data: ", ranksWithUserDetails);
        }
      } catch (err) {
        console.error("Error fetching ranking data:", err);
        setError("Failed to load ranking data");
      } finally {
        setLoading(false);
      }
    };

    fetchRankingData();
  }, []);

  if (loading) {
    return (
      <div className="ranking-container">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ranking-container">
        <div className="p-4 text-center text-xs font-semibold text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="ranking-container select-none">
      {/* Top 3 Users Section */}
      <div className="top-users mb-6 flex items-end justify-center border-b border-gray-100/50 px-2 pt-6 pb-5 dark:border-slate-700/70">
        {/* 2nd Place */}
        {rankData.labels[1] && (
          <div className="place-2 mx-1.5 flex flex-1 flex-col items-center">
            <div className="avatar relative mb-2.5 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-slate-300 bg-slate-100 shadow-md">
              <img
                src={
                  rankData.avatars[1] ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"
                }
                alt={rankData.labels[1]}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex h-16 w-full items-center justify-center rounded-t-xl border-x border-t border-slate-300/40 bg-gradient-to-t from-slate-300 via-slate-200 to-slate-100 shadow-xs">
              <span className="text-lg font-black text-slate-500">2</span>
            </div>
            <div className="name mt-2 max-w-[80px] truncate text-center text-xs font-bold text-gray-700 dark:text-slate-100">
              {rankData.labels[1]}
            </div>
            <div className="score mt-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-extrabold text-[#0B6E4F] dark:bg-emerald-400/15 dark:text-emerald-200">
              {rankData.values[1]}đ
            </div>
          </div>
        )}

        {/* 1st Place */}
        {rankData.labels[0] && (
          <div className="place-1 z-10 mx-1.5 flex flex-1 flex-col items-center">
            <div className="relative -mb-1 animate-bounce text-base">👑</div>
            <div className="avatar relative mb-2.5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-amber-400 bg-amber-50 shadow-lg ring-4 ring-amber-400/20">
              <img
                src={
                  rankData.avatars[0] ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"
                }
                alt={rankData.labels[0]}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex h-20 w-full items-center justify-center rounded-t-xl border-x border-t border-amber-400/40 bg-gradient-to-t from-amber-400 via-amber-300 to-amber-200 shadow-sm">
              <span className="text-xl font-black text-amber-700">1</span>
            </div>
            <div className="name mt-2 max-w-[80px] truncate text-center text-xs font-extrabold text-gray-800 dark:text-white">
              {rankData.labels[0]}
            </div>
            <div className="score mt-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-xs font-extrabold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-400/30">
              {rankData.values[0]}đ
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {rankData.labels[2] && (
          <div className="place-3 mx-1.5 flex flex-1 flex-col items-center">
            <div className="avatar border-amber-750 relative mb-2.5 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 bg-amber-100/50 shadow-md">
              <img
                src={
                  rankData.avatars[2] ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"
                }
                alt={rankData.labels[2]}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex h-12 w-full items-center justify-center rounded-t-xl border-x border-t border-amber-600/20 bg-gradient-to-t from-amber-600/70 via-amber-600/50 to-amber-600/30 shadow-xs">
              <span className="text-base font-black text-amber-800">3</span>
            </div>
            <div className="name mt-2 max-w-[80px] truncate text-center text-xs font-bold text-gray-700 dark:text-slate-100">
              {rankData.labels[2]}
            </div>
            <div className="score mt-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-extrabold text-[#0B6E4F] dark:bg-emerald-400/15 dark:text-emerald-200">
              {rankData.values[2]}đ
            </div>
          </div>
        )}
      </div>

      {/* List of other ranks */}
      <div className="other-ranks mt-2 max-h-[220px] space-y-1 overflow-y-auto px-1">
        {rankData.labels.slice(3).map((name, idx) => {
          const position = idx + 4;
          return (
            <div
              key={position}
              className="rank-item flex items-center rounded-xl border border-transparent p-2 transition-all duration-200 hover:border-gray-100 hover:bg-gray-50/70 dark:hover:border-slate-700 dark:hover:bg-slate-800/70"
            >
              <div className="position mr-3 flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500 dark:bg-slate-800 dark:text-slate-200">
                {position}
              </div>
              <div className="avatar mr-3 flex h-7.5 w-7.5 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-slate-700 dark:bg-slate-800">
                <img
                  src={
                    rankData.avatars[position - 1] ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"
                  }
                  alt={name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="name flex-1 truncate text-xs font-semibold text-gray-700 dark:text-slate-100">
                {name}
              </div>
              <div className="score text-xs font-bold text-[#0B6E4F] dark:text-emerald-300">
                {rankData.values[position - 1]}đ
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Ranking;
