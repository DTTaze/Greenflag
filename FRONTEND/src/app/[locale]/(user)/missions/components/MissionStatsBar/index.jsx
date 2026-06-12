import { useTranslations } from "next-intl";
import React from "react";

export default function MissionStatsBar({
  streak = 0,
  completedCount = 0,
  coinsReceived = 0,
}) {
  const t = useTranslations("missions.list");

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-3 dark:border-zinc-800/80 dark:bg-zinc-900">
      {/* Streak */}
      <div className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-orange-50/40 p-4 transition-all hover:shadow-xs dark:border-orange-900/20 dark:bg-orange-950/10">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-extrabold tracking-wider text-orange-700/80 uppercase dark:text-orange-400/80">
            {t("streak")}
          </p>
          <p className="text-xl font-black text-orange-600 dark:text-orange-400">
            {streak} {t("streak") === "Day Streak" ? "days" : "ngày"} 🔥
          </p>
        </div>
      </div>

      {/* Completed count */}
      <div className="flex items-center gap-4 rounded-2xl border border-green-100 bg-green-50/40 p-4 transition-all hover:shadow-xs dark:border-green-900/20 dark:bg-green-950/10">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-extrabold tracking-wider text-green-700/80 uppercase dark:text-green-400/80">
            {t("completedTasks")}
          </p>
          <p className="text-xl font-black text-green-600 dark:text-green-400">
            {completedCount}
          </p>
        </div>
      </div>

      {/* Coins received */}
      <div className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 transition-all hover:shadow-xs dark:border-amber-900/20 dark:bg-amber-950/10">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <circle cx="12" cy="12" r="8"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-extrabold tracking-wider text-amber-700/80 uppercase dark:text-amber-400/80">
            {t("coinsReceived")}
          </p>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400">
            {coinsReceived}{" "}
            {t("coinsReceived") === "Coins Received" ? "coins" : "xu"} 🪙
          </p>
        </div>
      </div>
    </div>
  );
}
