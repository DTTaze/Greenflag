import { useTranslations } from "next-intl";
import React from "react";

import imgScr from "@/src/assets/images/seedling-solid.svg";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";

import ProgressBar from "../ProgressBar";
import TaskDetailModal from "../TaskDetailModal";
import { getLevelColor } from "../utils/taskUtils";

/**
 * Task Card component for displaying mission tasks
 */
const TaskCard = React.memo(
  ({ task, handleTaskSelect, completingTask, userId }) => {
    const t = useTranslations("missions.card");
    const tFilters = useTranslations("missions.filters");

    const isCompleted = task.progress_count === task.total;
    const levelColorClass = getLevelColor(task.difficulty);
    const isLoading = completingTask === task.id;
    const isUserTask = task.isUserTask;
    const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);

    const progress_count = task.progress_count || 0;
    console.log("progress_count in TaskCard", task.progress_count);

    const handleTaskAccepted = () => {
      // Update the task's isUserTask status
      task.isUserTask = true;
    };
    console.log("total in task", task.total);

    return (
      <>
        <Card
          className={`task-card flex flex-col rounded-3xl border bg-white dark:bg-zinc-900 ${
            isCompleted
              ? "border-emerald-200 shadow-emerald-50/50 dark:border-emerald-500/40"
              : "border-gray-200 dark:border-emerald-500/15"
          } group overflow-hidden shadow-2xs transition-all duration-300 hover:translate-y-[-3px] hover:border-gray-300 hover:shadow-md dark:hover:border-emerald-500/50 ${
            isLoading ? "opacity-70" : ""
          }`}
        >
          {/* Difficulty border at top */}
          <div
            className={`h-1.5 w-full bg-gradient-to-r ${
              task.difficulty === "easy"
                ? "from-green-400 to-emerald-500"
                : task.difficulty === "medium"
                  ? "from-blue-400 to-indigo-500"
                  : task.difficulty === "hard"
                    ? "from-amber-400 to-orange-500"
                    : "from-rose-500 to-red-600"
            }`}
          ></div>

          <div className="flex flex-grow flex-col justify-between gap-4 p-4">
            <div className="space-y-3">
              {/* Header inside card */}
              <div className="flex items-start gap-2.5">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-gray-50/50 p-1.5 dark:bg-slate-700/70 ${
                    isCompleted
                      ? "bg-emerald-55/30 border-emerald-200 text-emerald-600 dark:border-emerald-400/40 dark:text-emerald-300"
                      : "border-gray-200 text-gray-500 dark:border-emerald-500/15 dark:text-slate-300"
                  }`}
                >
                  <img
                    src={imgScr}
                    alt="task icon"
                    className="h-full w-full opacity-80"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm leading-snug font-bold text-gray-800 transition-colors group-hover:text-emerald-800 dark:text-slate-100 dark:group-hover:text-emerald-300">
                    {task.title}
                  </h3>
                  <span
                    className={`mt-1 inline-block rounded-lg border px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${levelColorClass}`}
                  >
                    {tFilters(task.difficulty) || task.difficulty}
                  </span>
                </div>
                {/* Coins reward badge */}
                <div className="task-coin-reward flex shrink-0 items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                  <span className="coin-value mr-1 font-extrabold">
                    +{task.coins || 0}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-spin-slow h-3.5 w-3.5 text-amber-600 dark:text-amber-400"
                  >
                    <circle cx="12" cy="12" r="8"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
              </div>

              {/* Description */}
              <p className="line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-slate-300">
                {task.description || t("noDescription")}
              </p>
            </div>

            {/* Progress & Button */}
            <div className="space-y-3.5">
              <ProgressBar
                completed={progress_count || 0}
                total={task.total}
                level={task.difficulty}
              />

              <Button
                onClick={() => {
                  if (isUserTask) {
                    handleTaskSelect(task);
                  } else {
                    setIsDetailModalOpen(true);
                  }
                }}
                disabled={task.completed_at || task.isPending || isLoading}
                variant={
                  task.completed_at || task.isPending
                    ? "outline"
                    : !isUserTask && !isCompleted
                      ? "outline"
                      : "default"
                }
                className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold shadow-none! transition-all duration-300 active:scale-98 ${
                  isLoading
                    ? "cursor-not-allowed border-transparent! bg-emerald-600 text-white opacity-75"
                    : task.completed_at
                      ? "cursor-not-allowed border border-blue-100 bg-blue-50 text-blue-600 shadow-none! dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-400"
                      : task.isPending
                        ? "cursor-not-allowed border border-amber-200 bg-amber-50 text-amber-700 shadow-none! dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-400"
                        : isCompleted || isUserTask
                          ? "border-transparent! bg-emerald-600 text-white hover:bg-emerald-700"
                          : "border-emerald-600/50 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="h-4.5 w-4.5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("processing")}
                  </>
                ) : task.completed_at ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {t("completed")}
                  </>
                ) : task.isPending ? (
                  t("pending")
                ) : isCompleted ? (
                  t("claimReward")
                ) : isUserTask ? (
                  t("doNow")
                ) : (
                  t("join")
                )}
              </Button>
            </div>
          </div>
        </Card>

        <TaskDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          task={task}
          userID={userId}
          onTaskAccepted={handleTaskAccepted}
        />
      </>
    );
  },
);

TaskCard.displayName = "TaskCard";

export default TaskCard;
