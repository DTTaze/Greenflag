import React from "react";

import imgSrc from "@/src/assets/images/seedling-solid.svg";

import Pagination from "../Pagination";
import TaskCard from "../TaskCard";
import TaskCardSkeleton from "../TaskCardSkeleton";

/**
 * Component to display a list of tasks with pagination
 */
const TasksList = ({
  tasks,
  loading,
  completingTask,
  handleTaskSelect,
  currentPage,
  totalPages,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  userId,
  selectedTab,
  taskPerPage,
}) => {
  console.log("tasks in TaskList: ", tasks);
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    );
  }

  if (selectedTab === "daily") {
    return (
      <div className="flex min-h-[600px] flex-col">
        <div className="flex-grow">
          <h2 className="mb-4.5 flex items-center text-base font-extrabold text-gray-800 uppercase tracking-wider">
            <span className="mr-2 rounded-xl bg-blue-50 p-2 text-blue-600 border border-blue-100/50 shadow-2xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
                />
              </svg>
            </span>
            Nhiệm Vụ Hôm Nay
          </h2>

          {tasks && tasks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {tasks
                .slice(
                  (currentPage - 1) * (taskPerPage || 4),
                  currentPage * (taskPerPage || 4),
                )
                .map(
                  (task) =>
                    task && (
                      <TaskCard
                        key={task.id}
                        task={task}
                        handleTaskSelect={handleTaskSelect}
                        completingTask={completingTask}
                        userId={userId}
                      />
                    ),
                )}
            </div>
          ) : (
            <div className="rounded-2xl bg-blue-50/45 border border-blue-100/40 px-4 py-16 text-center shadow-3xs max-w-lg mx-auto">
              <img
                src={imgSrc}
                alt="All done!"
                className="mx-auto mb-4 h-14 w-14 opacity-30"
              />
              <h3 className="mb-1 text-base font-extrabold text-gray-700 uppercase tracking-wide">
                Tuyệt vời!
              </h3>
              <p className="mx-auto text-xs text-gray-500 leading-relaxed max-w-sm font-medium">
                Bạn đã hoàn thành tất cả nhiệm vụ hôm nay. Hãy quay lại vào ngày
                mai để tiếp tục chuỗi hoạt động nhé!
              </p>
            </div>
          )}
        </div>
        <div className="shrink-0 mt-6">
          {tasks && tasks.length > (taskPerPage || 4) && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
              goToPage={goToPage}
            />
          )}
        </div>
      </div>
    );
  } else if (selectedTab === "other") {
    return (
      <div className="flex min-h-[600px] flex-col">
        <div className="flex-grow">
          <h2 className="mb-4.5 flex items-center text-base font-extrabold text-gray-800 uppercase tracking-wider">
            <span className="mr-2 rounded-xl bg-indigo-50 p-2 text-indigo-650 border border-indigo-100/50 shadow-2xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </span>
            Nhiệm Vụ Khác
          </h2>

          {tasks && tasks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {tasks
                .slice(
                  (currentPage - 1) * (taskPerPage || 4),
                  currentPage * (taskPerPage || 4),
                )
                .map(
                  (task) =>
                    task && (
                      <TaskCard
                        key={task.id}
                        task={task}
                        handleTaskSelect={handleTaskSelect}
                        completingTask={completingTask}
                        userId={userId}
                      />
                    ),
                )}
            </div>
          ) : (
            <div className="rounded-2xl bg-indigo-50/45 border border-indigo-100/40 px-4 py-16 text-center shadow-3xs max-w-lg mx-auto">
              <img
                src={imgSrc}
                alt="No tasks"
                className="mx-auto mb-4 h-14 w-14 opacity-30"
              />
              <h3 className="mb-1 text-base font-extrabold text-gray-700 uppercase tracking-wide">
                Chưa có nhiệm vụ!
              </h3>
              <p className="mx-auto text-xs text-gray-500 leading-relaxed max-w-sm font-medium">
                Hiện tại chưa có nhiệm vụ khác nào khả dụng. Hãy thử hoàn thành các nhiệm vụ hàng ngày trước nhé!
              </p>
            </div>
          )}
        </div>
        <div className="shrink-0 mt-6">
          {tasks && tasks.length > (taskPerPage || 4) && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
              goToPage={goToPage}
            />
          )}
        </div>
      </div>
    );
  } else if (selectedTab === "completed") {
    return (
      <div className="min-h-[600px] flex flex-col justify-between">
        <div className="flex-grow">
          <h2 className="mb-4.5 flex items-center text-base font-extrabold text-gray-800 uppercase tracking-wider">
            <span className="mr-2 rounded-xl bg-emerald-50 p-2 text-emerald-700 border border-emerald-100/50 shadow-2xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            Nhiệm Vụ Đã Hoàn Thành ({tasks ? tasks.length : 0})
          </h2>

          {tasks && tasks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 animate-fade-in">
              {tasks
                .slice(
                  (currentPage - 1) * (taskPerPage || 4),
                  currentPage * (taskPerPage || 4),
                )
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 p-4.5 transition-all duration-300 hover:border-emerald-300/40 hover:bg-emerald-50/5 hover:shadow-2xs"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
                      <img src={imgSrc} alt="task icon" className="h-5.5 w-5.5 opacity-80" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="flex items-center text-xs font-bold text-gray-800 gap-1.5 leading-snug">
                        <span className="truncate">{task.tasks.title}</span>
                        <span className="shrink-0 inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-800">
                          ✓ Đã xong
                        </span>
                      </h3>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">
                        Hoàn thành:{" "}
                        {new Date(task.completed_at).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-emerald-50/30 border border-emerald-100/40 px-4 py-16 text-center shadow-3xs max-w-lg mx-auto">
              <img
                src={imgSrc}
                alt="No tasks"
                className="mx-auto mb-4 h-14 w-14 opacity-30"
              />
              <h3 className="mb-1 text-base font-extrabold text-gray-700 uppercase tracking-wide">
                Chưa hoàn thành nhiệm vụ nào!
              </h3>
              <p className="mx-auto text-xs text-gray-500 leading-relaxed max-w-sm font-medium">
                Bạn chưa hoàn thành nhiệm vụ nào. Hãy bắt đầu với nhiệm vụ hàng ngày để nhận các phần quà giá trị!
              </p>
            </div>
          )}
        </div>
        <div className="shrink-0 mt-6">
          {tasks && tasks.length > (taskPerPage || 4) && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
              goToPage={goToPage}
            />
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default TasksList;
