import {
  acceptTask,
  adminChangeTaskStatus,
  adminCreateTask,
  adminDeleteTask,
  adminGetAllTasks,
  adminGetPendingSubmissionsCount,
  adminGetTaskSubmissions,
  adminHandleDecisionTaskSubmit,
  adminUpdateTask,
  getAllTasksStatusPublic,
  getTaskById,
  getTasks,
  getTasksByDifficultyName,
  getTasksByTypeName,
  getTaskSubmitByUserId,
  getUserAllTasks,
  getUserCompletedTasks,
  increaseProgressCount,
  partnerChangeTaskStatus,
  partnerCreateTask,
  partnerDeleteTask,
  partnerGetMyTasks,
  partnerGetMyTaskSubmissions,
  partnerHandleDecisionTaskSubmit,
  partnerUpdateTask,
  submitTask,
} from "@/src/services/task";
import {
  ChangeTaskStatusPayload,
  CreateTaskPayload,
  DecisionTaskSubmitPayload,
  UpdateTaskPayload,
} from "@/src/types/task/task.payload";

export const getTasksFn = async () => {
  const res = await getTasks();
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch tasks");
  }
  return res.data;
};

export const getTaskByIdFn = async (id: string) => {
  const res = await getTaskById(id);
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch task");
  }
  return res.data;
};

export const getTasksByTypeNameFn = async (typeName: string) => {
  const res = await getTasksByTypeName(typeName);
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch tasks by type");
  }
  return res.data;
};

export const getTasksByDifficultyNameFn = async (difficulty: string) => {
  const res = await getTasksByDifficultyName(difficulty);
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch tasks by difficulty");
  }
  return res.data;
};

export const getTaskSubmitByUserIdFn = async (userId: string) => {
  const res = await getTaskSubmitByUserId(userId);
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch task submissions");
  }
  return res.data;
};

export const getAllTasksStatusPublicFn = async () => {
  const res = await getAllTasksStatusPublic();
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch public tasks");
  }
  return res.data;
};

export const acceptTaskFn = async (id: string) => {
  const res = await acceptTask(id);
  if (!res.success) {
    throw new Error(res.message || "Failed to accept task");
  }
  return res.data;
};

export const increaseProgressCountFn = async (taskUserId: string) => {
  const res = await increaseProgressCount(taskUserId);
  if (!res.success) {
    throw new Error(res.message || "Failed to increase progress");
  }
  return res.data;
};

export const submitTaskFn = async ({
  taskId,
  description,
  images,
}: {
  taskId: string;
  description: string;
  images: File[];
}) => {
  const res = await submitTask(taskId, description, images);
  if (!res.success) {
    throw new Error(res.message || "Failed to submit task");
  }
  return res.data;
};

/** Admin API Query Fns */

export const adminGetAllTasksFn = async (showDeleted?: boolean) => {
  const res = await adminGetAllTasks(showDeleted);
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch admin tasks");
  }
  return res.data;
};

export const adminGetPendingSubmissionsCountFn = async () => {
  const res = await adminGetPendingSubmissionsCount();
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch pending submissions count");
  }
  return res.data;
};

export const adminGetTaskSubmissionsFn = async (customerId: string) => {
  const res = await adminGetTaskSubmissions(customerId);
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch admin submissions");
  }
  return res.data;
};

export const adminCreateTaskFn = async (payload: CreateTaskPayload) => {
  const res = await adminCreateTask(payload);
  if (!res.success) {
    throw new Error(res.message || "Failed to create task");
  }
  return res.data;
};

export const adminUpdateTaskFn = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateTaskPayload;
}) => {
  const res = await adminUpdateTask(id, payload);
  if (!res.success) {
    throw new Error(res.message || "Failed to update task");
  }
  return res.data;
};

export const adminDeleteTaskFn = async (id: string) => {
  const res = await adminDeleteTask(id);
  if (!res.success) {
    throw new Error(res.message || "Failed to delete task");
  }
  return res.data;
};

export const adminChangeTaskStatusFn = async ({
  id,
  payload,
}: {
  id: string;
  payload: ChangeTaskStatusPayload;
}) => {
  const res = await adminChangeTaskStatus(id, payload);
  if (!res.success) {
    throw new Error(res.message || "Failed to change task status");
  }
  return res.data;
};

export const adminHandleDecisionTaskSubmitFn = async ({
  id,
  payload,
}: {
  id: string;
  payload: DecisionTaskSubmitPayload;
}) => {
  const res = await adminHandleDecisionTaskSubmit(id, payload);
  if (!res.success) {
    throw new Error(res.message || "Failed to submit decision");
  }
  return res.data;
};

/** Partner API Query Fns */

export const partnerGetMyTasksFn = async () => {
  const res = await partnerGetMyTasks();
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch partner tasks");
  }
  return res.data;
};

export const partnerGetMyTaskSubmissionsFn = async () => {
  const res = await partnerGetMyTaskSubmissions();
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch partner submissions");
  }
  return res.data;
};

export const partnerCreateTaskFn = async (payload: CreateTaskPayload) => {
  const res = await partnerCreateTask(payload);
  if (!res.success) {
    throw new Error(res.message || "Failed to create task");
  }
  return res.data;
};

export const partnerUpdateTaskFn = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateTaskPayload;
}) => {
  const res = await partnerUpdateTask(id, payload);
  if (!res.success) {
    throw new Error(res.message || "Failed to update task");
  }
  return res.data;
};

export const partnerDeleteTaskFn = async (id: string) => {
  const res = await partnerDeleteTask(id);
  if (!res.success) {
    throw new Error(res.message || "Failed to delete task");
  }
  return res.data;
};

export const partnerChangeTaskStatusFn = async ({
  id,
  payload,
}: {
  id: string;
  payload: ChangeTaskStatusPayload;
}) => {
  const res = await partnerChangeTaskStatus(id, payload);
  if (!res.success) {
    throw new Error(res.message || "Failed to change task status");
  }
  return res.data;
};

export const partnerHandleDecisionTaskSubmitFn = async ({
  id,
  payload,
}: {
  id: string;
  payload: DecisionTaskSubmitPayload;
}) => {
  const res = await partnerHandleDecisionTaskSubmit(id, payload);
  if (!res.success) {
    throw new Error(res.message || "Failed to submit decision");
  }
  return res.data;
};

/** User Assigned/Completed Task Fns */

export const getUserCompletedTasksFn = async () => {
  const res = await getUserCompletedTasks();
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch completed tasks");
  }
  return res.data;
};

export const getUserAllTasksFn = async (userId: string) => {
  const res = await getUserAllTasks(userId);
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch user tasks");
  }
  return res.data;
};
