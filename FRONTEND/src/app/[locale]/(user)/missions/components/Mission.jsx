import "react-toastify/dist/ReactToastify.css";

import { useTranslations } from "next-intl";
import React from "react";
import { ToastContainer } from "react-toastify";

import Calendar from "./Calendar/index.jsx";
import EventBanner from "./EventBanner/index.jsx";
import EventList from "./EventList/index.jsx";
import useMission from "./hooks/useMission";
import MissionFilters from "./MissionFilters/index.jsx";
import MissionHeader from "./MissionHeader/index.jsx";
import MissionSidebarStats from "./MissionSidebarStats/index.jsx";
import MissionSkeleton from "./MissionSkeleton/index.jsx";
import MissionStatsBar from "./MissionStatsBar/index.jsx";
import MissionTabs from "./MissionTabs/index.jsx";
import QrTaskSubmissionModal from "./QrTaskSubmissionModal/index.jsx";
import SidebarRankingCard from "./SidebarRankingCard/index.jsx";
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
    <div className="min-h-screen pb-16 transition-colors duration-300">
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
        <MissionStatsBar
          streak={userInfo?.streak}
          completedCount={completedTasks.length}
          coinsReceived={completedTasks.reduce(
            (sum, task) => sum + (task.coin || task.coins || 0),
            0,
          )}
        />

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
            <SidebarRankingCard />

            {/* Stats Card */}
            <MissionSidebarStats
              completedCount={completedTasks.length}
              coinsReceived={completedTasks.reduce((sum, task) => {
                return sum + (task.coin || task.coins || 0);
              }, 0)}
            />
          </div>
        </div>
      </div>

      {/* Task Submission Modal */}
      {selectedTask && renderTaskModal()}
    </div>
  );
}

export default Mission;
