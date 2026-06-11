import { UserType } from "../user/user.type";

export interface AdminTaskDTO {
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  points: number;
  status: "PUBLIC" | "PRIVATE";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskSubmissionDTO {
  id: string;
  userId: string;
  taskId: string;
  taskName: string;
  evidenceUrls: string[];
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  feedback?: string;
  user?: UserType;
}

export interface TaskSubmissionDecisionDTO {
  decision: "APPROVED" | "REJECTED";
  reason?: string;
}

export interface ApproveTaskPayload {
  status: "APPROVED" | "REJECTED";
  feedback?: string;
}

export interface TaskTypeDTO {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface ActivityCategoryDTO {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface TaskCompletionMetricDTO {
  taskId: string;
  taskName: string;
  totalSubmissions: number;
  approvedSubmissions: number;
  rejectionRate: number;
}
