import {
  acceptTask as serviceAcceptTask,
  adminCreateTask,
  adminDeleteTask,
  adminUpdateTask,
  getTaskById as serviceGetTaskById,
  getTasks,
  getTasksByTypeName,
  getUserAllTasks,
  getUserCompletedTasks,
  increaseProgressCount as serviceIncreaseProgressCount,
} from "../../services/task";

export const getTaskById = async (taskId: string | number) => {
  return serviceGetTaskById(taskId.toString());
};

export const getAllTasks = async () => {
  return getTasks();
};

export const getMyCompletedTasks = async () => {
  return getUserCompletedTasks();
};

export const getAllTasksByUserId = async (userId: string | number) => {
  return getUserAllTasks(userId.toString());
};

export const receiveCoins = async (_coins: number) => {
  // NestJS backend handles coin additions automatically upon task completion;
  // returning a successful mocked response for compatibility.
  return { success: true, data: null, message: "Coins handled by completion" };
};

export const increaseProgressCount = async (taskUserId: string | number) => {
  return serviceIncreaseProgressCount(taskUserId.toString());
};

export const deleteTask = async (taskId: string | number) => {
  // Default to admin deletion for backward compatibility
  return adminDeleteTask(taskId.toString());
};

export const createTask = async (data: any) => {
  return adminCreateTask(data);
};

export const updateTask = async (taskId: string | number, data: any) => {
  return adminUpdateTask(taskId.toString(), data);
};

export const acceptTask = async (taskId: string | number) => {
  return serviceAcceptTask(taskId.toString());
};

export const getAllTasksByTypeName = async (typeName: string) => {
  return getTasksByTypeName(typeName);
};
