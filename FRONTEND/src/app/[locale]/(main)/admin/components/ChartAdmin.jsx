"use client";

import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartData = [
  { name: "Jan", User: 4000, Revenue: 2400 },
  { name: "Feb", User: 3000, Revenue: 1398 },
  { name: "Mar", User: 2000, Revenue: 9800 },
  { name: "Apr", User: 2780, Revenue: 3908 },
  { name: "May", User: 1890, Revenue: 4800 },
  { name: "June", User: 2390, Revenue: 3800 },
  { name: "July", User: 3490, Revenue: 4300 },
  { name: "Aug", User: 2500, Revenue: 3000 },
  { name: "Sep", User: 3800, Revenue: 2000 },
  { name: "Oct", User: 5000, Revenue: 2780 },
  { name: "Nov", User: 6000, Revenue: 1890 },
  { name: "Dec", User: 5500, Revenue: 2390 },
];

export default function SimpleLineChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-50/50" />
    );
  }

  return (
    <div className="h-[300px] w-full text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="Revenue"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="User"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
