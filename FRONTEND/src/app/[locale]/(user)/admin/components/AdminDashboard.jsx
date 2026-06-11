"use client";

import { Calendar, Coins, MessageSquare, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { getAdminMacroStats, getAllUsers } from "@/src/utils/api";

import SimpleLineChart from "./ChartAdmin";
import RecentActivityList from "./RecentActivityList";
import StatCard from "./StatCard";

export default function AdminDashboard() {
  const t = useTranslations("admin.dashboard");
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    pendingPosts: 0,
    totalCoins: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUsers();
        if (response?.data) {
          // Transform user data into recent activities format and sort by last_logined
          const activities = response.data
            .map((user) => ({
              id: user.id,
              user: user.full_name,
              action: "logged in",
              time: new Date(user.last_logined).toLocaleString(),
              last_logined: new Date(user.last_logined),
            }))
            .sort((a, b) => b.last_logined - a.last_logined);
          setRecentActivities(activities);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const response = await getAdminMacroStats();
        if (response?.success && response?.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUsers();
    fetchStats();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-0">
      {/* Welcome header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
          {t("title")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("welcome")}
        </p>
      </div>

      {/* Admin Grid Container */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          title={t("totalUsers")}
          value={statsLoading ? "..." : stats.totalUsers.toLocaleString()}
          iconBgClass="bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
          trendText="+12.5%"
          trendSubtext={t("sinceLastMonth")}
          icon={Users}
        />

        <StatCard
          title={t("activeEvents")}
          value={statsLoading ? "..." : stats.activeEvents.toLocaleString()}
          iconBgClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
          trendText="+8.2%"
          trendSubtext={t("sinceLastWeek")}
          icon={Calendar}
        />

        <StatCard
          title={t("pendingPosts")}
          value={statsLoading ? "..." : stats.pendingPosts.toLocaleString()}
          iconBgClass="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
          trendText="+5.3%"
          trendSubtext={t("sinceLastMonth")}
          textColorClass="text-red-650 dark:text-red-400"
          icon={MessageSquare}
        />

        <StatCard
          title={t("totalCoins")}
          value={
            statsLoading ? "..." : `${stats.totalCoins.toLocaleString()} xu`
          }
          iconBgClass="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
          trendText="+16.8%"
          trendSubtext={t("sinceLastMonth")}
          icon={Coins}
        />
      </div>

      {/* Charts and Recent Activities Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Charts */}
        <div className="space-y-4 rounded-xl border border-emerald-200/60 bg-white p-6 shadow-sm md:col-span-2 dark:border-emerald-500/20 dark:bg-slate-950 dark:shadow-none">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">
              {t("activityOverview")}
            </h3>
            <button className="rounded-lg border border-emerald-200/50 bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 dark:border-emerald-500/15 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              {t("viewDetails")}
            </button>
          </div>
          <SimpleLineChart />
        </div>

        {/* Recent Activities */}
        <div className="md:col-span-1">
          <RecentActivityList
            recentActivities={recentActivities}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
