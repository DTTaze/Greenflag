import React from "react";

import CoinImg from "@/src/assets/images/Coin";
import Timer from "@/src/assets/images/Timer";

import { useVideoSection } from "./VideoSectionContext";

export default function StatsSection({ video }) {
  const { taskData: task, userStats, user, timer } = useVideoSection();
  const coins = user?.coins?.amount ?? 0;

  const onReceiveCoins = () => {
    // onReceiveCoins placeholder
  };

  return (
    <div className="relative mt-[6vh] ml-6 flex h-[85vh] w-[300px] [scrollbar-width:thin] [scrollbar-color:#0b6e4f_#f0f0f0] flex-col gap-6 overflow-y-auto rounded-xl bg-[#fafafa] p-5 shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all duration-300 max-[1200px]:w-[280px] max-[992px]:ml-4 max-[992px]:w-[250px] max-[992px]:p-[15px] max-[768px]:ml-2.5 max-[768px]:w-[220px] max-[768px]:gap-4 max-[576px]:order-2 max-[576px]:m-[10px_auto] max-[576px]:h-auto max-[576px]:max-h-[50vh] max-[576px]:w-[calc(100%-40px)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#0b6e4f] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#f0f0f0]">
      <div className="flex flex-col items-center border-b border-[#f0f0f0] pb-5 text-center">
        <div className="ease mb-3.5 h-[90px] w-[90px] overflow-hidden rounded-full border-3 border-[#0b6e4f] shadow-[0_4px_10px_rgba(11,110,79,0.2)] transition-all duration-300 hover:scale-105 max-[992px]:h-20 max-[992px]:w-20">
          <img
            src={
              video?.postedBy?.avatar ||
              "https://placehold.co/80x80/0B6E4F/fff?text=G"
            }
            alt="User profile"
            className="h-full w-full object-cover"
          />
        </div>
        <h3 className="m-[0_0_4px_0] text-[20px] font-semibold text-[#333] max-[992px]:text-[18px]">
          {video?.postedBy?.username || "EcoUser"}
        </h3>
        <p className="m-[0_0_16px_0] text-[14px] text-[#666]">
          Environmental Activist
        </p>
        <button className="cursor-pointer rounded-[24px] border-none bg-[#0b6e4f] px-6 py-2 font-semibold text-white shadow-[0_2px_8px_rgba(11,110,79,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#10a56c] hover:shadow-[0_4px_12px_rgba(11,110,79,0.4)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(11,110,79,0.3)]">
          Follow
        </button>
      </div>

      {/* Coins and Timer Display */}
      <div className="rounded-[10px] border-l-4 border-[#0b6e4f] bg-[#f5f5f5] p-4 shadow-[inset_0_0_8px_rgba(0,0,0,0.05)]">
        <h4 className="m-[0_0_16px_0] flex items-center gap-2 text-[16px] font-semibold text-[#333] after:h-px after:flex-1 after:bg-[#e0e0e0] after:content-[''] max-[768px]:mb-3 max-[768px]:text-[15px]">
          Your Rewards
        </h4>
        <div className="flex flex-col gap-3 max-[576px]:flex-row max-[576px]:flex-wrap">
          {/* Coins Display */}
          <div
            className="ease flex cursor-pointer items-center gap-3 rounded-[10px] border-l-3 border-[#f9a826] bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:translate-x-[5px] hover:bg-[#fefaf0] max-[768px]:p-2.5 max-[576px]:min-w-[120px] max-[576px]:flex-1 [&_svg]:h-7 [&_svg]:w-7 [&_svg]:text-[#0b6e4f]"
            onClick={onReceiveCoins}
          >
            <CoinImg />
            <div className="flex flex-1 flex-col">
              <span className="mb-0.5 text-[12px] text-[#666]">EcoCoins</span>
              <span className="text-[18px] font-semibold text-[#333] max-[768px]:text-[16px]">
                {coins}
              </span>
            </div>
          </div>

          {/* Timer Display */}
          <div className="ease flex items-center gap-3 rounded-[10px] border-l-3 border-[#3498db] bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:translate-x-[5px] hover:bg-[#f0f9ff] max-[768px]:p-2.5 max-[576px]:min-w-[120px] max-[576px]:flex-1 [&_svg]:h-7 [&_svg]:w-7 [&_svg]:text-[#0b6e4f]">
            <Timer />
            <div className="flex flex-1 flex-col">
              <span className="mb-0.5 text-[12px] text-[#666]">Remaining</span>
              <span className="text-[18px] font-semibold text-[#333] max-[768px]:text-[16px]">
                {timer}s
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="m-[0_0_16px_0] flex items-center gap-2 text-[16px] font-semibold text-[#333] after:h-px after:flex-1 after:bg-[#e0e0e0] after:content-[''] max-[768px]:mb-3 max-[768px]:text-[15px]">
          Eco Impact
        </h4>

        <div className="flex items-center gap-3 rounded-lg bg-[#f0f0f0] p-2.5 transition-all duration-200 hover:translate-x-[5px] hover:bg-[#e8e8e8]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b6e4f]/10 text-[#0b6e4f] [&_svg]:h-5 [&_svg]:w-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] text-[#666]">Tasks Completed</span>
            <span className="text-[16px] font-semibold text-[#333]">
              {userStats?.tasksCompleted || 12}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-[#f0f0f0] p-2.5 transition-all duration-200 hover:translate-x-[5px] hover:bg-[#e8e8e8]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1976d2]/10 text-[#1976d2] [&_svg]:h-5 [&_svg]:w-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] text-[#666]">Watch Time</span>
            <span className="text-[16px] font-semibold text-[#333]">
              {userStats?.watchTime || "45 min"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-[#f0f0f0] p-2.5 transition-all duration-200 hover:translate-x-[5px] hover:bg-[#e8e8e8]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7cb342]/10 text-[#7cb342] [&_svg]:h-5 [&_svg]:w-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              <path d="M8 16l4-4 4 4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] text-[#666]">EcoPoints Earned</span>
            <span className="text-[16px] font-semibold text-[#333]">
              {userStats?.ecoPoints || 150}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <h4 className="m-[0_0_16px_0] flex items-center gap-2 text-[16px] font-semibold text-[#333] after:h-px after:flex-1 after:bg-[#e0e0e0] after:content-[''] max-[768px]:mb-3 max-[768px]:text-[15px]">
          Current Task
        </h4>
        <div className="rounded-lg border-l-4 border-[#0b6e4f] bg-[#f5f5f5] p-4">
          <div className="mb-2 inline-block rounded bg-[#0b6e4f]/10 px-2 py-1 text-[12px] font-semibold text-[#0b6e4f]">
            {video?.ecoTag || "Environmental Task"}
          </div>
          <h5 className="m-[0_0_8px_0] text-[16px] font-semibold text-[#333]">
            {task?.title || "Watch and Learn"}
          </h5>
          <p className="m-[0_0_12px_0] text-[14px] leading-[1.4] text-[#666]">
            {task?.description ||
              "Watch this eco-friendly video to earn EcoCoins and learn how to make a difference."}
          </p>
          <div className="flex w-fit items-center gap-1.5 rounded-[20px] bg-white px-3 py-2 [&_svg]:h-[18px] [&_svg]:w-[18px]">
            <CoinImg />
            <span>{task?.reward || 3} EcoCoins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
