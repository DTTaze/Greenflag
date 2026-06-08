import "react-toastify/dist/ReactToastify.css";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import {
  AllTaskByIdApi,
  getAllTasksApi,
  getAllTasksByTypeNameApi,
  getTaskByIdApi,
  getUserApi,
  increaseProgressCountApi,
  receiveCoinApi,
} from "@/src/utils/api.js";

import Calendar from "./Calendar.jsx";
import Ranking from "./ChartRank.jsx";
import EventBanner from "./EventBanner.jsx";
import EventList from "./EventList.jsx";
import MissionHeader from "./MissionHeader.jsx";
import MissionTabs from "./MissionTabs.jsx";
import QrTaskSubmissionModal from "./QrTaskSubmissionModal.jsx";
import TaskCardSkeleton from "./TaskCardSkeleton.jsx";
import TasksList from "./TasksList.jsx";
import TaskSubmissionModal from "./TaskSubmissionModal.jsx";
/* ------------------------------------------------------------ Mission ------------------------------------------------------------ */

function Mission() {
  const [tasks, setTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingTask, setCompletingTask] = useState(null); // Track which task is being completed
  const [dailyCurrentPage, setDailyCurrentPage] = useState(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const taskPerPage = 4;
  const [selectedTab, setSelectedTab] = useState("daily"); // daily or other
  const [dailyTasks, setDailyTasks] = useState([]);
  const [otherTasks, setOtherTasks] = useState([]);
  // const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  // Add new states for difficulty filters
  const [dailyDifficultyFilter, setDailyDifficultyFilter] = useState("all");
  const [otherDifficultyFilter, setOtherDifficultyFilter] = useState("all");

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        console.log("Fetching data from APIs...");

        const [taskResponse, userResponse] = await Promise.all([
          getAllTasksApi(),
          getUserApi(),
        ]);

        console.log("Task response:", taskResponse);
        console.log("User response:", userResponse);

        // Process tasks from API response
        let tasksData = [];

        if (taskResponse?.data) {
          console.log("Processing task response data...");
          if (
            taskResponse.data.success &&
            Array.isArray(taskResponse.data.data)
          ) {
            tasksData = taskResponse.data.data;
          } else if (Array.isArray(taskResponse.data)) {
            tasksData = taskResponse.data;
          } else if (
            taskResponse.data.data &&
            !Array.isArray(taskResponse.data.data)
          ) {
            if (typeof taskResponse.data.data === "object") {
              tasksData = Object.values(taskResponse.data.data);
            }
          }
        }

        console.log("tasks data:", tasksData);
        // Process user data from API response
        if (userResponse?.data) {
          console.log("Setting user info:", userResponse.data);
          const dataOfUser = {
            public_id: userResponse.data.public_id,
            id: userResponse.data.id,
            full_name: userResponse.data.full_name || "User",
            email: userResponse.data.email,
            coins: userResponse.data.coins.amount || 0,
            streak: userResponse.data.streak || 0,
            last_completed_task: userResponse.data.last_completed_task,
          };
          setUserInfo(dataOfUser);
        } else {
          console.log("No user data found, setting default user info.");
          setUserInfo({
            id: 0,
            name: "Guest User",
            coins: 0,
            streak: 0,
          });
        }

        // Process tasksData
        if (tasksData.length > 0) {
          const processedTasks = tasksData.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            total: task.total,
            coins: task.coins,
            difficulty: task.difficulty || "easy",
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          }));

          console.log("Processed tasks for UI:", processedTasks);
          setTasks(processedTasks);

          // get user tasks from API
          const userTasksData = await AllTaskByIdApi(userResponse.data.id);
          console.log("User tasks data from API:", userTasksData);

          const processedUserTasksData = userTasksData.data.map((task) => {
            return {
              id: task.id,
              task_id: task.task_id,
              user_id: userResponse.data.id,
              progress_count: task.progress_count,
              assigned_at: task.assigned_at,
              completed_at: task.completed_at,
              created_at: task.created_at,
              updated_at: task.updated_at,
              tasks: task.tasks,
            };
          });

          console.log(" user tasks:", processedUserTasksData);
          setUserTasks(processedUserTasksData);
        } else {
          console.log("No task found, setting default null.");
          setTasks([]);
          toast.warning("No tasks available");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Không thể tải dữ liệu nhiệm vụ");
      } finally {
        setLoading(false);
        console.log("Finished fetching data.");
      }
    };

    fetchData();
  }, []);

  // Handle task completion with useCallback to prevent recreating function on each render
  const handleTaskCompletion = useCallback(
    async (userId, taskId, numOfProgress) => {
      try {
        const userTask = userTasks.find(
          (ut) => ut.user_id === userId && ut.task_id === taskId,
        );

        console.log("User task:", userTask);

        if (!userTask) return;

        setCompletingTask(taskId);

        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        // Gọi API để tăng tiến độ
        let updatedTaskUser = null;
        for (let i = 0; i < numOfProgress; i++) {
          updatedTaskUser = await increaseProgressCountApi(userTask.id);
        }
        console.log("Updated task user:", updatedTaskUser);

        // Cập nhật UI từ dữ liệu trả về từ backend
        if (updatedTaskUser.data) {
          setUserTasks((prevUserTasks) =>
            prevUserTasks.map((ut) =>
              ut.id === updatedTaskUser.data.id
                ? {
                    ...ut,
                    progress_count: updatedTaskUser.data.progress_count,
                    completed_at: updatedTaskUser.data.completed_at,
                  }
                : ut,
            ),
          );
        }

        // Nếu task nhiệm vụ đã hoàn thành
        if (updatedTaskUser.data.completed_at) {
          try {
            const coinsResponse = await receiveCoinApi(task.coins);
            console.log("Receive coins response:", coinsResponse);

            // Cập nhật lại số xu từ backend
            const responseUser = await getUserApi();
            setUserInfo((prev) => {
              const updatedUser = {
                ...prev,
                coins: responseUser?.data?.coins.amount || 0,
              };
              console.log("check user info after receive coins", updatedUser);
              return updatedUser;
            });

            toast.success(`🎉 Chúc mừng! Bạn đã nhận được ${task.coins} xu!`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              style: {
                background: "#4CAF50",
                color: "white",
                fontSize: "16px",
                fontWeight: "500",
              },
            });
          } catch (error) {
            console.error("API call failed:", error);
            toast.error("❌ Không thể hoàn thành nhiệm vụ", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              style: {
                background: "#f44336",
                color: "white",
                fontSize: "16px",
                fontWeight: "500",
              },
            });
          }
        } else {
          toast.info("📈 Đã cập nhật tiến độ!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: {
              background: "#2196F3",
              color: "white",
              fontSize: "16px",
              fontWeight: "500",
            },
          });
        }
      } catch (error) {
        console.error("Task completion error:", error);
        toast.error("❌ Đã xảy ra lỗi khi hoàn thành nhiệm vụ", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: {
            background: "#f44336",
            color: "white",
            fontSize: "16px",
            fontWeight: "500",
          },
        });
      } finally {
        setCompletingTask(null);
      }
    },
    [tasks, userTasks],
  );

  // Handle task selection for modal
  const handleTaskSelect = useCallback((task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTask(null);
  }, []);

  // Determine which modal to show based on task difficulty
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

  // Memoize filtered and sorted task lists to prevent recalculations on every render

  useEffect(() => {
    const fetchDailyTasks = async () => {
      try {
        // Get tasks by type name
        const TasksByTypeName = await getAllTasksByTypeNameApi("daily");
        console.log("Tasks by type name:", TasksByTypeName);

        // Get detailed task information for each task ID
        const dailyTasksData = await Promise.all(
          TasksByTypeName.data.map(async (task) => {
            const taskData = await getTaskByIdApi(task.id);
            return taskData.data;
          }),
        );

        // Process user tasks that are in daily tasks
        const userDailyTasks = await Promise.all(
          userTasks
            .filter((userTask) =>
              TasksByTypeName.data.some((task) => task.id === userTask.task_id),
            )
            .map(async (userTask) => {
              const taskData = await getTaskByIdApi(userTask.task_id);
              const task = taskData.data;
              return task
                ? {
                    ...task,
                    completed_at: userTask.completed_at,
                    progress_count: userTask.progress_count,
                    isUserTask: true,
                  }
                : null;
            }),
        );

        // Filter out null values
        const validUserDailyTasks = userDailyTasks.filter(
          (task) => task !== null,
        );
        console.log("user daily task: ", validUserDailyTasks);

        // Combine tasks that user is doing with tasks they haven't started
        const allDailyTasks = [
          ...validUserDailyTasks,
          ...dailyTasksData
            .filter(
              (task) =>
                !userTasks.some((userTask) => userTask.task_id === task.id),
            )
            .map((task) => ({
              ...task,
              isUserTask: false,
              progress_count: 0,
              completed_at: null,
            })),
        ];

        console.log("All daily tasks:", allDailyTasks);

        setDailyTasks(allDailyTasks);
      } catch (error) {
        console.error("Error fetching daily tasks:", error);
        toast.error("Không thể tải nhiệm vụ hàng ngày");
      }
    };

    fetchDailyTasks();
  }, [userTasks]);

  console.log("Daily tasks:", dailyTasks);

  useEffect(() => {
    const fetchOtherTasks = async () => {
      try {
        // Get tasks by type name
        const TasksByTypeName = await getAllTasksByTypeNameApi("others");
        console.log("Tasks by type name:", TasksByTypeName);

        // Get detailed task information for each task ID
        const otherTasksData = await Promise.all(
          TasksByTypeName.data.map(async (task) => {
            const taskData = await getTaskByIdApi(task.id);
            return taskData.data;
          }),
        );

        // Process user tasks that are in other tasks and not completed
        const userOtherTasks = await Promise.all(
          userTasks
            .filter(
              (userTask) =>
                userTask.completed_at === null && // Only get uncompleted tasks
                TasksByTypeName.data.some(
                  (task) => task.task_id === userTask.task_id,
                ),
            )
            .map(async (userTask) => {
              const taskData = await getTaskByIdApi(userTask.id);
              const task = taskData.data;
              return task
                ? {
                    ...task,
                    completed_at: userTask.completed_at,
                    progress_count: userTask.progress_count,
                    isUserTask: true,
                  }
                : null;
            }),
        );

        // Filter out null values
        const validUserOtherTasks = userOtherTasks.filter(
          (task) => task !== null,
        );

        // Combine tasks that user is doing with tasks they haven't started
        const allOtherTasks = [
          ...validUserOtherTasks,
          ...otherTasksData
            .filter(
              (task) =>
                !validUserOtherTasks.some(
                  (userTask) => userTask.id === task.id,
                ) &&
                !userTasks.some(
                  (userTask) =>
                    userTask.task_id === task.id &&
                    userTask.completed_at !== null,
                ), // Exclude completed tasks
            )
            .map((task) => ({
              ...task,
              isUserTask: false,
              progress_count: 0,
              completed_at: null,
            })),
        ];

        setOtherTasks(allOtherTasks);
      } catch (error) {
        console.error("Error fetching other tasks:", error);
        toast.error("Không thể tải nhiệm vụ phụ");
      }
    };

    fetchOtherTasks();
  }, [userTasks]);

  console.log("Other tasks:", otherTasks);

  const completedTasks = useMemo(() => {
    // Filter for completed tasks
    return userTasks.filter((task) => task.completed_at);
  }, [userTasks]);

  // Calculate total pages based on number of tasks
  const dailyTotalPages = useMemo(() => {
    return Math.max(1, Math.ceil(dailyTasks.length / taskPerPage));
  }, [dailyTasks, taskPerPage]);

  const otherTotalPages = useMemo(() => {
    return Math.max(1, Math.ceil(otherTasks.length / taskPerPage));
  }, [otherTasks, taskPerPage]);

  const completedPages = useMemo(() => {
    return Math.max(1, Math.ceil(completedTasks.length / taskPerPage));
  }, [completedTasks, taskPerPage]);

  // Pagination handlers
  const goToNextPage = useCallback(() => {
    if (selectedTab === "daily") {
      if (dailyCurrentPage < dailyTotalPages) {
        setDailyCurrentPage((prev) => prev + 1, dailyTotalPages);
      }
    } else {
      if (otherCurrentPage < otherTotalPages) {
        setOtherCurrentPage((prev) => prev + 1, otherTotalPages);
      }
    }
  }, [
    selectedTab === "daily" ? dailyCurrentPage : otherCurrentPage,
    selectedTab === "daily" ? dailyTotalPages : otherTotalPages,
  ]);

  const goToPreviousPage = useCallback(() => {
    if (selectedTab === "daily") {
      if (dailyCurrentPage > 1) {
        setDailyCurrentPage((prev) => prev - 1, dailyTotalPages);
      }
    } else {
      if (otherCurrentPage > 1) {
        setOtherCurrentPage((prev) => prev - 1, otherTotalPages);
      }
    }
  }, [selectedTab === "daily" ? dailyCurrentPage : otherCurrentPage]);

  const goToPage = useCallback(
    (pageNumber) => {
      if (selectedTab === "daily") {
        if (pageNumber >= 1 && pageNumber <= dailyTotalPages) {
          setDailyCurrentPage(pageNumber);
        }
      } else {
        if (pageNumber >= 1 && pageNumber <= otherTotalPages) {
          setOtherCurrentPage(pageNumber);
        }
      }
    },
    [selectedTab === "daily" ? dailyTotalPages : otherTotalPages],
  );

  // Add filter function
  const filterTasksByDifficulty = (tasks, difficulty) => {
    if (difficulty === "all") return tasks;
    return tasks.filter((task) => task.difficulty === difficulty);
  };

  // Get filtered tasks based on current tab and filter
  const getFilteredTasks = () => {
    if (selectedTab === "daily") {
      return filterTasksByDifficulty(dailyTasks, dailyDifficultyFilter);
    } else if (selectedTab === "other") {
      return filterTasksByDifficulty(otherTasks, otherDifficultyFilter);
    } else if (selectedTab === "completed") {
      return completedTasks;
    }
    return [];
  };

  // Show loading skeleton while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          {/* Loading skeleton for header */}
          <div className="mb-8 flex animate-pulse flex-col items-center justify-between rounded-xl bg-gradient-to-r from-green-500 to-green-400 p-6 text-white shadow-lg sm:flex-row">
            <div>
              <div className="bg-opacity-20 mb-2 h-8 w-56 rounded bg-white"></div>
              <div className="bg-opacity-20 h-4 w-80 rounded bg-white"></div>
            </div>
            <div className="mt-4 flex items-center sm:mt-0">
              <div className="bg-opacity-20 mr-4 h-16 w-20 rounded-lg bg-white p-3"></div>
              <div className="bg-opacity-20 h-10 w-24 rounded-lg bg-white"></div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Column - Tasks */}
            <div className="w-full lg:w-2/3">
              {/* Tabs Skeleton */}
              <div className="rounded-t-xl border border-gray-200 bg-white p-1 shadow-sm">
                <div className="flex">
                  <div className="tab flex-1 rounded-lg bg-gray-100 py-3 text-center"></div>
                  <div className="tab flex-1 rounded-lg py-3 text-center"></div>
                </div>
              </div>

              {/* Tasks Skeleton */}
              <div className="rounded-b-xl border-x border-b border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 h-6 w-40 rounded bg-gray-200"></div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                </div>
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="w-full space-y-6 lg:w-1/3">
              {/* Calendar Skeleton */}
              <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="h-16 w-full bg-green-500"></div>
                <div className="p-4">
                  <div className="mb-4 h-8 w-full rounded bg-gray-200"></div>
                  <div className="mb-4 grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-6 rounded-full bg-gray-200"
                      ></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className="mx-auto h-8 w-8 rounded-full bg-gray-100"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ranking Skeleton */}
              <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 p-4">
                  <div className="h-6 w-40 rounded bg-gray-200"></div>
                </div>
                <div className="p-5">
                  <div className="mb-6 flex items-end justify-center">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="mx-2 flex flex-col items-center">
                        <div
                          className={`w-${i === 1 ? 14 : 12} h-${
                            i === 1 ? 14 : 12
                          } mb-2 rounded-full bg-gray-200`}
                        ></div>
                        <div
                          className={`h-${i === 1 ? 24 : 16} w-${
                            i === 1 ? 24 : 16
                          } rounded-t-lg bg-gray-200`}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-10 w-full rounded-lg bg-gray-100"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-3 h-6 w-24 rounded bg-gray-200"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-100 p-3">
                    <div className="mx-auto mb-1 h-8 w-12 rounded bg-gray-200"></div>
                    <div className="mx-auto h-4 w-24 rounded bg-gray-200"></div>
                  </div>
                  <div className="rounded-lg bg-gray-100 p-3">
                    <div className="mx-auto mb-1 h-8 w-12 rounded bg-gray-200"></div>
                    <div className="mx-auto h-4 w-24 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
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

            {/* Difficulty Filter Buttons */}
            <div className="border-x border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex space-x-2">
                {selectedTab === "daily" ? (
                  <>
                    <button
                      onClick={() => {
                        setDailyDifficultyFilter("all");
                        setDailyCurrentPage(1);
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        dailyDifficultyFilter === "all"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => {
                        setDailyDifficultyFilter("easy");
                        setDailyCurrentPage(1);
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        dailyDifficultyFilter === "easy"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Dễ
                    </button>
                    <button
                      onClick={() => {
                        setDailyDifficultyFilter("medium");
                        setDailyCurrentPage(1);
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        dailyDifficultyFilter === "medium"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Trung bình
                    </button>
                    <button
                      onClick={() => {
                        setDailyDifficultyFilter("hard");
                        setDailyCurrentPage(1);
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        dailyDifficultyFilter === "hard"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Khó
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setOtherDifficultyFilter("all");
                        setOtherCurrentPage(1);
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        otherDifficultyFilter === "all"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => {
                        setOtherDifficultyFilter("easy");
                        setOtherCurrentPage(1);
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        otherDifficultyFilter === "easy"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Dễ
                    </button>
                    <button
                      onClick={() => {
                        setOtherDifficultyFilter("medium");
                        setOtherCurrentPage(1);
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        otherDifficultyFilter === "medium"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Trung bình
                    </button>
                    <button
                      onClick={() => {
                        setOtherDifficultyFilter("hard");
                        setOtherCurrentPage(1);
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        otherDifficultyFilter === "hard"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Khó
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Task List */}
            <div className="rounded-b-xl border-x border-b border-gray-200 bg-white p-6 shadow-sm">
              {selectedTab === "daily" && dailyTasks.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="mb-4 text-gray-500">
                    Không có nhiệm vụ hàng ngày nào
                  </p>
                </div>
              ) : selectedTab === "other" && otherTasks.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="mb-4 text-gray-500">
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
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <Calendar
                streak={userInfo?.streak || 0}
                lastLogin={userInfo?.last_completed_task || null}
              />
            </div>

            {/* Ranking Component */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Bảng Xếp Hạng
                </h2>
              </div>
              <div className="p-3">
                <Ranking />
              </div>
            </div>

            {/* Stats Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-3 text-lg font-semibold text-gray-800">
                Thống Kê
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-blue-50 p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {completedTasks.length}
                  </p>
                  <p className="text-sm text-blue-700">
                    Nhiệm vụ đã hoàn thành
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600">
                    {completedTasks.reduce((sum, task) => {
                      return sum + (task.coin || 0);
                    }, 0)}
                  </p>
                  <p className="text-sm text-emerald-700">Xu đã nhận</p>
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
