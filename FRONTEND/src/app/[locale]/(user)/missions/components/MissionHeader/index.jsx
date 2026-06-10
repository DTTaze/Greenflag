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
    <div className="relative mb-8 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#0B6E4F] via-[#0d7353] to-[#054E37] p-7 text-white shadow-xl sm:flex-row">
      {/* Decorative backdrop glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#129A72]/20 blur-3xl"></div>

      <div className="flex-1 text-center sm:text-left">
        <h1 className="mb-2 flex items-center justify-center gap-2.5 text-2xl font-extrabold tracking-tight sm:justify-start md:text-3xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md">
            <Sparkles className="h-5 w-5 animate-pulse text-emerald-200" />
          </div>
          Nhiệm Vụ Của Bạn
        </h1>
        <p className="max-w-md text-sm leading-relaxed font-medium text-emerald-100/90 md:text-[0.95rem]">
          Hoàn thành các thử thách xanh để tích lũy xu và chung tay bảo vệ môi
          trường mỗi ngày.
        </p>
      </div>

      <div className="flex w-full justify-center sm:w-auto">
        <div className="min-w-[220px] rounded-2xl border border-white/15 bg-white/5 p-4 shadow-inner backdrop-blur-md">
          <span className="mb-1.5 block text-center text-[10px] font-bold tracking-wider text-emerald-200/80 uppercase">
            Số dư tài khoản
          </span>
          <CoinBalance coins={userInfo?.coins || 0} />
        </div>
      </div>
    </div>
  );
};

export default MissionHeader;
