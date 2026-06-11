import React from "react";

type OverviewItem = {
  label: string;
  value: number;
};

type ReportsSummaryProps = {
  overview: OverviewItem[];
  exportLabel: string;
  onExport: () => void;
};

export function ReportsSummary({
  overview,
  exportLabel,
  onExport,
}: ReportsSummaryProps) {
  return (
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
        <button
          type="button"
          onClick={onExport}
          className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {exportLabel}
        </button>
      </div>
    </section>
  );
}
