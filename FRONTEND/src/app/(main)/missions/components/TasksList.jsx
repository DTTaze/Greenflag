import React from "react";

import imgSrc from "@/src/assets/images/seedling-solid.svg";

import Pagination from "./Pagination";
import TaskCard from "./TaskCard";
import TaskCardSkeleton from "./TaskCardSkeleton";

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
      <>
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </>
    );
  }

  if (selectedTab === "daily") {
    return (
      <div className="flex min-h-[650px] flex-col">
        <div className="flex-grow">
          <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-800">
            <span className="mr-2 rounded-full bg-blue-100 p-1.5 text-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
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
                  (currentPage - 1) * (taskPerPage || 3),
                  currentPage * (taskPerPage || 3),
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
            <div className="rounded-xl bg-blue-50 px-4 py-16 text-center">
              <img
                src={imgSrc}
                alt="All done!"
                className="mx-auto mb-4 h-20 w-20 opacity-30"
              />
              <h3 className="mb-2 text-lg font-semibold text-gray-700">
                Tuyệt vời!
              </h3>
              <p className="mx-auto mb-4 max-w-md text-gray-600">
                Bạn đã hoàn thành tất cả nhiệm vụ hôm nay. Hãy quay lại vào ngày
                mai để tiếp tục chuỗi hoạt động!
              </p>
            </div>
          )}
        </div>
        <div>
          {tasks && tasks.length > (taskPerPage || 3) && (
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
      <div className="flex min-h-[650px] flex-col">
        <div className="flex-grow">
          <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-800">
            <span className="mr-2 rounded-full bg-indigo-100 p-1.5 text-indigo-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
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
                  (currentPage - 1) * (taskPerPage || 3),
                  currentPage * (taskPerPage || 3),
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
            <div className="rounded-xl bg-indigo-50 px-4 py-16 text-center">
              <img
                src={imgSrc}
                alt="No tasks"
                className="mx-auto mb-4 h-20 w-20 opacity-30"
              />
              <h3 className="mb-2 text-lg font-semibold text-gray-700">
                Chưa có nhiệm vụ!
              </h3>
              <p className="mx-auto max-w-md text-gray-600">
                Hiện tại chưa có nhiệm vụ khác nào. Hãy hoàn thành nhiệm vụ hàng
                ngày trước nhé!
              </p>
            </div>
          )}
        </div>
        <div>
          {tasks && tasks.length > (taskPerPage || 3) && (
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
    // For the completed section
    return (
      <div className="min-h-[650px]">
        <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-800">
          <span className="mr-2 rounded-full bg-green-100 p-1.5 text-green-700">
            <svg
              xmlns={imgSrc}
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          Nhiệm Vụ Đã Hoàn Thành ({tasks ? tasks.length : 0})
        </h2>

        {tasks && tasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 opacity-80 transition-opacity hover:opacity-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-green-200 bg-green-50">
                    <img src={imgSrc} alt="task icon" className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="flex items-center font-medium text-gray-700">
                      {task.tasks.title}
                      <span className="ml-2 inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        ✓ Hoàn thành
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500">
                      Hoàn thành:{" "}
                      {new Date(task.completed_at).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-green-50 px-4 py-16 text-center">
            <img
              src={imgSrc}
              alt="No tasks"
              className="mx-auto mb-4 h-20 w-20 opacity-30"
            />
            <h3 className="mb-2 text-lg font-semibold text-gray-700">
              Chưa có nhiệm vụ hoàn thành!
            </h3>
            <p className="mx-auto max-w-md text-gray-600">
              Bạn chưa hoàn thành nhiệm vụ nào. Hãy bắt đầu với nhiệm vụ hàng
              ngày.
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default TasksList;
