import { FormEvent } from "react";
import React from "react";

import { Button } from "@/src/components/ui/button";
import { TaskDifficulty } from "@/src/types/task/task.type";

type TaskFormValues = {
  title: string;
  description: string;
  coins: number;
  difficulty: TaskDifficulty;
};

type TaskFormProps = {
  form: TaskFormValues;
  setForm: React.Dispatch<React.SetStateAction<TaskFormValues>>;
  error: string;
  saving: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  labels: {
    panelTitle: string;
    panelDesc: string;
    newTag: string;
    titleLabel: string;
    titlePlaceholder: string;
    difficultyLabel: string;
    difficultyEasy: string;
    difficultyMedium: string;
    difficultyHard: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    rewardLabel: string;
    resetBtn: string;
    saveBtn: string;
    saving: string;
  };
};

export function TaskForm({
  form,
  setForm,
  error,
  saving,
  onSubmit,
  onReset,
  labels,
}: TaskFormProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {labels.panelTitle}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {labels.panelDesc}
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase dark:bg-emerald-900/40 dark:text-emerald-200">
          {labels.newTag}
        </span>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200 block">
            <span className="block">
              {labels.titleLabel} <span className="text-red-500 ml-0.5">*</span>
            </span>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder={labels.titlePlaceholder}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200 block">
            <span className="block">
              {labels.difficultyLabel} <span className="text-red-500 ml-0.5">*</span>
            </span>
            <select
              value={form.difficulty}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  difficulty: event.target.value as TaskDifficulty,
                }))
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            >
              <option value={TaskDifficulty.EASY}>
                {labels.difficultyEasy}
              </option>
              <option value={TaskDifficulty.MEDIUM}>
                {labels.difficultyMedium}
              </option>
              <option value={TaskDifficulty.HARD}>
                {labels.difficultyHard}
              </option>
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200 block">
          <span className="block">
            {labels.descriptionLabel} <span className="text-red-500 ml-0.5">*</span>
          </span>
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder={labels.descriptionPlaceholder}
            rows={4}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200 block">
            <span className="block">
              {labels.rewardLabel} <span className="text-red-500 ml-0.5">*</span>
            </span>
            <input
              type="number"
              min={0}
              value={form.coins}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  coins: Number(event.target.value),
                }))
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </label>
          <div className="flex items-end justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="w-full sm:w-auto"
            >
              {labels.resetBtn}
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={saving}
            >
              {saving ? labels.saving : labels.saveBtn}
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}
      </form>
    </section>
  );
}
