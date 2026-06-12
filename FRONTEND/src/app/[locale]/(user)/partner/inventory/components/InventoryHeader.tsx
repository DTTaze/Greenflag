import { Package } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export function InventoryHeader() {
  const t = useTranslations("partner");
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between rounded-3xl border border-emerald-200/50 bg-white/85 p-6 backdrop-blur-xl shadow-xs dark:border-emerald-500/20 dark:bg-slate-900/80">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-emerald-600 p-3.5 text-white shadow-md shadow-emerald-600/10 dark:bg-emerald-500 dark:text-zinc-950 dark:shadow-none transition-all duration-300">
          <Package size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {t("inventory.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
            {t("inventory.subtitle")}
          </p>
        </div>
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 dark:border-emerald-900/20 dark:bg-emerald-950/10 max-w-sm">
        <p className="text-xs font-bold tracking-wider text-emerald-800 uppercase dark:text-emerald-400">
          {t("inventory.badgeText")}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-650 dark:text-slate-400">
          {t("inventory.badgeDesc")}
        </p>
      </div>
    </div>
  );
}
