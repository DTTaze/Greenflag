import axios from "../axios.customize";

export const getTaskById = (taskId: string | number) => {
  return axios.get(`api/tasks/${taskId}`);
};

export const getAllTasks = () => {
  return axios.get("api/tasks");
};

export const getMyCompletedTasks = () => {
  return axios.get(`api/users/task/completed`);
};

export const getAllTasksByUserId = (userId: string | number) => {
  return axios.get(`api/users/tasks/all/${userId}`);
};

export const receiveCoins = (coins: number) => {
  return axios.post("api/tasks/coin/receive", { coins });
};

export const increaseProgressCount = (taskUserId: string | number) => {
  return axios.post(`api/tasks/progress/increase/${taskUserId}`);
};

export const deleteTask = (taskId: string | number) => {
  return axios.delete(`api/tasks/${taskId}`);
};

export const createTask = (data: any) => {
  return axios.post("api/tasks/upload", data);
};

export const updateTask = (taskId: string | number, data: any) => {
  return axios.put(`api/tasks/${taskId}`, data);
};

export const acceptTask = (taskId: string | number) => {
  return axios.post(`api/tasks/accept/${taskId}`);
};

export const getAllTasksByTypeName = (typeName: string) => {
  return axios.get(`api/tasks/type/${typeName}`);
};
