"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { ReportsChart } from "./components/ReportsChart";
import { ReportsHeader } from "./components/ReportsHeader";
import { ReportsSummary } from "./components/ReportsSummary";

export default function PartnerReportsPage() {
  const t = useTranslations("partner");

  const data = [
    { name: t("reports.chartTasks") || "Tasks", value: 120 },
    { name: t("reports.chartEvents") || "Events", value: 80 },
    { name: t("reports.chartRedemptions") || "Redemptions", value: 40 },
  ];

  const overview = [
    { label: t("reports.totalTasks") || "Total tasks", value: 120 },
    { label: t("reports.eventsOrganized") || "Events organized", value: 8 },
    { label: t("reports.pointsRedeemed") || "Points redeemed", value: 40 },
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
    <div className="space-y-8 p-6">
      {/* Header Panel */}
      <ReportsHeader />

      <div className="grid gap-8 xl:grid-cols-2">
        {/* Reports Summary Card */}
        <ReportsSummary overview={overview} onExport={exportCSV} />

        {/* Reports Chart Card */}
        <ReportsChart data={data} />
      </div>
    </div>
  );
}
