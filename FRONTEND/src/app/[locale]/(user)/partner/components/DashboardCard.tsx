import Link from "next/link";
import React from "react";
import type { LucideIcon } from "lucide-react";

type DashboardCardProps = {
  href: string;
  title: string;
  description: string;
  accent: string;
  icon: LucideIcon;
  openLabel: string;
};

export function DashboardCard({
  href,
  title,
  description,
  accent,
  icon: Icon,
  openLabel,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
    >
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-3xl ${accent}`}
      >
        <Icon size={26} />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
        {description}
      </p>
      <div className="mt-6 text-sm font-medium text-emerald-600 transition group-hover:text-emerald-700 dark:text-emerald-400 dark:group-hover:text-emerald-300">
        {openLabel}
      </div>
    </Link>
  );
}
