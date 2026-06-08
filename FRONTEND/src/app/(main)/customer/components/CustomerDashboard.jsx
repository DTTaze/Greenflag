"use client";

import { Activity, Coins, Leaf, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { useAuthStore } from "@/src/store/auth/authStore";
import getAmount from "@/src/utils/getAmount";

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const userInfo = user;
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-950">
          Welcome, {userInfo?.full_name || "Customer"}!
        </h1>
        <p className="text-sm text-gray-500">
          Track your environmental impact and manage your account.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {/* Environmental Impact Card */}
        <div className="flex h-[140px] flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <Leaf size={18} />
            <span>Environmental Impact</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">1,285 kg</div>
            <div className="mt-1 text-xs text-gray-500">CO2 Reduced</div>
          </div>
        </div>

        {/* Active Orders Card */}
        <div className="flex h-[140px] flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
            <Truck size={18} />
            <span>Active Orders</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="mt-1 text-xs text-gray-500">In Progress</div>
          </div>
        </div>

        {/* Rewards Points Card */}
        <div className="flex h-[140px] flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-500">
            <Coins size={18} />
            <span>Eco Coins</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {getAmount(userInfo?.coins)}
            </div>
            <div className="mt-1 text-xs text-gray-500">Available Coins</div>
          </div>
        </div>

        {/* Impact Timeline Card */}
        <div className="flex h-[140px] flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 text-sm font-medium text-sky-500">
            <Activity size={18} />
            <span>Impact Timeline</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="mt-1 text-xs text-gray-500">Completed Projects</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3 pt-2">
        <h3 className="text-lg font-semibold text-gray-950">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/customer/orders")}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            View Orders
          </button>
          <button
            onClick={() => router.push("/customer/rewards")}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Redeem Coins
          </button>
          <button
            onClick={() => router.push("/customer/profile")}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
