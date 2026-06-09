import { Sparkles } from "lucide-react";
import React from "react";

import CoinBalance from "@/src/app/[locale]/(user)/exchange-market/components/CoinBalance";

/**
 * Header component for the mission page
 */
const MissionHeader = ({ userInfo, loading }) => {
  if (loading) {
    return (
      <div className="mb-8 flex animate-pulse flex-col items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-7 text-white shadow-lg sm:flex-row">
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
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#0B6E4F] via-[#0d7353] to-[#054E37] p-7 text-white shadow-xl sm:flex-row flex flex-col justify-between items-center gap-6">
      {/* Decorative backdrop glow */}
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-[#129A72]/20 blur-3xl pointer-events-none"></div>

      <div className="flex-1 text-center sm:text-left">
        <h1 className="mb-2 flex items-center justify-center sm:justify-start gap-2.5 text-2xl font-extrabold tracking-tight md:text-3xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
            <Sparkles className="h-5 w-5 text-emerald-200 animate-pulse" />
          </div>
          Nhiệm Vụ Của Bạn
        </h1>
        <p className="max-w-md text-sm md:text-[0.95rem] leading-relaxed font-medium text-emerald-100/90">
          Hoàn thành các thử thách xanh để tích lũy xu và chung tay bảo vệ môi trường mỗi ngày.
        </p>
      </div>

      <div className="w-full sm:w-auto flex justify-center">
        <div className="rounded-2xl bg-white/5 backdrop-blur-md p-4 border border-white/15 shadow-inner min-w-[220px]">
          <span className="block text-[10px] font-bold tracking-wider text-emerald-200/80 uppercase mb-1.5 text-center">
            Số dư tài khoản
          </span>
          <CoinBalance coins={userInfo?.coins || 0} />
        </div>
      </div>
    </div>
  );
};

export default MissionHeader;
