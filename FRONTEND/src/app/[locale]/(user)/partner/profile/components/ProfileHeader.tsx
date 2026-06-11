import React from "react";

type ProfileHeaderProps = {
  title: string;
  description: string;
  badgeTitle: string;
  badgeDescription: string;
};

export function ProfileHeader({
  title,
  description,
  badgeTitle,
  badgeDescription,
}: ProfileHeaderProps) {
  return (
    <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950/90">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-3xl bg-emerald-600 p-4 text-white shadow-sm">
            {/* Icon rendered by parent page */}
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
        </div>
        <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase">
            {badgeTitle}
          </p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
            {badgeDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
