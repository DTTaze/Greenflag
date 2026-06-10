"use client";

import { Coins, Gift } from "lucide-react";
import React from "react";

import { useAuthStore } from "@/src/store/auth/authStore";
import getAmount from "@/src/utils/getAmount";

export default function CustomerRewardsPage() {
  const { user } = useAuthStore();
  const coinBalance = getAmount(user?.coins);

  const rewardItems = [
    {
      id: 1,
      title: "Reusable Water Bottle",
      description: "Redeem 150 EcoCoins for a branded stainless bottle.",
      cost: 150,
    },
    {
      id: 2,
      title: "Tree Planting Voucher",
      description: "Use 250 EcoCoins to sponsor one tree planting.",
      cost: 250,
    },
    {
      id: 3,
      title: "Recycling Kit",
      description: "Spend 400 EcoCoins for a starter recycling kit.",
      cost: 400,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Gift size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-950">Rewards</h1>
            <p className="mt-1 text-sm text-gray-500">
              Redeem your EcoCoins for sustainable rewards.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-emerald-50 p-5">
            <div className="text-sm text-gray-600">Your balance</div>
            <div className="mt-2 flex items-center gap-2 text-3xl font-semibold text-emerald-700">
              <Coins size={28} />
              {coinBalance}
            </div>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-5">
            <div className="text-sm text-gray-600">How it works</div>
            <p className="mt-2 text-sm text-gray-700">
              Earn coins by completing eco-friendly tasks and events. Redeem
              them for rewards or donate them to green projects.
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-950">
            Available rewards
          </h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
            {rewardItems.length} offers
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {rewardItems.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                <Gift size={18} />
                <span>{item.title}</span>
              </div>
              <p className="mt-3 text-sm text-gray-600">{item.description}</p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-lg font-semibold text-gray-900">
                  {item.cost} EcoCoins
                </span>
                <button
                  type="button"
                  className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  disabled={coinBalance < item.cost}
                  onClick={() =>
                    window.alert(
                      `Redeem ${item.title} for ${item.cost} EcoCoins`,
                    )
                  }
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
