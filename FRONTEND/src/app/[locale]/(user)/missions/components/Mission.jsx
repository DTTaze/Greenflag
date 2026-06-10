import "react-toastify/dist/ReactToastify.css";

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
    <div className="min-h-screen bg-linear-to-br from-emerald-100 via-cyan-50 to-white pb-16 transition-colors duration-300 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-900">
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
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <MissionHeader userInfo={userInfo} loading={loading} />

        {/* Event Banner */}
        <EventBanner userInfo={userInfo} />

        {/* Event List - Full Width */}
        <div className="mb-6">
          <EventList userInfo={userInfo} />
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
            <div className="rounded-b-3xl border border-emerald-200/70 bg-white/95 p-6 shadow-2xl shadow-emerald-200/40 transition-colors duration-300 dark:border-emerald-500/20 dark:bg-slate-900/85 dark:shadow-emerald-950/20 dark:backdrop-blur">
              {selectedTab === "daily" && dailyTasks.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-400">
                    Không có nhiệm vụ hàng ngày nào
                  </p>
                </div>
              ) : selectedTab === "other" && otherTasks.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-400">
                    Không có nhiệm vụ phụ nào
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
            <div className="overflow-hidden rounded-2xl border border-emerald-200/70 bg-emerald-50/80 shadow-2xl shadow-emerald-200/30 transition-colors duration-300 dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-emerald-950/20 dark:backdrop-blur">
              <div className="border-b border-emerald-100 bg-teal-50/70 p-4 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-800/60">
                <h2 className="text-sm font-extrabold tracking-wider text-emerald-900 uppercase dark:text-slate-100">
                  Bảng Xếp Hạng
                </h2>
              </div>
              <div className="p-4">
                <Ranking />
              </div>
            </div>

            {/* Stats Card */}
            <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/90 p-5 shadow-2xl shadow-emerald-200/30 transition-colors duration-300 dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-emerald-950/20 dark:backdrop-blur">
              <h2 className="mb-4 text-sm font-extrabold tracking-wider text-emerald-900 uppercase dark:text-slate-100">
                Thống Kê Hoạt Động
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-200/60 bg-emerald-100/70 p-4 text-center transition-colors duration-300 dark:border-emerald-400/20 dark:bg-emerald-500/10">
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                    {completedTasks.length}
                  </p>
                  <p className="mt-1 text-[10px] leading-snug font-bold tracking-wide text-emerald-800 uppercase dark:text-emerald-200/80">
                    Nhiệm vụ đã xong
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-200/60 bg-emerald-100/70 p-4 text-center transition-colors duration-300 dark:border-emerald-400/20 dark:bg-emerald-500/10">
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                    {completedTasks.reduce((sum, task) => {
                      return sum + (task.coin || task.coins || 0);
                    }, 0)}
                  </p>
                  <p className="mt-1 text-[10px] leading-snug font-bold tracking-wide text-emerald-800 uppercase dark:text-emerald-200/80">
                    Xu đã nhận
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Submission Modal */}
      {selectedTask && renderTaskModal()}
    </div>
  );
}

export default Mission;
