import React from "react";

import imgScr from "@/src/assets/images/seedling-solid.svg";

import ProgressBar from "../ProgressBar";
import TaskDetailModal from "../TaskDetailModal";
import { getLevelColor, getLevelText } from "../utils/taskUtils";

/**
 * Task Card component for displaying mission tasks
 */
const TaskCard = React.memo(
  ({ task, handleTaskSelect, completingTask, userId }) => {
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
        <div
          className={`task-card flex flex-col rounded-2xl border bg-white dark:bg-slate-800/90 ${
            isCompleted
              ? "border-emerald-200 shadow-emerald-50/50 dark:border-emerald-500/40"
              : "border-gray-200 dark:border-slate-700"
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
                      : "border-gray-200 text-gray-500 dark:border-slate-600 dark:text-slate-300"
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
                    {getLevelText(task.difficulty)}
                  </span>
                </div>
                {/* Coins reward badge */}
                <div className="task-coin-reward flex shrink-0 items-center rounded-lg border border-amber-100 bg-amber-50 px-2 py-1 text-xs font-black text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
                  <span className="coin-value mr-1 font-extrabold">
                    +{task.coins || 0}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-spin-slow h-4.5 w-4.5 text-amber-600 dark:text-amber-300"
                  >
                    <circle cx="8" cy="8" r="6"></circle>
                    <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                    <path d="M7 6h1v4"></path>
                  </svg>
                </div>
              </div>

              {/* Description */}
              <p className="line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-slate-300">
                {task.description || "Mô tả nhiệm vụ đang được cập nhật..."}
              </p>
            </div>

            {/* Progress & Button */}
            <div className="space-y-3.5">
              <ProgressBar
                completed={progress_count || 0}
                total={task.total}
                level={task.difficulty}
              />

              <button
                onClick={() => {
                  if (isUserTask) {
                    handleTaskSelect(task);
                  } else {
                    setIsDetailModalOpen(true);
                  }
                }}
                disabled={task.completed_at || isLoading}
                className={`w-full cursor-pointer rounded-xl py-2.5 text-xs font-bold text-white transition-all duration-300 active:scale-98 ${
                  isUserTask
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 shadow-sm shadow-emerald-500/10 hover:from-emerald-700 hover:to-green-700 hover:shadow-md"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm shadow-blue-500/10 hover:from-blue-600 hover:to-indigo-600 hover:shadow-md"
                } ${
                  task.completed_at || isLoading
                    ? "cursor-not-allowed opacity-50 shadow-none hover:from-current hover:shadow-none"
                    : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-1.5">
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
                    Đang xử lý...
                  </span>
                ) : task.completed_at ? (
                  "✓ Đã hoàn thành"
                ) : isCompleted ? (
                  "Nhận thưởng"
                ) : isUserTask ? (
                  "Thực hiện"
                ) : (
                  "Tham gia"
                )}
              </button>
            </div>
          </div>
        </div>

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
