import "react-toastify/dist/ReactToastify.css";

import { useTranslations } from "next-intl";
import React from "react";
import { ToastContainer } from "react-toastify";

import Calendar from "./Calendar/index.jsx";
import Ranking from "./ChartRank/index.jsx";
import EventBanner from "./EventBanner/index.jsx";
import EventList from "./EventList/index.jsx";
import useMission from "./hooks/useMission";
import MissionFilters from "./MissionFilters/index.jsx";
import MissionHeader from "./MissionHeader/index.jsx";
import MissionSkeleton from "./MissionSkeleton/index.jsx";
import MissionTabs from "./MissionTabs/index.jsx";
import QrTaskSubmissionModal from "./QrTaskSubmissionModal/index.jsx";
import TasksList from "./TasksList/index.jsx";
import TaskSubmissionModal from "./TaskSubmissionModal/index.jsx";

function Mission() {
  const t = useTranslations("missions.list");
  const {
    userInfo,
    loading,
    completingTask,
    dailyCurrentPage,
    otherCurrentPage,
    selectedTask,
    isModalOpen,
    selectedTab,
    dailyTasks,
    otherTasks,
    dailyDifficultyFilter,
    otherDifficultyFilter,
    completedTasks,
    dailyTotalPages,
    otherTotalPages,
    completedPages,
    taskPerPage,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    sortByCoins,
    setSortByCoins,
    setSelectedTab,
    setDailyDifficultyFilter,
    setDailyCurrentPage,
    setOtherDifficultyFilter,
    setOtherCurrentPage,
    handleTaskCompletion,
    handleTaskSelect,
    handleModalClose,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    getFilteredTasks,
  } = useMission();

  const renderTaskModal = () => {
    if (!selectedTask) return null;

    const isQrTask =
      selectedTask.difficulty === "medium" ||
      selectedTask.difficulty === "hard";

    if (isQrTask) {
      return (
        <QrTaskSubmissionModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          task={selectedTask}
          handleTaskCompletion={handleTaskCompletion}
          userID={userInfo?.id}
        />
      );
    } else {
      return (
        <TaskSubmissionModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          task={selectedTask}
          handleTaskCompletion={handleTaskCompletion}
          userID={userInfo?.id}
        />
      );
    }
  };

  if (loading) {
    return <MissionSkeleton />;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 pt-20 pb-10 transition-colors duration-300">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MissionHeader
          userInfo={userInfo}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Event Banner */}
        <EventBanner userInfo={userInfo} />

        {/* Event List - Full Width */}
        <div className="mb-6">
          <EventList userInfo={userInfo} />
        </div>

        {/* Progress Dashboard / Activity Stats - Horizontal Bar */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-3xl border border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <div className="flex items-center gap-4 rounded-2xl border border-orange-100 dark:border-orange-900/20 bg-orange-50/40 dark:bg-orange-950/10 p-4 transition-all hover:shadow-xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
            </div>
            <div>
              <p className="text-[10px] font-extrabold tracking-wider text-orange-700/80 uppercase dark:text-orange-400/80">Chuỗi ngày</p>
              <p className="text-xl font-black text-orange-600 dark:text-orange-400">{userInfo?.streak || 0} ngày 🔥</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-green-100 dark:border-green-900/20 bg-green-50/40 dark:bg-green-950/10 p-4 transition-all hover:shadow-xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div>
              <p className="text-[10px] font-extrabold tracking-wider text-green-700/80 uppercase dark:text-green-400/80">Nhiệm vụ đã xong</p>
              <p className="text-xl font-black text-green-600 dark:text-green-400">{completedTasks.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-amber-100 dark:border-amber-900/20 bg-amber-50/40 dark:bg-amber-950/10 p-4 transition-all hover:shadow-xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="12" cy="12" r="8"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </div>
            <div>
              <p className="text-[10px] font-extrabold tracking-wider text-amber-700/80 uppercase dark:text-amber-400/80">Xu đã nhận</p>
              <p className="text-xl font-black text-amber-600 dark:text-amber-400">
                {completedTasks.reduce((sum, task) => sum + (task.coin || task.coins || 0), 0)} xu 🪙
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Column - Tasks */}
          <div className="w-full lg:w-2/3">
            {/* Tabs */}
            <MissionTabs
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />

            {/* Search, Category, Difficulty & Sorting Filters */}
            <MissionFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              sortByCoins={sortByCoins}
              setSortByCoins={setSortByCoins}
              selectedTab={selectedTab}
              dailyDifficultyFilter={dailyDifficultyFilter}
              setDailyDifficultyFilter={setDailyDifficultyFilter}
              otherDifficultyFilter={otherDifficultyFilter}
              setOtherDifficultyFilter={setOtherDifficultyFilter}
              setDailyCurrentPage={setDailyCurrentPage}
              setOtherCurrentPage={setOtherCurrentPage}
            />

            {/* Task List */}
            <div className="rounded-b-3xl border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
              {selectedTab === "daily" && dailyTasks.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-400">
                    {t("noDaily")}
                  </p>
                </div>
              ) : selectedTab === "other" && otherTasks.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-400">
                    {t("noOther")}
                  </p>
                </div>
              ) : (
                <TasksList
                  tasks={getFilteredTasks()}
                  loading={loading}
                  completingTask={completingTask}
                  handleTaskCompletion={handleTaskCompletion}
                  handleTaskSelect={handleTaskSelect}
                  currentPage={
                    selectedTab === "daily"
                      ? dailyCurrentPage
                      : selectedTab === "other"
                        ? otherCurrentPage
                        : completedPages
                  }
                  totalPages={
                    selectedTab === "daily"
                      ? dailyTotalPages
                      : selectedTab === "other"
                        ? otherTotalPages
                        : selectedTab === "completed"
                          ? completedPages
                          : 1
                  }
                  goToNextPage={goToNextPage}
                  goToPreviousPage={goToPreviousPage}
                  goToPage={goToPage}
                  userId={userInfo?.id}
                  selectedTab={selectedTab}
                  taskPerPage={taskPerPage}
                />
              )}
            </div>
          </div>

          {/* Right Column - Calendar and Rankings */}
          <div className="w-full space-y-6 lg:w-1/3">
            {/* Calendar Component */}
            <Calendar
              streak={userInfo?.streak || 0}
              lastLogin={userInfo?.last_completed_task || null}
            />

            {/* Ranking Component */}
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="border-b border-gray-150 bg-gray-50/50 p-4 transition-colors duration-300 dark:border-zinc-850 dark:bg-zinc-800/30">
                <h2 className="text-sm font-extrabold tracking-wider text-emerald-900 uppercase dark:text-slate-100">
                  {t("ranking")}
                </h2>
              </div>
              <div className="p-4">
                <Ranking />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Task Submission Modal */}
      {selectedTask && renderTaskModal()}
    </main>
  );
}

export default Mission;
