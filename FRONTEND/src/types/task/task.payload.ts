import { TaskDifficulty, TaskSubmitStatus, TaskVisibility } from "./task.type";

export interface CreateTaskPayload {
  title: string;
  description: string;
  coins: number;
  difficulty: TaskDifficulty;
  content?: string;
  total?: number;
  typeIds?: string[];
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  coins?: number;
  difficulty?: TaskDifficulty;
  content?: string;
  total?: number;
  status?: TaskVisibility;
  typeIds?: string[];
}

export interface ChangeTaskStatusPayload {
  status: TaskVisibility;
}

export interface SubmitTaskPayload {
  description?: string;
}

export interface DecisionTaskSubmitPayload {
  decision: TaskSubmitStatus;
}
