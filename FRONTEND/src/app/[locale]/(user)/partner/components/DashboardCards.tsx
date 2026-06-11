import React from "react";
import type { LucideIcon } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

type DashboardCardItem = {
  key: string;
  href: string;
  icon: LucideIcon;
  accent: string;
  title: string;
  description: string;
  openLabel: string;
};

type DashboardCardsProps = {
  items: DashboardCardItem[];
};

export function DashboardCards({ items }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <DashboardCard key={item.key} {...item} />
      ))}
    </div>
  );
}
