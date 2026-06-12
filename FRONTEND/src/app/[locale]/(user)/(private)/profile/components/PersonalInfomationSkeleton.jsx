import React from "react";

export default function PersonalInfomationSkeleton() {
  return (
    <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-emerald-200/60 bg-white p-6 shadow-xl dark:border-emerald-500/15 dark:bg-zinc-950">
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

      <div className="mx-auto mb-6 h-6 w-40 rounded-md bg-gray-200 dark:bg-zinc-800" />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-emerald-100 dark:border-emerald-500/10">
          <thead>
            <tr className="bg-emerald-50/50 dark:bg-zinc-900/50">
              <th className="border border-emerald-100 p-3 dark:border-emerald-500/10">
                <div className="h-5 w-24 rounded-md bg-gray-200 dark:bg-zinc-800" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <tr key={index}>
                  <td className="border border-emerald-100 p-3 dark:border-emerald-500/10">
                    <div className="h-5 w-32 rounded-md bg-gray-200 dark:bg-zinc-800" />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

