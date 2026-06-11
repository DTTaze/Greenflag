import { Button } from "@/src/components/ui/button";
import React from "react";

type InventoryFormValues = {
  name: string;
  stock: number;
  points: number;
};

type InventoryFormProps = {
  form: InventoryFormValues;
  setForm: React.Dispatch<React.SetStateAction<InventoryFormValues>>;
  saving: boolean;
  error: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  labels: {
    heading: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    stockLabel: string;
    pointsLabel: string;
    cancelBtn: string;
    submitBtn: string;
    submitting: string;
  };
};

export function InventoryForm({
  form,
  setForm,
  saving,
  error,
  onSubmit,
  onReset,
  labels,
}: InventoryFormProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {labels.heading}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {labels.description}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
          {labels.heading}
        </span>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {labels.nameLabel}
          <input
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder={labels.namePlaceholder}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            {labels.stockLabel}
            <input
              type="number"
              min={0}
              value={form.stock}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  stock: Number(event.target.value),
                }))
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            {labels.pointsLabel}
            <input
              type="number"
              min={0}
              value={form.points}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  points: Number(event.target.value),
                }))
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </label>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="w-full sm:w-auto"
          >
            {labels.cancelBtn}
          </Button>
          <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
            {saving ? labels.submitting : labels.submitBtn}
          </Button>
        </div>
      </form>
    </section>
  );
}
