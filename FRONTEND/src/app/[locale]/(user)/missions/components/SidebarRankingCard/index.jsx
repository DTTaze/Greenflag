import { useTranslations } from "next-intl";
import React from "react";

import Ranking from "../ChartRank/index.jsx";

export default function SidebarRankingCard() {
  const t = useTranslations("missions.list");

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-200/70 bg-emerald-50/80 shadow-2xl shadow-emerald-200/30 transition-colors duration-300 dark:border-emerald-500/20 dark:bg-slate-900/80 dark:shadow-emerald-950/20 dark:backdrop-blur">
      <div className="border-b border-emerald-100 bg-teal-50/70 p-4 transition-colors duration-300 dark:border-emerald-500/20 dark:bg-[#064E3B]/20">
        <h2 className="text-sm font-extrabold tracking-wider text-emerald-900 uppercase dark:text-slate-100">
          {t("ranking")}
        </h2>
      </div>
      <div className="p-4">
        <Ranking />
      </div>
    </div>
  );
}
