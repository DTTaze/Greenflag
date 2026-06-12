import { useLocale, useTranslations } from "next-intl";
import React from "react";

import imgSrc from "@/src/assets/images/seedling-solid.svg";
import { Card } from "@/src/components/ui/card";

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
  const t = useTranslations("missions.list");
  const locale = useLocale();

  console.log("tasks in TaskList: ", tasks);
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    );
  }

  const dateLocaleString = locale === "en" ? "en-US" : "vi-VN";

  if (selectedTab === "daily") {
    return (
      <div className="flex min-h-[600px] flex-col">
        <div className="flex-grow">
          <h2 className="mb-4.5 flex items-center text-base font-extrabold tracking-wider text-gray-800 uppercase dark:text-slate-100">
            <span className="mr-2 rounded-xl border border-blue-100/50 bg-blue-50 p-2 text-blue-600 shadow-2xs dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300">
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
            {t("todayTasks")}
          </h2>

          {tasks && tasks.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
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
            <Card className="shadow-3xs mx-auto flex max-w-lg flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white/50 px-4 py-16 text-center dark:border-emerald-500/15 dark:bg-slate-900/80">
              <img
                src={imgSrc.src}
                alt="All done!"
                className="mx-auto mb-4 h-14 w-14 opacity-30"
              />
              <h3 className="mb-1 text-base font-extrabold tracking-wide text-gray-700 uppercase dark:text-slate-100">
                {t("allDoneTitle")}
              </h3>
              <p className="mx-auto max-w-sm text-xs leading-relaxed font-medium text-gray-500 dark:text-slate-300">
                {t("allDoneDesc")}
              </p>
            </Card>
          )}
        </div>
        <div className="mt-6 shrink-0">
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
          <h2 className="mb-4.5 flex items-center text-base font-extrabold tracking-wider text-gray-800 uppercase dark:text-slate-100">
            <span className="text-indigo-650 mr-2 rounded-xl border border-indigo-100/50 bg-indigo-50 p-2 shadow-2xs dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-300">
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
            {t("otherTasks")}
          </h2>

          {tasks && tasks.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
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
            <Card className="shadow-3xs mx-auto flex max-w-lg flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white/50 px-4 py-16 text-center dark:border-zinc-800 dark:bg-slate-900/80">
              <img
                src={imgSrc.src}
                alt="No tasks"
                className="mx-auto mb-4 h-14 w-14 opacity-30"
              />
              <h3 className="mb-1 text-base font-extrabold tracking-wide text-gray-700 uppercase dark:text-slate-100">
                {t("noTasksTitle")}
              </h3>
              <p className="mx-auto max-w-sm text-xs leading-relaxed font-medium text-gray-500 dark:text-slate-300">
                {t("noTasksDesc")}
              </p>
            </Card>
          )}
        </div>
        <div className="mt-6 shrink-0">
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
      <div className="flex min-h-[600px] flex-col justify-between">
        <div className="flex-grow">
          <h2 className="mb-4.5 flex items-center text-base font-extrabold tracking-wider text-gray-800 uppercase dark:text-slate-100">
            <span className="mr-2 rounded-xl border border-emerald-100/50 bg-emerald-50 p-2 text-emerald-700 shadow-2xs dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
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
            {t("completedTasksTitle")} ({tasks ? tasks.length : 0})
          </h2>

          {tasks && tasks.length > 0 ? (
            <div className="animate-fade-in grid gap-6 sm:grid-cols-2">
              {tasks
                .slice(
                  (currentPage - 1) * (taskPerPage || 4),
                  currentPage * (taskPerPage || 4),
                )
                .map((task) => (
                  <Card
                    key={task.id}
                    className="shadow-3xs flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 p-4.5 transition-all duration-300 hover:border-emerald-300/40 hover:bg-emerald-50/5 hover:shadow-xs dark:border-zinc-800 dark:bg-slate-900/80 dark:hover:border-green-500/40 dark:hover:bg-green-500/10"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 dark:border-emerald-400/30 dark:bg-emerald-400/10">
                      <img
                        src={imgSrc.src}
                        alt="task icon"
                        className="h-5.5 w-5.5 opacity-80"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="flex items-center gap-1.5 text-xs leading-snug font-bold text-gray-800 dark:text-slate-100">
                        <span className="truncate">{task.tasks.title}</span>
                        <span className="inline-flex shrink-0 items-center rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200">
                          {t("doneStatus")}
                        </span>
                      </h3>
                      <p className="mt-1 text-[10px] font-semibold text-gray-400 dark:text-slate-400">
                        {t("completedAt", {
                          date: new Date(task.completed_at).toLocaleDateString(
                            dateLocaleString,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          ),
                        })}
                      </p>
                    </div>
                  </Card>
                ))}
            </div>
          ) : (
            <Card className="shadow-3xs mx-auto flex max-w-lg flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white/50 px-4 py-16 text-center dark:border-zinc-800 dark:bg-slate-900/80">
              <img
                src={imgSrc.src}
                alt="No tasks"
                className="mx-auto mb-4 h-14 w-14 opacity-30"
              />
              <h3 className="mb-1 text-base font-extrabold tracking-wide text-gray-700 uppercase dark:text-slate-100">
                {t("noCompletedTitle")}
              </h3>
              <p className="mx-auto max-w-sm text-xs leading-relaxed font-medium text-gray-500 dark:text-slate-300">
                {t("noCompletedDesc")}
              </p>
            </Card>
          )}
        </div>
        <div className="mt-6 shrink-0">
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
