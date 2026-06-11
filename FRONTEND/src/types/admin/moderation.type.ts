import { UserType } from "../user/user.type";

export interface ModerationContentDTO {
  id: string;
  contentType: "POST" | "COMMENT" | "IMAGE";
  authorId: string;
  author?: UserType;
  content: string;
  flags: string[];
  status: "PENDING" | "APPROVED" | "REJECTED" | "REMOVED";
  createdAt: string;
  reviewedAt?: string;
  reviewerId?: string;
}

export interface ModerationDecisionDTO {
  status: "APPROVED" | "REJECTED" | "REMOVED";
  reason?: string;
  warnUser?: boolean;
}
