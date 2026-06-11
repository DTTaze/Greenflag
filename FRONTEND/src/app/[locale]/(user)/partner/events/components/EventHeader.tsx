import React from "react";

type EventHeaderProps = {
  version: string;
  headline: string;
  subtitle: string;
  badge: string;
  panelDescription: string;
};

export function EventHeader({
  version,
  headline,
  subtitle,
  badge,
  panelDescription,
}: EventHeaderProps) {
  return (
    <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950/90">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-3xl bg-emerald-600 p-4 text-white shadow-sm">
            {/* Icon rendered by parent page */}
          </div>
          <div>
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold tracking-[0.18em] text-slate-700 uppercase dark:bg-slate-900 dark:text-slate-200">
              {version}
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-gray-900 dark:text-gray-100">
              {headline}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="rounded-3xl bg-blue-50 p-4 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase">
            {badge}
          </p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
            {panelDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
