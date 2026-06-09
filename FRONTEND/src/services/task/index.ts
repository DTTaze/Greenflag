import axiosClient from "@/src/services";
import { ApiResponse } from "@/src/types/api";
import {
  ChangeTaskStatusPayload,
  CreateTaskPayload,
  DecisionTaskSubmitPayload,
  UpdateTaskPayload,
} from "@/src/types/task/task.payload";
import { TaskType, TaskUserType } from "@/src/types/task/task.type";

/** General User Task Endpoints (/tasks) */

export const getTasks = async (): Promise<ApiResponse<TaskType[]>> => {
  return axiosClient.get("/tasks");
};

export const getTaskById = async (
  id: string,
): Promise<ApiResponse<TaskType>> => {
  return axiosClient.get(`/tasks/${id}`);
};

export const getTasksByTypeName = async (
  typeName: string,
): Promise<ApiResponse<TaskType[]>> => {
  return axiosClient.get(`/tasks/type/${typeName}`);
};

export const getTasksByDifficultyName = async (
  difficulty: string,
): Promise<ApiResponse<TaskType[]>> => {
  return axiosClient.get(`/tasks/difficulty/${difficulty}`);
};

export const getTaskSubmitByUserId = async (
  userId: string,
): Promise<ApiResponse<any[]>> => {
  return axiosClient.get(`/tasks/submissions/user/${userId}`);
};

export const getAllTasksStatusPublic = async (): Promise<
  ApiResponse<TaskType[]>
> => {
  return axiosClient.get("/tasks/status/public");
};

export const acceptTask = async (
  id: string,
): Promise<ApiResponse<TaskUserType>> => {
  return axiosClient.post(`/tasks/accept/${id}`);
};

export const increaseProgressCount = async (
  taskUserId: string,
): Promise<ApiResponse<TaskUserType>> => {
  return axiosClient.post(`/tasks/progress/increase/${taskUserId}`);
};

export const submitTask = async (
  taskId: string,
  description: string,
  images: File[],
): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append("description", description || "");
  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }
  return axiosClient.post(`/tasks/submit/${taskId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/** Admin Task Endpoints (/admin/tasks) */

export const adminGetAllTasks = async (): Promise<ApiResponse<TaskType[]>> => {
  return axiosClient.get("/admin/tasks");
};

export const adminGetTaskSubmissions = async (
  customerId: string,
): Promise<ApiResponse<any[]>> => {
  return axiosClient.get(`/admin/tasks/submissions/${customerId}`);
};

export const adminCreateTask = async (
  payload: CreateTaskPayload,
): Promise<ApiResponse<TaskType>> => {
  return axiosClient.post("/admin/tasks", payload);
};

export const adminUpdateTask = async (
  id: string,
  payload: UpdateTaskPayload,
): Promise<ApiResponse<TaskType>> => {
  return axiosClient.put(`/admin/tasks/${id}`, payload);
};

export const adminDeleteTask = async (
  id: string,
): Promise<ApiResponse<void>> => {
  return axiosClient.delete(`/admin/tasks/${id}`);
};

export const adminChangeTaskStatus = async (
  id: string,
  payload: ChangeTaskStatusPayload,
): Promise<ApiResponse<TaskType>> => {
  return axiosClient.patch(`/admin/tasks/${id}/status`, payload);
};

export const adminHandleDecisionTaskSubmit = async (
  id: string,
  payload: DecisionTaskSubmitPayload,
): Promise<ApiResponse<any>> => {
  return axiosClient.put(`/admin/tasks/submissions/${id}/decision`, payload);
};

/** Partner/Customer Task Endpoints (/partner/tasks) */

export const partnerGetMyTasks = async (): Promise<ApiResponse<TaskType[]>> => {
  return axiosClient.get("/partner/tasks");
};

export const partnerGetMyTaskSubmissions = async (): Promise<
  ApiResponse<any[]>
> => {
  return axiosClient.get("/partner/tasks/submissions");
};

export const partnerCreateTask = async (
  payload: CreateTaskPayload,
): Promise<ApiResponse<TaskType>> => {
  return axiosClient.post("/partner/tasks", payload);
};

export const partnerUpdateTask = async (
  id: string,
  payload: UpdateTaskPayload,
): Promise<ApiResponse<TaskType>> => {
  return axiosClient.put(`/partner/tasks/${id}`, payload);
};

export const partnerDeleteTask = async (
  id: string,
): Promise<ApiResponse<void>> => {
  return axiosClient.delete(`/partner/tasks/${id}`);
};

export const partnerChangeTaskStatus = async (
  id: string,
  payload: ChangeTaskStatusPayload,
): Promise<ApiResponse<TaskType>> => {
  return axiosClient.patch(`/partner/tasks/${id}/status`, payload);
};

export const partnerHandleDecisionTaskSubmit = async (
  id: string,
  payload: DecisionTaskSubmitPayload,
): Promise<ApiResponse<any>> => {
  return axiosClient.put(`/partner/tasks/submissions/${id}/decision`, payload);
};

/** User Tasks Endpoints (/users/tasks/...) */

export const getUserCompletedTasks = async (): Promise<
  ApiResponse<TaskType[]>
> => {
  return axiosClient.get("/users/task/completed");
};

export const getUserAllTasks = async (
  userId: string,
): Promise<ApiResponse<TaskUserType[]>> => {
  return axiosClient.get(`/users/tasks/all/${userId}`);
};
