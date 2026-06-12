"use client";

import { Calendar, ClipboardList, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

function HistoryStats({
  completedMissionsCount,
  eventsCount,
  transactionsCount,
}) {
  const t = useTranslations("user.history");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/30 p-4 dark:border-blue-900/30 dark:bg-blue-950/25">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <ClipboardList size={20} />
        </div>
        <div>
          <span className="block text-xs font-medium text-blue-700 dark:text-blue-400">
            {t("statsMissions")}
          </span>
          <span className="text-xl font-bold text-blue-900 dark:text-blue-200">
            {t("statsMissionsDesc", { count: completedMissionsCount })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50/30 p-4 dark:border-emerald-500/20 dark:bg-emerald-950/20">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <Calendar size={20} />
        </div>
        <div>
          <span className="block text-xs font-medium text-green-700 dark:text-emerald-400">
            {t("statsEvents")}
          </span>
          <span className="text-xl font-bold text-green-900 dark:text-emerald-200">
            {t("statsEventsDesc", { count: eventsCount })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/30 p-4 dark:border-amber-900/30 dark:bg-amber-950/25">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
          <ShoppingBag size={20} />
        </div>
        <div>
          <span className="block text-xs font-medium text-amber-700 dark:text-amber-400">
            {t("statsGifts")}
          </span>
          <span className="text-xl font-bold text-amber-900 dark:text-amber-200">
            {t("statsGiftsDesc", { count: transactionsCount })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default HistoryStats;
