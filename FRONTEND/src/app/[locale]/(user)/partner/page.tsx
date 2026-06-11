"use client";

import {
  BarChart2,
  Briefcase,
  Calendar,
  ClipboardList,
  Package,
  User,
} from "lucide-react";
import Link from "next/link";

export default function PartnerPage() {
  const items = [
    {
      title: "Partner Profile",
      description:
        "Update your organization profile, certifications, and contact details.",
      href: "/partner/profile",
      icon: User,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Partner Tasks",
      description: "Create sustainable assignments and reward participation.",
      href: "/partner/tasks",
      icon: ClipboardList,
      accent: "bg-cyan-50 text-cyan-700",
    },
    {
      title: "Partner Events",
      description: "Plan campaigns, generate QR codes and track attendance.",
      href: "/partner/events",
      icon: Calendar,
      accent: "bg-blue-50 text-blue-700",
    },
    {
      title: "Inventory",
      description: "Keep reward stock and item availability in sync.",
      href: "/partner/inventory",
      icon: Package,
      accent: "bg-violet-50 text-violet-700",
    },
    {
      title: "Reports",
      description: "Review partner performance with charts and export tools.",
      href: "/partner/reports",
      icon: BarChart2,
      accent: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950/90">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-emerald-600 p-4 text-white shadow-sm">
              <Briefcase size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Partner Dashboard
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                Quickly navigate your partner operations, create tasks, organize
                events, and track performance in one place.
              </p>
            </div>
          </div>
          <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase">
              Partner tools
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">
              Designed for faster planning, easier approvals, and clearer
              outcomes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-3xl ${item.accent}`}
              >
                <Icon size={26} />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {item.title}
              </h2>
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
              <div className="mt-6 text-sm font-medium text-emerald-600 transition group-hover:text-emerald-700 dark:text-emerald-400 dark:group-hover:text-emerald-300">
                Open {item.title}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
