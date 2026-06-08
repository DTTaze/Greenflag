import React, { useEffect, useState } from "react";

import { getUserByIdApi, rearrangeRankApi } from "@/src/utils/api";

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
        const response = await rearrangeRankApi();
        console.log("ranking response: ", response);

        if (response.data && response.success) {
          const ranks = response.data;

          // Fetch user details for each rank
          const ranksWithUserDetails = await Promise.all(
            ranks.map(async (rank) => {
              try {
                const userResponse = await getUserByIdApi(rank.user_id);
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
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ranking-container">
        <div className="p-4 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="ranking-container">
      {/* Top 3 Users Section */}
      <div className="top-users mb-6 flex items-end justify-center pt-4">
        {/* 2nd Place */}
        <div className="place-2 mx-3 flex flex-col items-center">
          <div className="avatar mb-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300 bg-gray-200">
            <img
              src={rankData.avatars[1]}
              alt={rankData.labels[1]}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="bg-silver flex h-20 w-20 items-center justify-center rounded-t-lg bg-gradient-to-t from-gray-400 to-gray-300">
            <span className="text-lg font-bold text-white">2</span>
          </div>
          <div className="name mt-1 text-sm font-medium text-gray-700">
            {rankData.labels[1]}
          </div>
          <div className="score text-xs font-medium text-gray-500">
            {rankData.values[1]} điểm
          </div>
        </div>

        {/* 1st Place */}
        <div className="place-1 mx-4 flex flex-col items-center">
          <div className="crown -mb-3 text-yellow-500">👑</div>
          <div className="avatar mb-2 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-yellow-400 bg-gray-200">
            <img
              src={rankData.avatars[0]}
              alt={rankData.labels[0]}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex h-24 w-24 items-center justify-center rounded-t-lg bg-gradient-to-t from-yellow-500 to-yellow-300">
            <span className="text-xl font-bold text-white">1</span>
          </div>
          <div className="name mt-1 text-sm font-semibold text-gray-800">
            {rankData.labels[0]}
          </div>
          <div className="score text-sm font-medium text-gray-600">
            {rankData.values[0]} điểm
          </div>
        </div>

        {/* 3rd Place */}
        <div className="place-3 mx-3 flex flex-col items-center">
          <div className="avatar mb-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-yellow-700 bg-gray-200">
            <img
              src={rankData.avatars[2]}
              alt={rankData.labels[2]}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-t-lg bg-gradient-to-t from-yellow-700 to-yellow-600">
            <span className="text-lg font-bold text-white">3</span>
          </div>
          <div className="name mt-1 text-sm font-medium text-gray-700">
            {rankData.labels[2]}
          </div>
          <div className="score text-xs font-medium text-gray-500">
            {rankData.values[2]} điểm
          </div>
        </div>
      </div>

      {/* List of other ranks */}
      <div className="other-ranks mt-2 px-2">
        {rankData.labels.slice(3).map((name, idx) => {
          const position = idx + 4;
          return (
            <div
              key={position}
              className="rank-item flex items-center border-b border-gray-100 p-2"
            >
              <div className="position mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                {position}
              </div>
              <div className="avatar mr-3 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                <img
                  src={rankData.avatars[position - 1]}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="name flex-1 text-sm font-medium text-gray-700">
                {name}
              </div>
              <div className="score text-sm font-medium text-gray-600">
                {rankData.values[position - 1]} điểm
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Ranking;
