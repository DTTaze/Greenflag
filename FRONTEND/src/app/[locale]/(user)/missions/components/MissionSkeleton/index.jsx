import React from "react";

import TaskCardSkeleton from "../TaskCardSkeleton";

export default function MissionSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex animate-pulse flex-col items-center justify-between rounded-xl bg-gradient-to-r from-emerald-600/70 to-emerald-500/70 p-7 text-white shadow-lg sm:flex-row">
          <div>
            <div className="mb-2.5 h-8 w-56 rounded bg-white/20"></div>
            <div className="h-4 w-80 rounded bg-white/20"></div>
          </div>
          <div className="mt-4 flex items-center sm:mt-0">
            <div className="h-16 w-64 rounded-xl bg-white/20"></div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-2/3">
            <div className="mb-6 h-12 w-64 rounded-xl bg-gray-200 animate-pulse"></div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
              <div className="mb-6 h-6 w-40 rounded bg-gray-200 animate-pulse"></div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <TaskCardSkeleton />
                <TaskCardSkeleton />
                <TaskCardSkeleton />
                <TaskCardSkeleton />
              </div>
            </div>
          </div>

          <div className="w-full space-y-6 lg:w-1/3">
            <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="h-16 w-full bg-emerald-600/70"></div>
              <div className="p-4">
                <div className="mb-4 h-8 w-full rounded bg-gray-200"></div>
                <div className="mb-4 grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="h-6 rounded bg-gray-200"></div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className="mx-auto h-8 w-8 rounded-full bg-gray-100"
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 p-4">
                <div className="h-6 w-40 rounded bg-gray-200"></div>
              </div>
              <div className="p-5">
                <div className="mb-6 flex items-end justify-center">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="mx-2 flex flex-col items-center">
                      <div
                        className={`w-${i === 1 ? 14 : 12} h-${
                          i === 1 ? 14 : 12
                        } mb-2 rounded-full bg-gray-200`}
                      ></div>
                      <div
                        className={`h-${i === 1 ? 24 : 16} w-${
                          i === 1 ? 24 : 16
                        } rounded-t-lg bg-gray-200`}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-full rounded-lg bg-gray-100"
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 h-6 w-24 rounded bg-gray-200"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-100 p-3">
                  <div className="mx-auto mb-1 h-8 w-12 rounded bg-gray-200"></div>
                  <div className="mx-auto h-4 w-24 rounded bg-gray-200"></div>
                </div>
                <div className="rounded-lg bg-gray-100 p-3">
                  <div className="mx-auto mb-1 h-8 w-12 rounded bg-gray-200"></div>
                  <div className="mx-auto h-4 w-24 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
