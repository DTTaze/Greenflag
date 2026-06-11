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
      description: "Review and update organization details and certifications.",
      href: "/partner/profile",
      icon: User,
    },
    {
      title: "Partner Tasks",
      description: "Create and manage green tasks for your members.",
      href: "/partner/tasks",
      icon: ClipboardList,
    },
    {
      title: "Partner Events",
      description: "Build campaigns, generate QR codes and manage attendance.",
      href: "/partner/events",
      icon: Calendar,
    },
    {
      title: "Inventory",
      description: "Manage reward stock, products and vouchers.",
      href: "/partner/inventory",
      icon: Package,
    },
    {
      title: "Reports",
      description: "View partner performance charts and export data.",
      href: "/partner/reports",
      icon: BarChart2,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-md bg-emerald-600 p-3 text-white">
          <Briefcase />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Partner Portal
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Access your partner tools, reports and event management.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-200">
                <Icon size={24} />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {item.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
