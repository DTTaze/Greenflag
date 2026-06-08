import React, { useState, useEffect } from "react";
import { rearrangeRankApi, getUserByIdApi } from "@/src/utils/api";

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
        console.log("ranking response: ", response)

        if (response.data && response.success) {
          const ranks = response.data;

          // Fetch user details for each rank
          const ranksWithUserDetails = await Promise.all(
            ranks.map(async (rank) => {
              try {
                const userResponse = await getUserByIdApi(rank.user_id);
                console.log("user response in ranking", userResponse)

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
                  err
                );
                return null; // Return null if there's an error
              }
            })
          );

          // Filter out null values and users with role_id !== 2
          const filteredRanks = ranksWithUserDetails.filter(
            (rank) => rank !== null && rank.user && rank.user.roles.id === 2
          );

          // Transform the data for the chart
          const transformedData = {
            labels: filteredRanks.map(
              (rank) => rank.user?.full_name || "Unknown"
            ),
            values: filteredRanks.map((rank) => rank.amount),
            avatars: filteredRanks.map((rank) => rank.user.avatar_url),
          };

          setRankData(transformedData);
          console.log("filteredRanks data: ", ranksWithUserDetails)
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ranking-container">
        <div className="text-center text-red-500 p-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="ranking-container">
      {/* Top 3 Users Section */}
      <div className="top-users flex justify-center items-end mb-6 pt-4">
        {/* 2nd Place */}
        <div className="place-2 flex flex-col items-center mx-3">
          <div className="avatar w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 overflow-hidden mb-2">
            <img
              src={rankData.avatars[1]}
              alt={rankData.labels[1]}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-20 w-20 bg-silver rounded-t-lg flex items-center justify-center bg-gradient-to-t from-gray-400 to-gray-300">
            <span className="text-white font-bold text-lg">2</span>
          </div>
          <div className="name text-sm font-medium mt-1 text-gray-700">
            {rankData.labels[1]}
          </div>
          <div className="score text-xs text-gray-500 font-medium">
            {rankData.values[1]} điểm
          </div>
        </div>

        {/* 1st Place */}
        <div className="place-1 flex flex-col items-center mx-4">
          <div className="crown text-yellow-500 -mb-3">👑</div>
          <div className="avatar w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center border-2 border-yellow-400 overflow-hidden mb-2">
            <img
              src={rankData.avatars[0]}
              alt={rankData.labels[0]}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-24 w-24 rounded-t-lg flex items-center justify-center bg-gradient-to-t from-yellow-500 to-yellow-300">
            <span className="text-white font-bold text-xl">1</span>
          </div>
          <div className="name text-sm font-semibold mt-1 text-gray-800">
            {rankData.labels[0]}
          </div>
          <div className="score text-sm text-gray-600 font-medium">
            {rankData.values[0]} điểm
          </div>
        </div>

        {/* 3rd Place */}
        <div className="place-3 flex flex-col items-center mx-3">
          <div className="avatar w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-yellow-700 overflow-hidden mb-2">
            <img
              src={rankData.avatars[2]}
              alt={rankData.labels[2]}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-16 w-16 rounded-t-lg flex items-center justify-center bg-gradient-to-t from-yellow-700 to-yellow-600">
            <span className="text-white font-bold text-lg">3</span>
          </div>
          <div className="name text-sm font-medium mt-1 text-gray-700">
            {rankData.labels[2]}
          </div>
          <div className="score text-xs text-gray-500 font-medium">
            {rankData.values[2]} điểm
          </div>
        </div>
      </div>

      {/* List of other ranks */}
      <div className="other-ranks px-2 mt-2">
        {rankData.labels.slice(3).map((name, idx) => {
          const position = idx + 4;
          return (
            <div
              key={position}
              className="rank-item flex items-center p-2 border-b border-gray-100"
            >
              <div className="position w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm mr-3">
                {position}
              </div>
              <div className="avatar w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                <img
                  src={rankData.avatars[position - 1]}
                  alt={name}
                  className="w-full h-full object-cover"
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
