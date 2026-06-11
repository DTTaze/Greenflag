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

type ReportDataItem = {
  name: string;
  value: number;
};

type ReportsChartProps = {
  data: ReportDataItem[];
  title: string;
};

export function ReportsChart({ data, title }: ReportsChartProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
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
  );
}
