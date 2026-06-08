import { getAllTasksByTypeNameApi, getTaskByIdApi } from "@/src/utils/api";

// Helper function to fetch tasks and map with user tasks progress
export const fetchTasksHelper = async (
  typeName,
  userTasks,
  excludeCompleted = false,
) => {
  const TasksByTypeName = await getAllTasksByTypeNameApi(typeName);
  const tasksData = await Promise.all(
    TasksByTypeName.data.map(
      async (task) => (await getTaskByIdApi(task.id)).data,
    ),
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

  const validUserTasks = userTasksProcessed.filter((task) => task !== null);

  const unstartedTasks = tasksData
    .filter(
      (task) =>
        !validUserTasks.some((userTask) => userTask.id === task.id) &&
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

export const filterTasksByDifficulty = (tasksList, difficulty) => {
  if (difficulty === "all") return tasksList;
  return tasksList.filter((task) => task.difficulty === difficulty);
};
