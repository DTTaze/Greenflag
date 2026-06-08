"use client";

import { Leaf, Truck, Coins, Activity } from "lucide-react";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Environmental Impact Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-[140px] hover:shadow-md transition-all">
          <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
            <Leaf size={18} />
            <span>Environmental Impact</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">1,285 kg</div>
            <div className="text-xs text-gray-500 mt-1">CO2 Reduced</div>
          </div>
        </div>

        {/* Active Orders Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-[140px] hover:shadow-md transition-all">
          <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
            <Truck size={18} />
            <span>Active Orders</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="text-xs text-gray-500 mt-1">In Progress</div>
          </div>
        </div>

        {/* Rewards Points Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-[140px] hover:shadow-md transition-all">
          <div className="flex items-center gap-2 text-amber-500 font-medium text-sm">
            <Coins size={18} />
            <span>Eco Coins</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {getAmount(userInfo?.coins)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Available Coins</div>
          </div>
        </div>

        {/* Impact Timeline Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-[140px] hover:shadow-md transition-all">
          <div className="flex items-center gap-2 text-sky-500 font-medium text-sm">
            <Activity size={18} />
            <span>Impact Timeline</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-xs text-gray-500 mt-1">Completed Projects</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3 pt-2">
        <h3 className="text-lg font-semibold text-gray-950">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/customer/orders")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
          >
            View Orders
          </button>
          <button
            onClick={() => router.push("/customer/rewards")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
          >
            Redeem Coins
          </button>
          <button
            onClick={() => router.push("/customer/profile")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
