import axios from "../axios.customize";

export const getTaskByIdApi = (task_id) => {
  return axios.get(`api/tasks/${task_id}`);
};

export const getAllTasksApi = () => {
  return axios.get("api/tasks");
};

export const getAllTaskCompletedById = () => {
  return axios.get(`api/users/task/completed`);
};

export const acceptTaskApi = (task_id, user_id) => {
  return axios.post(`api/tasks/${task_id}/accept/${user_id}`);
};

export const completeTaskApi = (id) => {
  return axios.post(`api/tasks/complete/${id}`);
};

export const AllTaskByIdApi = (id) => {
  return axios.get(`api/users/tasks/all/${id}`);
};

export const receiveCoinApi = (coins) => {
  return axios.post("api/tasks/coin/receive", { coins });
};

export const submitTaskApi = (task_user_id, data) => {
  const formData = new FormData();
  if (data.description) {
    formData.append("description", data.description);
  }
  if (data.file) {
    formData.append("file", data.file);
  }

  return axios.post(`api/tasks/submit/${task_user_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const increaseProgressCountApi = (task_user_id) => {
  return axios.post(`api/tasks/progress/increase/${task_user_id}`);
};

export const deleteTaskApi = (id) => {
  return axios.delete(`api/tasks/${id}`);
};

export const createTaskApi = (data) => {
  return axios.post("api/tasks/upload", data);
};

export const updateTaskApi = (id, data) => {
  return axios.put(`api/tasks/${id}`, data);
};

export const acceptTaskByIdApi = (task_id) => {
  return axios.post(`api/tasks/accept/${task_id}`);
};

export const getAllTasksByTypeNameApi = (type_name) => {
  return axios.get(`api/tasks/type/${type_name}`);
};

export const getAllVideosApi = () => {
  return axios.get("api/videos");
};
