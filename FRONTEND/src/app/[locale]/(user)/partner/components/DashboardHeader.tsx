import type { LucideIcon } from "lucide-react";
import React from "react";

type DashboardHeaderProps = {
  version: string;
  title: string;
  description: string;
  toolsTitle: string;
  toolsDescription: string;
  icon: LucideIcon;
};

export function DashboardHeader({
  version,
  title,
  description,
  toolsTitle,
  toolsDescription,
  icon: Icon,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950/90">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-3xl bg-emerald-600 p-4 text-white shadow-sm">
            <Icon size={28} />
          </div>
          <div>
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold tracking-[0.18em] text-slate-700 uppercase dark:bg-slate-900 dark:text-slate-200">
              {version}
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
        </div>
        <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase">
            {toolsTitle}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">
            {toolsDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
