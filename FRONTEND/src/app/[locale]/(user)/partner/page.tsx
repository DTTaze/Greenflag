"use client";

import {
  BarChart2,
  Briefcase,
  Calendar,
  ClipboardList,
  Package,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { DashboardCards } from "./components/DashboardCards";
import { DashboardHeader } from "./components/DashboardHeader";

export default function PartnerPage() {
  const t = useTranslations("partner");
  const cardItems = [
    {
      key: "profile",
      href: "/partner/profile",
      icon: User,
      accent: "bg-emerald-50 text-emerald-700",
      title: t("cards.profile.title"),
      description: t("cards.profile.description"),
    },
    {
      key: "tasks",
      href: "/partner/tasks",
      icon: ClipboardList,
      accent: "bg-cyan-50 text-cyan-700",
      title: t("cards.tasks.title"),
      description: t("cards.tasks.description"),
    },
    {
      key: "events",
      href: "/partner/events",
      icon: Calendar,
      accent: "bg-blue-50 text-blue-700",
      title: t("cards.events.title"),
      description: t("cards.events.description"),
    },
    {
      key: "inventory",
      href: "/partner/inventory",
      icon: Package,
      accent: "bg-violet-50 text-violet-700",
      title: t("cards.inventory.title"),
      description: t("cards.inventory.description"),
    },
    {
      key: "reports",
      href: "/partner/reports",
      icon: BarChart2,
      accent: "bg-amber-50 text-amber-700",
      title: t("cards.reports.title"),
      description: t("cards.reports.description"),
    },
  ];

  const cards = cardItems.map((item) => ({
    ...item,
    openLabel: t("openCard", { title: item.title }),
  }));

  return (
    <div className="p-6">
      <DashboardHeader
        icon={Briefcase}
        version={t("dashboard.version")}
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        toolsTitle={t("dashboard.toolsTitle")}
        toolsDescription={t("dashboard.toolsDescription")}
      />
      <DashboardCards items={cards} />
    </div>
  );
}
