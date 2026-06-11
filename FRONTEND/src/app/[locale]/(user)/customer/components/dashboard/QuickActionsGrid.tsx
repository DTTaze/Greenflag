"use client";

import { Activity, Award, Calendar, Coins, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActionsGrid() {
  const router = useRouter();

  const actions = [
    {
      icon: (
        <Truck size={24} className="text-emerald-600 dark:text-emerald-300" />
      ),
      label: "View Orders",
      onClick: () => router.push("/customer/orders"),
      hoverColor:
        "hover:border-emerald-300 hover:bg-emerald-50 dark:hover:border-emerald-400 dark:hover:bg-emerald-900",
    },
    {
      icon: (
        <Calendar size={24} className="text-purple-600 dark:text-purple-300" />
      ),
      label: "Events",
      onClick: () => router.push("/customer/events"),
      hoverColor:
        "hover:border-purple-300 hover:bg-purple-50 dark:hover:border-purple-400 dark:hover:bg-purple-900",
    },
    {
      icon: <Coins size={24} className="text-amber-500 dark:text-amber-300" />,
      label: "Redeem Coins",
      onClick: () => router.push("/customer/rewards"),
      hoverColor:
        "hover:border-amber-300 hover:bg-amber-50 dark:hover:border-amber-400 dark:hover:bg-amber-900",
    },
    {
      icon: <Activity size={24} className="text-blue-600 dark:text-blue-300" />,
      label: "Tasks",
      onClick: () => router.push("/customer/tasks"),
      hoverColor:
        "hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-900",
    },
    {
      icon: <Award size={24} className="text-sky-600 dark:text-sky-300" />,
      label: "Profile",
      onClick: () => router.push("/customer/profile"),
      hoverColor:
        "hover:border-sky-300 hover:bg-sky-50 dark:hover:border-sky-400 dark:hover:bg-sky-900",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className={`flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 transition-all focus:ring-2 focus:ring-emerald-300 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-emerald-500 ${action.hoverColor}`}
          >
            {action.icon}
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
