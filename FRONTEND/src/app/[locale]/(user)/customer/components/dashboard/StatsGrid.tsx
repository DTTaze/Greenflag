"use client";

import { Coins, Leaf, TrendingUp, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

import getAmount from "@/src/utils/getAmount";

import StatCard from "./StatCard";

interface StatsGridProps {
  coins?: number;
}

export default function StatsGrid({ coins }: StatsGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Leaf size={20} />}
        title="Environmental Impact"
        value={1285}
        unit="kg CO2"
        trend={{
          value: "+12% this month",
          icon: <TrendingUp size={14} />,
        }}
        accentColor="text-emerald-600"
        bgColor="bg-emerald-50"
        borderColor="border-emerald-100"
      />

      <StatCard
        icon={<Truck size={20} />}
        title="Active Orders"
        value={3}
        unit="orders"
        accentColor="text-blue-600"
        bgColor="bg-blue-50"
        borderColor="border-blue-100"
      />

      <StatCard
        icon={<Coins size={20} />}
        title="Eco Coins"
        value={getAmount(coins)}
        unit="coins"
        action={{
          label: "Redeem Now",
          onClick: () => router.push("/customer/rewards"),
        }}
        accentColor="text-amber-600"
        bgColor="bg-amber-50"
        borderColor="border-amber-100"
      />

      <StatCard
        icon={<Leaf size={20} />}
        title="Achievements"
        value={2}
        unit="unlocked"
        accentColor="text-purple-600"
        bgColor="bg-purple-50"
        borderColor="border-purple-100"
      />
    </div>
  );
}
