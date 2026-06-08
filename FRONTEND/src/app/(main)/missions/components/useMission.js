import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  getAllTasksByUserId,
  getAllTasks,
  getUser,
  increaseProgressCount,
  receiveCoins,
} from "@/src/utils/api";

import { fetchTasksHelper, filterTasksByDifficulty } from "./missionHelpers.js";

export default function useMission() {
  const [tasks, setTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingTask, setCompletingTask] = useState(null);
  const [dailyCurrentPage, setDailyCurrentPage] = useState(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const taskPerPage = 4;
  const [selectedTab, setSelectedTab] = useState("daily");
  const [dailyTasks, setDailyTasks] = useState([]);
  const [otherTasks, setOtherTasks] = useState([]);
  const [dailyDifficultyFilter, setDailyDifficultyFilter] = useState("all");
  const [otherDifficultyFilter, setOtherDifficultyFilter] = useState("all");

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [taskResponse, userResponse] = await Promise.all([
          getAllTasks(),
          getUser(),
        ]);

        let tasksData = [];
        if (taskResponse?.data) {
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

        if (userResponse?.data) {
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
          setUserInfo({
            id: 0,
            name: "Guest User",
            coins: 0,
            streak: 0,
          });
        }

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

          setTasks(processedTasks);

          const userTasksData = await getAllTasksByUserId(userResponse.data.id);
          const processedUserTasksData = userTasksData.data.map((task) => ({
            id: task.id,
            task_id: task.task_id,
            user_id: userResponse.data.id,
            progress_count: task.progress_count,
            assigned_at: task.assigned_at,
            completed_at: task.completed_at,
            created_at: task.created_at,
            updated_at: task.updated_at,
            tasks: task.tasks,
          }));

          setUserTasks(processedUserTasksData);
        } else {
          setTasks([]);
          toast.warning("No tasks available");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Không thể tải dữ liệu nhiệm vụ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle task completion
  const handleTaskCompletion = useCallback(
    async (userId, taskId, numOfProgress) => {
      try {
        const userTask = userTasks.find(
          (ut) => ut.user_id === userId && ut.task_id === taskId,
        );

        if (!userTask) return;
        setCompletingTask(taskId);

        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        let updatedTaskUser = null;
        for (let i = 0; i < numOfProgress; i++) {
          updatedTaskUser = await increaseProgressCount(userTask.id);
        }

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

        if (updatedTaskUser.data.completed_at) {
          try {
            await receiveCoins(task.coins);
            const responseUser = await getUser();
            setUserInfo((prev) => ({
              ...prev,
              coins: responseUser?.data?.coins.amount || 0,
            }));

            toast.success(`🎉 Chúc mừng! Bạn đã nhận được ${task.coins} xu!`, {
              position: "top-right",
              autoClose: 3000,
              theme: "colored",
              style: { background: "#4CAF50", color: "white" },
            });
          } catch (error) {
            console.error("API call failed:", error);
            toast.error("❌ Không thể hoàn thành nhiệm vụ");
          }
        } else {
          toast.info("📈 Đã cập nhật tiến độ!", {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
            style: { background: "#2196F3", color: "white" },
          });
        }
      } catch (error) {
        console.error("Task completion error:", error);
        toast.error("❌ Đã xảy ra lỗi khi hoàn thành nhiệm vụ");
      } finally {
        setCompletingTask(null);
      }
    },
    [tasks, userTasks],
  );

  const handleTaskSelect = useCallback((task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTask(null);
  }, []);

  // Fetch daily tasks
  useEffect(() => {
    const fetchDailyTasks = async () => {
      try {
        const allDaily = await fetchTasksHelper("daily", userTasks, false);
        setDailyTasks(allDaily);
      } catch (error) {
        console.error("Error fetching daily tasks:", error);
      }
    };
    fetchDailyTasks();
  }, [userTasks]);

  // Fetch other tasks
  useEffect(() => {
    const fetchOtherTasks = async () => {
      try {
        const allOther = await fetchTasksHelper("others", userTasks, true);
        setOtherTasks(allOther);
      } catch (error) {
        console.error("Error fetching other tasks:", error);
      }
    };
    fetchOtherTasks();
  }, [userTasks]);

  const completedTasks = useMemo(() => {
    return userTasks.filter((task) => task.completed_at);
  }, [userTasks]);

  const dailyTotalPages = useMemo(() => {
    return Math.max(1, Math.ceil(dailyTasks.length / taskPerPage));
  }, [dailyTasks]);

  const otherTotalPages = useMemo(() => {
    return Math.max(1, Math.ceil(otherTasks.length / taskPerPage));
  }, [otherTasks]);

  const completedPages = useMemo(() => {
    return Math.max(1, Math.ceil(completedTasks.length / taskPerPage));
  }, [completedTasks]);

  const goToNextPage = useCallback(() => {
    if (selectedTab === "daily") {
      if (dailyCurrentPage < dailyTotalPages) {
        setDailyCurrentPage((prev) => prev + 1);
      }
    } else {
      if (otherCurrentPage < otherTotalPages) {
        setOtherCurrentPage((prev) => prev + 1);
      }
    }
  }, [
    selectedTab,
    dailyCurrentPage,
    dailyTotalPages,
    otherCurrentPage,
    otherTotalPages,
  ]);

  const goToPreviousPage = useCallback(() => {
    if (selectedTab === "daily") {
      if (dailyCurrentPage > 1) {
        setDailyCurrentPage((prev) => prev - 1);
      }
    } else {
      if (otherCurrentPage > 1) {
        setOtherCurrentPage((prev) => prev - 1);
      }
    }
  }, [selectedTab, dailyCurrentPage, otherCurrentPage]);

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
    [selectedTab, dailyTotalPages, otherTotalPages],
  );

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

  return {
    tasks,
    userTasks,
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
  };
}
