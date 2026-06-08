"use client";

import { CheckSquare, ShoppingBag, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

import { getAllUsers } from "@/src/utils/api";

import SimpleLineChart from "./ChartAdmin";
import RecentActivityList from "./RecentActivityList";
import StatCard from "./StatCard";

export default function AdminDashboard() {
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(false);

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

    fetchUsers();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-0">
      {/* Welcome header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome to your admin dashboard. Here&apos;s what&apos;s happening
          today.
        </p>
      </div>

      {/* Admin Grid Container */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Total Users"
          value="1,285"
          bgColor="#f0fdf4"
          trendText="+12.5%"
          trendSubtext="Since last month"
          icon={Users}
        />

        <StatCard
          title="Tasks Completed"
          value="824"
          bgColor="#ecfdf5"
          trendText="+8.2%"
          trendSubtext="Since last week"
          icon={CheckSquare}
        />

        <StatCard
          title="Total Items"
          value="452"
          bgColor="#fffbeb"
          trendText="+5.3%"
          trendSubtext="Since last month"
          icon={ShoppingBag}
        />

        <StatCard
          title="Total Revenue"
          value="$28,450"
          bgColor="#fff7ed"
          trendText="+16.8%"
          trendSubtext="Since last month"
        />
      </div>

      {/* Charts and Recent Activities Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Charts */}
        <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-950">
              Activity Overview
            </h3>
            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50">
              View Details
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
