import React from "react";

import CoinBalance from "@/src/app/(main)/exchange-market/components/CoinBalance";

/**
 * Header component for the mission page
 * Displays user streaks and coin balance
 */
const MissionHeader = ({ userInfo, loading }) => {
  console.log("check user infor", userInfo);
  if (loading) {
    return (
      <div className="mb-8 flex animate-pulse flex-col items-center justify-between rounded-xl bg-gradient-to-r from-green-500 to-green-400 p-6 text-white shadow-lg sm:flex-row">
        <div>
          <div className="bg-opacity-20 mb-2 h-8 w-56 rounded bg-white"></div>
          <div className="bg-opacity-20 h-4 w-80 rounded bg-white"></div>
        </div>
        <div className="mt-4 flex items-center sm:mt-0">
          <div className="bg-opacity-20 mr-4 h-16 w-20 rounded-lg bg-white p-3"></div>
          <div className="bg-opacity-20 h-10 w-24 rounded-lg bg-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-col items-center justify-between rounded-xl bg-gradient-to-r from-green-600 to-green-500 p-6 text-white shadow-lg sm:flex-row">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Nhiệm Vụ Của Bạn</h1>
        <p className="max-w-md text-green-100">
          Hoàn thành nhiệm vụ để nhận xu và xây dựng chuỗi hoạt động liên tiếp
        </p>
      </div>
      <div className="mt-4 flex items-center sm:mt-0">
        <CoinBalance coins={userInfo?.coins || 0} className="scale-110" />
      </div>
    </div>
  );
};

export default MissionHeader;
