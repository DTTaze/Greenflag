"use client";

import { BarChart2 } from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/src/components/ui/button";

export default function PartnerReportsPage() {
  const data = [
    { name: "Tasks", value: 120 },
    { name: "Events", value: 80 },
    { name: "Redemptions", value: 40 },
  ];

  const overview = [
    { label: "Total tasks", value: 120 },
    { label: "Events organized", value: 8 },
    { label: "Points redeemed", value: 40 },
  ];

  function exportCSV() {
    const headers = ["metric", "value"];
    const rows = data.map((d) => [d.name, d.value]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "partner_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6">
      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950/90">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-emerald-600 p-4 text-white shadow-sm">
              <BarChart2 size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Activity Reports
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                Theo dõi hiệu suất tác động xanh của bạn bằng báo cáo dễ đọc và
                xuất dữ liệu.
              </p>
            </div>
          </div>
          <div className="rounded-3xl bg-amber-50 p-4 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase">
              Báo cáo
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
              Tổng quan nhanh về tương tác và thành quả.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_0.9fr]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Bảng tóm tắt
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {overview.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-gray-100 bg-slate-50 p-4 text-center dark:border-gray-800 dark:bg-slate-950"
              >
                <p className="text-sm tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={exportCSV}>Export CSV</Button>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Overview chart
          </h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip wrapperStyle={{ borderRadius: 16 }} />
                <Bar dataKey="value" fill="#10b981" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
