"use client";

import { Activity } from "lucide-react";

import { recentActivities } from "../dashboardData";
import ActivityItem from "./ActivityItem";

export default function RecentActivities() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
          <Activity
            size={24}
            className="text-emerald-600 dark:text-emerald-400"
          />
          Recent Activities
        </h2>
      </div>
      <div className="space-y-3">
        {recentActivities.map((activity) => (
          <ActivityItem
            key={activity.id}
            icon={activity.icon}
            title={activity.title}
            date={activity.date}
            color={activity.color}
          />
        ))}
      </div>
    </div>
  );
}
