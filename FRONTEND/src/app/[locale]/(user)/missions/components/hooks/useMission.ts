import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  useIncreaseProgressMutation,
  useTasksByTypeNameQuery,
  useUserTasksQuery,
} from "@/src/queries/task/useTaskQueries";
import { useCurrentUserQuery } from "@/src/queries/user/useUserQueries";

import {
  filterTasksByDifficulty,
  getTaskCategory,
} from "../utils/missionHelpers";

export default function useMission() {
  const {
    data: userInfo,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useCurrentUserQuery();
  const { data: rawDailyTasks, isLoading: isDailyLoading } =
    useTasksByTypeNameQuery("daily");
  const { data: rawOtherTasks, isLoading: isOtherLoading } =
    useTasksByTypeNameQuery("others");
  const { data: allUserTasks, isLoading: isUserTasksLoading } =
    useUserTasksQuery(userInfo?.id);

  const increaseProgressMutation = useIncreaseProgressMutation();

  const [completingTask, setCompletingTask] = useState<any>(null);
  const [dailyCurrentPage, setDailyCurrentPage] = useState<number>(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState<number>(1);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const taskPerPage = 4;
  const [selectedTab, setSelectedTab] = useState<string>("daily");
  const [dailyDifficultyFilter, setDailyDifficultyFilter] =
    useState<string>("all");
  const [otherDifficultyFilter, setOtherDifficultyFilter] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortByCoins, setSortByCoins] = useState<string>("none");

  const loading =
    isUserLoading || isDailyLoading || isOtherLoading || isUserTasksLoading;

  // Reactively compute dailyTasks
  const dailyTasks = useMemo(() => {
    if (!rawDailyTasks || !allUserTasks) return [];

    const processedUserTasks = (allUserTasks || [])
      .filter((ut: any) => rawDailyTasks.some((t: any) => t.id === ut.taskId))
      .map((ut: any) => {
        const task = rawDailyTasks.find((t: any) => t.id === ut.taskId);
        return task
          ? {
              ...task,
              completed_at: ut.completedAt || null,
              progress_count: ut.progressCount || 0,
              isUserTask: true,
              taskUserId: ut.id,
            }
          : null;
      })
      .filter(Boolean);

    const unstartedTasks = rawDailyTasks
      .filter((t: any) => !allUserTasks.some((ut: any) => ut.taskId === t.id))
      .map((t: any) => ({
        ...t,
        isUserTask: false,
        progress_count: 0,
        completed_at: null,
      }));

    return [...processedUserTasks, ...unstartedTasks];
  }, [rawDailyTasks, allUserTasks]);

  // Reactively compute otherTasks (excluding completed tasks in legacy behavior)
  const otherTasks = useMemo(() => {
    if (!rawOtherTasks || !allUserTasks) return [];

    const processedUserTasks = (allUserTasks || [])
      .filter((ut: any) => ut.completedAt === null)
      .filter((ut: any) => rawOtherTasks.some((t: any) => t.id === ut.taskId))
      .map((ut: any) => {
        const task = rawOtherTasks.find((t: any) => t.id === ut.taskId);
        return task
          ? {
              ...task,
              completed_at: ut.completedAt || null,
              progress_count: ut.progressCount || 0,
              isUserTask: true,
              taskUserId: ut.id,
            }
          : null;
      })
      .filter(Boolean);

    const unstartedTasks = rawOtherTasks
      .filter((t: any) => !allUserTasks.some((ut: any) => ut.taskId === t.id))
      .map((t: any) => ({
        ...t,
        isUserTask: false,
        progress_count: 0,
        completed_at: null,
      }));

    return [...processedUserTasks, ...unstartedTasks];
  }, [rawOtherTasks, allUserTasks]);

  // Reactively compute completedTasks
  const completedTasks = useMemo(() => {
    if (!allUserTasks) return [];
    return allUserTasks
      .filter((ut: any) => ut.completedAt !== null)
      .map((ut: any) => {
        const task =
          rawDailyTasks?.find((t: any) => t.id === ut.taskId) ||
          rawOtherTasks?.find((t: any) => t.id === ut.taskId);
        return task
          ? {
              ...task,
              completed_at: ut.completedAt,
              progress_count: ut.progressCount,
              isUserTask: true,
              taskUserId: ut.id,
            }
          : null;
      })
      .filter(Boolean);
  }, [allUserTasks, rawDailyTasks, rawOtherTasks]);

  // Handle task completion
  const handleTaskCompletion = useCallback(
    async (userId: any, taskId: any, numOfProgress: number) => {
      const combinedTasks = [...dailyTasks, ...otherTasks];
      const taskObj = combinedTasks.find((t) => t.id === taskId);
      if (!taskObj || !taskObj.isUserTask || !taskObj.taskUserId) {
        toast.error("Không tìm thấy thông tin tiến trình nhiệm vụ");
        return;
      }

      setCompletingTask(taskId);
      try {
        let updated: any = null;
        for (let i = 0; i < numOfProgress; i++) {
          updated = await increaseProgressMutation.mutateAsync(
            taskObj.taskUserId,
          );
        }

        // Refetch current user profile to update fresh coins
        refetchUser();

        if (updated && updated.completedAt) {
          toast.success(`🎉 Chúc mừng! Bạn đã nhận được xu thưởng!`, {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            style: { background: "#4CAF50", color: "white" },
          });
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
    [dailyTasks, otherTasks, increaseProgressMutation, refetchUser],
  );

  const handleTaskSelect = useCallback((task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTask(null);
  }, []);

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
    tasks: rawDailyTasks || [], // fallback list of raw tasks
    userTasks: allUserTasks || [],
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
