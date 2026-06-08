/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import React from "react";

import imgScr from "@/src/assets/images/seedling-solid.svg";

import ProgressBar from "./ProgressBar";
import TaskDetailModal from "./TaskDetailModal";
import { getLevelColor, getLevelText } from "./TaskUtils";

/**
 * Task Card component for displaying mission tasks
 * @param {Object} props
 * @param {Object} props.task - Task data object
 * @param {Function} props.handleTaskSelect - Function to handle task selection for modal
 * @param {number|null} props.completingTask - ID of the task currently being completed (for loading state)
 * @param {string} props.userId - ID of the current user
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

    const handleTaskAccepted = (acceptedTask) => {
      // Update the task's isUserTask status
      task.isUserTask = true;
    };
    console.log("total in task", task.total);

    return (
      <>
        <div
          className={`task-card rounded-xl border bg-white ${
            isCompleted
              ? "border-emerald-200 shadow-emerald-100"
              : "border-gray-200"
          } group overflow-hidden shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md ${
            isLoading ? "opacity-70" : ""
          }`}
        >
          {/* Difficulty badge at top */}
          <div
            className={`h-1.5 w-full ${levelColorClass.split(" ")[0]}`}
          ></div>

          <div className="px-4 py-3">
            <div className="mb-2 flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border bg-gray-50 p-1 ${
                  isCompleted
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-gray-200"
                }`}
              >
                <img src={imgScr} alt="task icon" className="h-full w-full" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800">
                  {task.title}
                </h3>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white ${levelColorClass}`}
                >
                  {getLevelText(task.difficulty)}
                </span>
              </div>
              <div className="task-coin-reward flex items-center rounded-lg border border-amber-100 bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                <span className="coin-value mr-1 ml-1">+{task.coins || 0}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-coins mr-1 h-6 w-6 text-amber-600"
                >
                  <circle cx="8" cy="8" r="6"></circle>
                  <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                  <path d="M7 6h1v4"></path>
                  <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                </svg>
              </div>
            </div>

            <p className="mb-2 line-clamp-2 min-h-[32px] text-xs text-gray-600">
              {task.description || "Mô tả nhiệm vụ đang được cập nhật..."}
            </p>

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
              className={`mt-3 w-full rounded-lg py-1.5 text-sm font-medium text-white transition-colors ${
                isUserTask
                  ? "bg-green-600 hover:bg-green-700 active:bg-green-800"
                  : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
              } ${
                task.completed_at || isLoading
                  ? "cursor-not-allowed opacity-50"
                  : ""
              } focus:ring-2 focus:outline-none ${
                isCompleted ? "focus:ring-emerald-500" : "focus:ring-green-500"
              } focus:ring-opacity-50`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
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
                "Thực hiện"
              ) : (
                "Tham gia"
              )}
            </button>
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

export default TaskCard;
