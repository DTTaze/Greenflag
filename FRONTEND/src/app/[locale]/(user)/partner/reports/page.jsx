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

export default function PartnerReportsPage() {
  const data = [
    { name: "Tasks", value: 120 },
    { name: "Events", value: 80 },
    { name: "Redemptions", value: 40 },
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
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-md bg-emerald-600 p-3 text-white">
          <BarChart2 />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Activity Reports
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            View engagement stats for tasks and events.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Overview
        </h2>
        <div style={{ height: 260 }} className="mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="rounded-md bg-emerald-600 px-3 py-2 text-white"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
