import React from "react";

import { Button } from "@/src/components/ui/button";
import { type TaskType, TaskVisibility } from "@/src/types/task/task.type";

type TaskListProps = {
  tasks: TaskType[];
  loading: boolean;
  error: string;
  onToggleVisibility: (task: TaskType) => void;
  labels: {
    listTitle: string;
    listDescription: string;
    taskCount: string;
    loadingTasks: string;
    noTasks: string;
    rewardLabel: string;
    showTask: string;
    hideTask: string;
  };
};

const statusStyles: Record<TaskVisibility, string> = {
  [TaskVisibility.PUBLIC]:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  [TaskVisibility.PRIVATE]:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function TaskList({
  tasks,
  loading,
  error,
  onToggleVisibility,
  labels,
}: TaskListProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {labels.listTitle}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {labels.listDescription}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
          {tasks.length} {labels.taskCount}
        </span>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
            {labels.loadingTasks}
          </div>
        )}
        {!loading && tasks.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
            {labels.noTasks}
          </div>
        )}
        {tasks.map((task) => (
          <article
            key={task.id}
            className="rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {task.title}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase ${statusStyles[task.status]}`}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {task.description}
                </p>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {labels.rewardLabel} :{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {task.coins} pts
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleVisibility(task)}
                >
                  {task.status === TaskVisibility.PUBLIC
                    ? labels.hideTask
                    : labels.showTask}
                </Button>
              </div>
            </div>
          </article>
        ))}

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
      </div>
    </section>
  );
}
