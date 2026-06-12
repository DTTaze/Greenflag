import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

type OverviewItem = {
  label: string;
  value: string | number;
};

type ReportsSummaryProps = {
  overview: OverviewItem[];
  onExport: () => void;
};

export function ReportsSummary({ overview, onExport }: ReportsSummaryProps) {
  const t = useTranslations("partner");

  return (
    <Card className="rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
          {t("reports.summaryTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-4 sm:grid-cols-3">
          {overview.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-emerald-100 bg-emerald-50/20 p-5 text-center dark:border-emerald-950/40 dark:bg-zinc-950/40"
            >
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                {item.label}
              </p>
              <p className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            onClick={onExport}
            className="rounded-2xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/10 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-600 transition-all duration-300 px-5 py-2.5 h-auto"
          >
            {t("reports.exportBtn")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
