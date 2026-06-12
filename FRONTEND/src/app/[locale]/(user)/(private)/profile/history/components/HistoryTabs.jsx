"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

function HistoryTabs({
  activeTab,
  activityLogs,
  coinLogs,
  transactions,
  formatDate,
}) {
  const t = useTranslations("user.history");

  if (activeTab === "all-activity") {
    if (activityLogs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500 dark:text-zinc-400">
          <p className="text-xs font-semibold">{t("noActivities")}</p>
        </div>
      );
    }

    return (
      <div className="relative ml-3 space-y-6 border-l border-emerald-200/60 py-2 pl-6 dark:border-emerald-500/15">
        {activityLogs.map((act) => {
          const isCompleted =
            act.statusKey === "statusCompleted" ||
            act.statusKey === "statusCheckin";
          return (
            <div key={act.id} className="relative">
              <div
                className={`absolute top-0.5 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-white shadow-xs ${
                  act.category === "task" ? "bg-blue-500" : "bg-green-500"
                }`}
              />
              <div className="space-y-1">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {act.title}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        isCompleted
                          ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}
                    >
                      {t(act.statusKey)}
                    </span>
                  </span>
                  <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                    {formatDate(act.date)}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {act.category === "task" ? (
                    act.isMock ? (
                      t("mockTaskDetails")
                    ) : (
                      t("progressInfo", {
                        current: act.progress.current,
                        total: act.progress.total,
                      })
                    )
                  ) : act.isMock ? (
                    t("eventLocation", { location: act.mockDetails })
                  ) : (
                    t("eventLocation", { location: act.details })
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (activeTab === "coins") {
    if (coinLogs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500 dark:text-zinc-400">
          <p className="text-xs font-semibold">{t("noCoins")}</p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-emerald-100/50 dark:divide-emerald-500/10">
        {coinLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between py-3.5"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  log.type === "earn"
                    ? "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400"
                    : "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                }`}
              >
                {log.type === "earn" ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
              </div>
              <div>
                <span className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {t(log.translationKey, log.translationParams)}
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  {formatDate(log.date)}
                </span>
              </div>
            </div>
            <span
              className={`text-sm font-black ${
                log.type === "earn"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {log.type === "earn" ? "+" : "-"}
              {log.amount} {t("coinSuffix")}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === "redeem") {
    const hasTransactions = transactions.length > 0;

    return (
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="border-b border-emerald-100/70 font-semibold text-zinc-400 hover:bg-transparent dark:border-emerald-500/10">
            <TableHead className="h-auto px-2 py-3 text-zinc-400 dark:text-zinc-500">
              {t("thTime")}
            </TableHead>
            <TableHead className="h-auto px-2 py-3 text-zinc-400 dark:text-zinc-500">
              {t("thItem")}
            </TableHead>
            <TableHead className="h-auto px-2 py-3 text-zinc-400 dark:text-zinc-500">
              {t("thQuantity")}
            </TableHead>
            <TableHead className="h-auto px-2 py-3 text-zinc-400 dark:text-zinc-500">
              {t("thTotal")}
            </TableHead>
            <TableHead className="h-auto px-2 py-3 text-zinc-400 dark:text-zinc-500">
              {t("thStatus")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-emerald-100/50 font-medium text-zinc-650 dark:divide-emerald-500/10 dark:text-zinc-300">
          {hasTransactions ? (
            transactions.map((tr) => (
              <TableRow
                key={tr.id}
                className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
              >
                <TableCell className="px-2 py-3 text-[10px] text-zinc-400 dark:text-zinc-500">
                  {formatDate(new Date(tr.createdAt || tr.created_at))}
                </TableCell>
                <TableCell className="px-2 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  {tr.name || tr.itemSnapshot?.name || tr.item_snapshot?.name || tr.item?.name || "Vật phẩm"}
                </TableCell>
                <TableCell className="px-2 py-3">{tr.quantity || 1}</TableCell>
                <TableCell className="px-2 py-3 font-black text-red-650 dark:text-red-400">
                  -{tr.totalPrice || tr.total_price || 0} {t("coinSuffix")}
                </TableCell>
                <TableCell className="px-2 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      tr.status === "accepted"
                        ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
                        : tr.status === "cancelled"
                          ? "bg-red-100 text-red-800 dark:bg-red-955/30 dark:text-red-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                    }`}
                  >
                    {tr.status === "accepted"
                      ? t("statusReceived")
                      : tr.status === "cancelled"
                        ? t("statusCancelled")
                        : t("statusProcessing")}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-zinc-500 dark:text-zinc-400">
                {t("noGifts")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }

  return null;
}

export default HistoryTabs;
