import axiosClient from "@/src/services";
import { ApiResponse } from "@/src/types/api";
import { TaskType } from "@/src/types/task/task.type";
import { TaskPayload } from "@/src/types/task/task.payload";

/** Service layer for Task domain */
export const getTasks = async (): Promise<ApiResponse<TaskType[]>> => {
  return axiosClient.get("/task");
};

export const getTaskById = async (id: string): Promise<ApiResponse<TaskType>> => {
  return axiosClient.get(`/task/${id}`);
};

export const createTask = async (payload: TaskPayload): Promise<ApiResponse<TaskType>> => {
  return axiosClient.post("/task", payload);
};

export const updateTask = async (id: string, payload: Partial<TaskPayload>): Promise<ApiResponse<TaskType>> => {
  return axiosClient.patch(`/task/${id}`, payload);
};

export const deleteTask = async (id: string): Promise<ApiResponse<null>> => {
  return axiosClient.delete(`/task/${id}`);
};
