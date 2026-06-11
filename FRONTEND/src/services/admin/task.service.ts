import axiosClient from "@/src/services";
const axios = axiosClient;
import {
  ActivityCategoryDTO,
  AdminTaskDTO,
  TaskSubmissionDTO,
  TaskSubmissionDecisionDTO,
  TaskTypeDTO,
} from "@/src/types/admin/task.type";
import { ApiResponse } from "@/src/types/api";

const BASE_URL = "/admin/tasks";

/**
 * Fetch all tasks with pagination and filtering
 */
export async function adminGetAllTasks(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<ApiResponse<AdminTaskDTO[]>> {
  const response = await axios.get(BASE_URL, { params });
  return response.data;
}

/**
 * Fetch task submissions by customer ID
 */
export async function adminGetTaskSubmissions(
  customerId: string,
): Promise<ApiResponse<TaskSubmissionDTO[]>> {
  const response = await axios.get(`${BASE_URL}/submissions/${customerId}`);
  return response.data;
}

/**
 * Create a new task
 */
export async function adminCreateTask(
  payload: Partial<AdminTaskDTO>,
): Promise<ApiResponse<AdminTaskDTO>> {
  const response = await axios.post(BASE_URL, payload);
  return response.data;
}

/**
 * Update an existing task
 */
export async function adminUpdateTask(
  taskId: string,
  payload: Partial<AdminTaskDTO>,
): Promise<ApiResponse<AdminTaskDTO>> {
  const response = await axios.put(`${BASE_URL}/${taskId}`, payload);
  return response.data;
}

/**
 * Delete a task
 */
export async function adminDeleteTask(
  taskId: string,
): Promise<ApiResponse<null>> {
  const response = await axios.delete(`${BASE_URL}/${taskId}`);
  return response.data;
}

/**
 * Change task visibility status (PUBLIC/PRIVATE)
 */
export async function adminUpdateTaskStatus(
  taskId: string,
  status: "PUBLIC" | "PRIVATE",
): Promise<ApiResponse<AdminTaskDTO>> {
  const response = await axios.patch(`${BASE_URL}/${taskId}/status`, {
    status,
  });
  return response.data;
}

/**
 * Approve or reject task submission
 */
export async function adminApproveTaskSubmission(
  submissionId: string,
  decision: TaskSubmissionDecisionDTO,
): Promise<ApiResponse<TaskSubmissionDTO>> {
  const response = await axios.put(
    `${BASE_URL}/submissions/${submissionId}/decision`,
    decision,
  );
  return response.data;
}

/**
 * Task Types Management
 */
const TASK_TYPE_URL = "/admin/tasks/types";

export async function adminGetTaskTypes(): Promise<ApiResponse<TaskTypeDTO[]>> {
  const response = await axios.get(TASK_TYPE_URL);
  return response.data;
}

export async function adminCreateTaskType(
  payload: Partial<TaskTypeDTO>,
): Promise<ApiResponse<TaskTypeDTO>> {
  const response = await axios.post(TASK_TYPE_URL, payload);
  return response.data;
}

export async function adminUpdateTaskType(
  typeId: string,
  payload: Partial<TaskTypeDTO>,
): Promise<ApiResponse<TaskTypeDTO>> {
  const response = await axios.put(`${TASK_TYPE_URL}/${typeId}`, payload);
  return response.data;
}

export async function adminDeleteTaskType(
  typeId: string,
): Promise<ApiResponse<null>> {
  const response = await axios.delete(`${TASK_TYPE_URL}/${typeId}`);
  return response.data;
}

/**
 * Activity Categories Management
 */
const ACTIVITY_CATEGORY_URL = "/admin/tasks/categories";

export async function adminGetActivityCategories(): Promise<
  ApiResponse<ActivityCategoryDTO[]>
> {
  const response = await axios.get(ACTIVITY_CATEGORY_URL);
  return response.data;
}

export async function adminCreateActivityCategory(
  payload: Partial<ActivityCategoryDTO>,
): Promise<ApiResponse<ActivityCategoryDTO>> {
  const response = await axios.post(ACTIVITY_CATEGORY_URL, payload);
  return response.data;
}

export async function adminUpdateActivityCategory(
  categoryId: string,
  payload: Partial<ActivityCategoryDTO>,
): Promise<ApiResponse<ActivityCategoryDTO>> {
  const response = await axios.put(
    `${ACTIVITY_CATEGORY_URL}/${categoryId}`,
    payload,
  );
  return response.data;
}

export async function adminDeleteActivityCategory(
  categoryId: string,
): Promise<ApiResponse<null>> {
  const response = await axios.delete(`${ACTIVITY_CATEGORY_URL}/${categoryId}`);
  return response.data;
}
