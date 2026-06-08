import React from "react";
import CoinBalance from "@/src/app/(main)/exchange-market/components/CoinBalance";

/**
 * Header component for the mission page
 * Displays user streaks and coin balance
 */
const MissionHeader = ({ userInfo, loading }) => {
  console.log("check user infor",userInfo)
  if (loading) {
    return (
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-green-500 to-green-400 rounded-xl p-6 text-white shadow-lg animate-pulse">
        <div>
          <div className="h-8 bg-white bg-opacity-20 rounded w-56 mb-2"></div>
          <div className="h-4 bg-white bg-opacity-20 rounded w-80"></div>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-3 mr-4 h-16 w-20"></div>
          <div className="h-10 bg-white bg-opacity-20 rounded-lg w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 text-white shadow-lg">
      <div>
        <h1 className="text-3xl font-bold mb-2">Nhiệm Vụ Của Bạn</h1>
        <p className="text-green-100 max-w-md">
          Hoàn thành nhiệm vụ để nhận xu và xây dựng chuỗi hoạt động liên
          tiếp
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center">
        <CoinBalance coins={userInfo?.coins || 0} className="scale-110" />
      </div>
    </div>
  );
};

export default MissionHeader;
