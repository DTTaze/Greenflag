import * as taskService from "../../services/task";

export const getTaskById = async (taskId: string | number) => {
  return taskService.getTaskById(taskId.toString());
};

export const getAllTasks = async () => {
  return taskService.getTasks();
};

export const getMyCompletedTasks = async () => {
  return taskService.getUserCompletedTasks();
};

export const getAllTasksByUserId = async (userId: string | number) => {
  return taskService.getUserAllTasks(userId.toString());
};

export const receiveCoins = async (coins: number) => {
  // NestJS backend handles coin additions automatically upon task completion;
  // returning a successful mocked response for compatibility.
  return { success: true, data: null, message: "Coins handled by completion" };
};

export const increaseProgressCount = async (taskUserId: string | number) => {
  return taskService.increaseProgressCount(taskUserId.toString());
};

export const deleteTask = async (taskId: string | number) => {
  // Default to admin deletion for backward compatibility
  return taskService.adminDeleteTask(taskId.toString());
};

export const createTask = async (data: any) => {
  return taskService.adminCreateTask(data);
};

export const updateTask = async (taskId: string | number, data: any) => {
  return taskService.adminUpdateTask(taskId.toString(), data);
};

export const acceptTask = async (taskId: string | number) => {
  return taskService.acceptTask(taskId.toString());
};

export const getAllTasksByTypeName = async (typeName: string) => {
  return taskService.getTasksByTypeName(typeName);
};
