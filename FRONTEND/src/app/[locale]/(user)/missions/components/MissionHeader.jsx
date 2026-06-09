import { Sparkles } from "lucide-react";
import React from "react";

import CoinBalance from "@/src/app/[locale]/(user)/exchange-market/components/CoinBalance";

/**
 * Header component for the mission page
 * Displays user streaks and coin balance
 */
const MissionHeader = ({ userInfo, loading }) => {
  if (loading) {
    return (
      <div className="mb-8 flex animate-pulse flex-col items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-7 text-white shadow-md sm:flex-row">
        <div>
          <div className="mb-2.5 h-8 w-56 rounded bg-white/20"></div>
          <div className="h-4 w-80 rounded bg-white/20"></div>
        </div>
        <div className="mt-4 flex items-center sm:mt-0">
          <div className="h-16 w-64 rounded-xl bg-white/20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-col items-center justify-between rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-700 via-emerald-600 to-[#0B6E4F] p-7 text-white shadow-md sm:flex-row">
      <div className="mb-4 sm:mb-0">
        <h1 className="mb-2 flex items-center gap-2 text-2xl font-extrabold tracking-tight md:text-3xl">
          <Sparkles className="h-6 w-6 text-emerald-200" />
          Nhiệm Vụ Của Bạn
        </h1>
        <p className="max-w-md text-sm leading-relaxed font-medium text-emerald-100 opacity-90 md:text-base">
          Hoàn thành các thử thách xanh để tích lũy xu và chung tay bảo vệ môi
          trường.
        </p>
      </div>
      <div className="w-full sm:w-auto">
        <CoinBalance coins={userInfo?.coins || 0} />
      </div>
    </div>
  );
};

export default MissionHeader;
