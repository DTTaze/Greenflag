import { getAllTasksByTypeName, getTaskById } from "@/src/utils/api";

// Helper function to fetch tasks and map with user tasks progress
export const fetchTasksHelper = async (
  typeName: string,
  userTasks: any[],
  excludeCompleted: boolean = false,
) => {
  const TasksByTypeName = await getAllTasksByTypeName(typeName);
  const tasksData = await Promise.all(
    TasksByTypeName.data.map(async (task: any) => (await getTaskById(task.id)).data),
  );

  let filteredUserTasks = userTasks;
  if (excludeCompleted) {
    filteredUserTasks = userTasks.filter(
      (userTask) => userTask.completed_at === null,
    );
  }

  const userTasksProcessed = await Promise.all(
    filteredUserTasks
      .filter((userTask) =>
        TasksByTypeName.data.some((task: any) => task.id === userTask.task_id),
      )
      .map(async (userTask) => {
        const taskData = await getTaskById(userTask.task_id);
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

  const validUserTasks = userTasksProcessed.filter((task) => task !== null);

  const unstartedTasks = tasksData
    .filter(
      (task) =>
        !validUserTasks.some((userTask: any) => userTask.id === task.id) &&
        !userTasks.some(
          (userTask) =>
            userTask.task_id === task.id &&
            (excludeCompleted ? userTask.completed_at !== null : false),
        ),
    )
    .map((task) => ({
      ...task,
      isUserTask: false,
      progress_count: 0,
      completed_at: null,
    }));

  return [...validUserTasks, ...unstartedTasks];
};

export const filterTasksByDifficulty = (tasksList: any[], difficulty: string) => {
  if (difficulty === "all") return tasksList;
  return tasksList.filter((task) => task.difficulty === difficulty);
};

export const getTaskCategory = (title: string = "", description: string = ""): string => {
  const text = `${title} ${description}`.toLowerCase();
  if (text.match(/cây|trồng|rừng|hoa|xanh|vườn/)) return "planting";
  if (text.match(/rác|nhựa|chai|lon|túi|nilon|gom|giấy|phế liệu|pin|sắt/))
    return "recycling";
  if (text.match(/điện|nước|tắt|năng lượng|tiết kiệm/)) return "saving";
  return "other";
};

export const extractTasksData = (taskResponse: any) => {
  let tasksData: any[] = [];
  if (taskResponse?.data) {
    if (taskResponse.data.success && Array.isArray(taskResponse.data.data)) {
      tasksData = taskResponse.data.data;
    } else if (Array.isArray(taskResponse.data)) {
      tasksData = taskResponse.data;
    } else if (
      taskResponse.data.data &&
      typeof taskResponse.data.data === "object"
    ) {
      tasksData = Object.values(taskResponse.data.data);
    }
  }
  return tasksData.map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    total: task.total,
    coins: task.coins,
    difficulty: task.difficulty || "easy",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
};

export const mapUserTasksData = (userTasksData: any, userId: any) => {
  if (!userTasksData?.data) return [];
  return userTasksData.data.map((task: any) => ({
    id: task.id,
    task_id: task.task_id,
    user_id: userId,
    progress_count: task.progress_count,
    assigned_at: task.assigned_at,
    completed_at: task.completed_at,
    created_at: task.created_at,
    updated_at: task.updated_at,
    tasks: task.tasks,
  }));
};
