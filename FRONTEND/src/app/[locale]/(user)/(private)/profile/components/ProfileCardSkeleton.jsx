import React from "react";

export default function ProfileCardSkeleton() {
  return (
    <div className="relative mx-auto max-w-sm overflow-hidden rounded-3xl border border-emerald-200/60 bg-white p-6 shadow-2xl dark:border-emerald-500/15 dark:bg-zinc-900/50">
      {/* Shimmer layer (light/dark friendly) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 opacity-60 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800" />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.6s linear infinite;
        }
      `}</style>

      <div className="flex flex-wrap items-center space-x-4 sm:space-x-6">
        <div className="relative flex h-20 w-20 shrink-0 sm:h-16 sm:w-16">
          <div className="h-full w-full rounded-lg bg-gray-200 dark:bg-zinc-800" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="mb-2 h-5 w-32 rounded-md bg-gray-200 dark:bg-zinc-800" />
          <div className="h-4 w-48 rounded-md bg-gray-200 dark:bg-zinc-800" />
        </div>
      </div>

      <div className="my-4 h-px w-full bg-gray-200 dark:bg-zinc-800" />

      <div className="space-y-2">
        <div className="h-8 w-full rounded-lg bg-gray-200 dark:bg-zinc-800" />
        <div className="h-8 w-full rounded-lg bg-gray-200 dark:bg-zinc-800" />
        <div className="h-8 w-full rounded-lg bg-gray-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
