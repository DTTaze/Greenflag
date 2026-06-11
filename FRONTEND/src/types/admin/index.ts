// Re-export all admin type definitions
export * from "./commerce.type";
export * from "./delivery.type";
export * from "./event.type";
export * from "./moderation.type";
export * from "./report.type";
export * from "./task.type";
export * from "./user.type";

export enum AdminActionType {
  LOCK_ACCOUNT = "LOCK_ACCOUNT",
  UNLOCK_ACCOUNT = "UNLOCK_ACCOUNT",
  DELETE_USER = "DELETE_USER",
  APPROVE_TASK = "APPROVE_TASK",
  REJECT_TASK = "REJECT_TASK",
  UPDATE_ORDER_STATUS = "UPDATE_ORDER_STATUS",
}
