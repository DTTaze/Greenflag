import { useTranslations } from "next-intl";
import React from "react";

export default function MissionSidebarStats({
  completedCount = 0,
  coinsReceived = 0,
}) {
  const t = useTranslations("missions.list");

  return (
    <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/90 p-5 shadow-2xl shadow-emerald-200/30 transition-colors duration-300 dark:border-emerald-500/20 dark:bg-slate-900/80 dark:shadow-emerald-950/20 dark:backdrop-blur">
      <h2 className="mb-4 text-sm font-extrabold tracking-wider text-emerald-900 uppercase dark:text-slate-100">
        {t("stats")}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-100/70 p-4 text-center transition-colors duration-300 dark:border-emerald-500/15 dark:bg-emerald-500/10">
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
            {completedCount}
          </p>
          <p className="mt-1 text-[10px] leading-snug font-bold tracking-wide text-emerald-800 uppercase dark:text-emerald-200/80">
            {t("completedTasks")}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-100/70 p-4 text-center transition-colors duration-300 dark:border-emerald-500/15 dark:bg-emerald-500/10">
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
            {coinsReceived}
          </p>
          <p className="mt-1 text-[10px] leading-snug font-bold tracking-wide text-emerald-800 uppercase dark:text-emerald-200/80">
            {t("coinsReceived")}
          </p>
        </div>
      </div>
    </div>
  );
}
