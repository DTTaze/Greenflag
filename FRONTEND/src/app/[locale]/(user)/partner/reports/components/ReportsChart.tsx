import { useTranslations } from "next-intl";
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

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

type ReportDataItem = {
  name: string;
  value: number;
};

type ReportsChartProps = {
  data: ReportDataItem[];
};

export function ReportsChart({ data }: ReportsChartProps) {
  const t = useTranslations("partner");

  return (
    <Card className="rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
          {t("reports.chartTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-72 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-emerald-950/20" />
              <XAxis dataKey="name" tick={{ fill: "#64748b" }} className="dark:text-slate-400 text-xs" />
              <YAxis tick={{ fill: "#64748b" }} className="dark:text-slate-400 text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #10b981",
                  borderRadius: "16px",
                }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
