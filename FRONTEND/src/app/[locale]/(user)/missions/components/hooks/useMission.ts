import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  getAllTasks,
  getAllTasksByUserId,
  getUser,
  increaseProgressCount,
  receiveCoins,
} from "@/src/utils/api";

import {
  extractTasksData,
  fetchTasksHelper,
  filterTasksByDifficulty,
  getTaskCategory,
  mapUserTasksData,
} from "../utils/missionHelpers";

export default function useMission() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [userTasks, setUserTasks] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [completingTask, setCompletingTask] = useState<any>(null);
  const [dailyCurrentPage, setDailyCurrentPage] = useState<number>(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState<number>(1);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const taskPerPage = 4;
  const [selectedTab, setSelectedTab] = useState<string>("daily");
  const [dailyTasks, setDailyTasks] = useState<any[]>([]);
  const [otherTasks, setOtherTasks] = useState<any[]>([]);
  const [dailyDifficultyFilter, setDailyDifficultyFilter] =
    useState<string>("all");
  const [otherDifficultyFilter, setOtherDifficultyFilter] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortByCoins, setSortByCoins] = useState<string>("none");

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [taskResponse, userResponse]: any[] = await Promise.all([
          getAllTasks(),
          getUser(),
        ]);

        const tasksData = extractTasksData(taskResponse);

        if (userResponse?.data) {
          setUserInfo({
            public_id: userResponse.data.public_id,
            id: userResponse.data.id,
            full_name: userResponse.data.full_name || "User",
            email: userResponse.data.email,
            coins: userResponse.data.coins.amount || 0,
            streak: userResponse.data.streak || 0,
            last_completed_task: userResponse.data.last_completed_task,
          });
        } else {
          setUserInfo({
            id: 0,
            name: "Guest User",
            coins: 0,
            streak: 0,
          });
        }

        if (tasksData.length > 0) {
          setTasks(tasksData);
          const userTasksData: any = await getAllTasksByUserId(
            userResponse.data.id,
          );
          const processedUserTasksData = mapUserTasksData(
            userTasksData,
            userResponse.data.id,
          );
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
    async (userId: any, taskId: any, numOfProgress: number) => {
      try {
        const userTask = userTasks.find(
          (ut) => ut.user_id === userId && ut.task_id === taskId,
        );

        if (!userTask) return;
        setCompletingTask(taskId);

        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        let updatedTaskUser: any = null;
        for (let i = 0; i < numOfProgress; i++) {
          updatedTaskUser = await increaseProgressCount(userTask.id);
        }

        if (updatedTaskUser && updatedTaskUser.data) {
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

        if (updatedTaskUser && updatedTaskUser.data.completed_at) {
          try {
            await receiveCoins(task.coins);
            const responseUser: any = await getUser();
            setUserInfo((prev: any) => ({
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

  const handleTaskSelect = useCallback((task: any) => {
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
    (pageNumber: number) => {
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
    let list: any[] = [];
    if (selectedTab === "daily") {
      list = filterTasksByDifficulty(dailyTasks, dailyDifficultyFilter);
    } else if (selectedTab === "other") {
      list = filterTasksByDifficulty(otherTasks, otherDifficultyFilter);
    } else if (selectedTab === "completed") {
      list = completedTasks;
    }

    // Apply search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (task) =>
          (task.title || "").toLowerCase().includes(q) ||
          (task.description || "").toLowerCase().includes(q),
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      list = list.filter((task) => {
        const cat = getTaskCategory(task.title || "", task.description || "");
        return cat === categoryFilter;
      });
    }

    // Apply sort by coins
    if (sortByCoins === "asc") {
      list = [...list].sort((a, b) => (a.coins || 0) - (b.coins || 0));
    } else if (sortByCoins === "desc") {
      list = [...list].sort((a, b) => (b.coins || 0) - (a.coins || 0));
    }

    return list;
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
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    sortByCoins,
    setSortByCoins,
    getTaskCategory,
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
