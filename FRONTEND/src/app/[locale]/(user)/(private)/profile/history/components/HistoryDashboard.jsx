"use client";

import { Coins, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { useUserTasksQuery } from "@/src/queries/task/useTaskQueries";
import { useAuthStore } from "@/src/store/auth/authStore";
import {
  getBuyerTransactionHistory,
  getEventSignedByUserId,
} from "@/src/utils/api";

import { aggregateActivityLogs, aggregateCoinLogs } from "./historyHelpers";
import HistoryStats from "./HistoryStats.jsx";
import HistoryTabs from "./HistoryTabs.jsx";

function HistoryDashboard() {
  const { user } = useAuthStore();
  const t = useTranslations("user.history");
  const [activeTab, setActiveTab] = useState("all-activity");

  // React Query hook for task history
  const { data: rawTasksData, isLoading: isTasksLoading } = useUserTasksQuery(
    user?.id || "",
  );

  const tasksData = useMemo(() => {
    if (Array.isArray(rawTasksData)) return rawTasksData;
    if (
      rawTasksData &&
      typeof rawTasksData === "object" &&
      "data" in rawTasksData &&
      Array.isArray(rawTasksData.data)
    ) {
      return rawTasksData.data;
    }
    return [];
  }, [rawTasksData]);

  const [loading, setLoading] = useState(true);

  // Data states
  const [events, setEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Aggregated lists computed reactively via useMemo
  const coinLogs = useMemo(
    () => aggregateCoinLogs(tasksData, transactions, events),
    [tasksData, transactions, events],
  );
  const activityLogs = useMemo(
    () => aggregateActivityLogs(tasksData, events),
    [tasksData, events],
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);

        // Fetch events and purchasing transactions concurrently
        const [eventsRes, transRes] = await Promise.allSettled([
          getEventSignedByUserId(user.id),
          getBuyerTransactionHistory(),
        ]);

        let eventsData = [];
        if (eventsRes.status === "fulfilled" && eventsRes.value?.data) {
          eventsData = eventsRes.value.data;
          setEvents(eventsData);
        }

        let transData = [];
        if (transRes.status === "fulfilled" && transRes.value?.data) {
          transData = transRes.value.data;
          setTransactions(transData);
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
        toast.error("Không thể tải lịch sử hoạt động");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || isTasksLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-emerald-200/60 bg-white shadow-sm dark:border-emerald-500/15 dark:bg-zinc-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Calculate statistics from real user data
  const completedMissionsCount = tasksData.filter(
    (t) => t.completedAt || t.completed_at,
  ).length;
  const eventsCount = events.length;
  const transactionsCount = transactions.length;

  return (
    <div className="space-y-6 rounded-3xl border border-emerald-200/60 bg-white p-6 shadow-xl dark:border-emerald-500/15 dark:bg-zinc-950 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-emerald-100 pb-5 sm:flex-row sm:items-center dark:border-emerald-500/10">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {t("title")}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 shadow-2xs dark:border-emerald-500/20 dark:bg-emerald-950/20">
          <Coins className="h-5 w-5 fill-amber-400 text-amber-500" />
          <div>
            <span className="block text-xs leading-none font-semibold text-emerald-700 dark:text-emerald-400">
              {t("coinWallet")}
            </span>
            <span className="text-lg font-black text-[#0B6E4F] dark:text-emerald-400">
              {user?.coins?.amount || 0} {t("coinSuffix")}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <HistoryStats
        completedMissionsCount={completedMissionsCount}
        eventsCount={eventsCount}
        transactionsCount={transactionsCount}
      />

      {/* Tabs list */}
      <div className="flex gap-4 border-b border-emerald-100 dark:border-emerald-500/10">
        {[
          { id: "all-activity", label: t("tabAllActivity") },
          { id: "coins", label: t("tabCoins") },
          { id: "redeem", label: t("tabRedeem") },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer border-b-2 pb-3 text-xs font-semibold tracking-wide transition-all ${
              activeTab === tab.id
                ? "border-[#0B6E4F] text-[#0B6E4F] dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lists display based on selected tab */}
      <div className="space-y-4">
        <HistoryTabs
          activeTab={activeTab}
          activityLogs={activityLogs}
          coinLogs={coinLogs}
          transactions={transactions}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
}

export default HistoryDashboard;
