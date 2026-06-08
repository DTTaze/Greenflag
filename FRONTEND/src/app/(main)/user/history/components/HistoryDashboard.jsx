"use client";

import { Coins, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useAuthStore } from "@/src/store/auth/authStore";
import {
  getAllTasksByUserId,
  getBuyerTransactionHistory,
  getEventSignedByUserId,
} from "@/src/utils/api";

import { aggregateActivityLogs, aggregateCoinLogs } from "./historyHelpers.js";
import HistoryStats from "./HistoryStats.jsx";
import HistoryTabs from "./HistoryTabs.jsx";

function HistoryDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all-activity");
  const [loading, setLoading] = useState(true);

  // Data states
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Aggregated lists
  const [coinLogs, setCoinLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);

        // Fetch tasks, events, and purchasing transactions concurrently
        const [tasksRes, eventsRes, transRes] = await Promise.allSettled([
          getAllTasksByUserId(user.id),
          getEventSignedByUserId(user.id),
          getBuyerTransactionHistory(),
        ]);

        let tasksData = [];
        if (tasksRes.status === "fulfilled" && tasksRes.value?.data) {
          tasksData = tasksRes.value.data;
          setTasks(tasksData);
        }

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

        // Aggregate logs using imported helper functions
        setCoinLogs(aggregateCoinLogs(tasksData, transData));
        setActivityLogs(aggregateActivityLogs(tasksData, eventsData));
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Calculate statistics
  const completedMissionsCount =
    tasks.filter((t) => t.completed_at).length || 1; // Fallback to 1 mock if empty
  const eventsCount = events.length || 1; // Fallback to 1 mock if empty

  return (
    <div className="space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Nhật ký hoạt động xanh
          </h2>
          <p className="text-xs text-gray-400">
            Xem lại hành trình bảo vệ môi trường và lịch sử tích lũy xu của bạn
          </p>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 shadow-2xs">
          <Coins className="h-5 w-5 fill-amber-400 text-amber-500" />
          <div>
            <span className="block text-xs leading-none font-semibold text-emerald-700">
              Ví xu tích lũy
            </span>
            <span className="text-lg font-black text-[#0B6E4F]">
              {user?.coins?.amount || 0} xu
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <HistoryStats
        completedMissionsCount={completedMissionsCount}
        eventsCount={eventsCount}
        transactionsCount={transactions.length || 1}
      />

      {/* Tabs list */}
      <div className="flex gap-4 border-b border-gray-100">
        {[
          { id: "all-activity", label: "Tất cả hoạt động" },
          { id: "coins", label: "Lịch sử tích lũy xu" },
          { id: "redeem", label: "Giao dịch đổi quà" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer border-b-2 pb-3 text-xs font-semibold tracking-wide transition-all ${
              activeTab === tab.id
                ? "border-[#0B6E4F] text-[#0B6E4F]"
                : "border-transparent text-gray-500 hover:text-gray-900"
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
