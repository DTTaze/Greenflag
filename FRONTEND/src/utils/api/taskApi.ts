import axios from "../axios.customize";

export const getTaskByIdApi = (task_id: string | number) => {
  return axios.get(`api/tasks/${task_id}`);
};

export const getAllTasksApi = () => {
  return axios.get("api/tasks");
};

export const getAllTaskCompletedById = () => {
  return axios.get(`api/users/task/completed`);
};

export const AllTaskByIdApi = (id: string | number) => {
  return axios.get(`api/users/tasks/all/${id}`);
};

export const receiveCoinApi = (coins: number) => {
  return axios.post("api/tasks/coin/receive", { coins });
};

export const increaseProgressCountApi = (task_user_id: string | number) => {
  return axios.post(`api/tasks/progress/increase/${task_user_id}`);
};

export const deleteTaskApi = (id: string | number) => {
  return axios.delete(`api/tasks/${id}`);
};

export const createTaskApi = (data: any) => {
  return axios.post("api/tasks/upload", data);
};

export const updateTaskApi = (id: string | number, data: any) => {
  return axios.put(`api/tasks/${id}`, data);
};

export const acceptTaskByIdApi = (task_id: string | number) => {
  return axios.post(`api/tasks/accept/${task_id}`);
};

export const getAllTasksByTypeNameApi = (type_name: string) => {
  return axios.get(`api/tasks/type/${type_name}`);
};
