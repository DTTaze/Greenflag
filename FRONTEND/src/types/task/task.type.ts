export enum TaskDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  EVENT = "event",
}

export enum TaskVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

export enum TaskSubmitStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface TaskTypeLabel {
  id: string;
  type: string;
}

export interface TaskSubmitType {
  id: string;
  taskUserId: string;
  description?: string;
  status: TaskSubmitStatus;
  submittedAt: string;
  images?: string[];
}

export interface TaskUserType {
  id: string;
  userId: string;
  taskId: string;
  progressCount: number;
  assignedAt: string;
  completedAt?: string;
  submits?: TaskSubmitType[];
}

export interface TaskType {
  id: string;
  creatorId: string;
  title: string;
  content?: string;
  description: string;
  coins: number;
  difficulty: TaskDifficulty;
  total: number;
  status: TaskVisibility;
  taskTypes?: TaskTypeLabel[];
  taskUsers?: TaskUserType[];
  createdAt: string;
  updatedAt: string;
}
