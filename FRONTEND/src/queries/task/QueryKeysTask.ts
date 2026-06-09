export const TASK_KEYS = {
  LIST: ["tasks"] as const,
  DETAIL: (id: string) => ["task", id] as const,
  TYPE_LIST: (typeName: string) => ["tasks", "type", typeName] as const,
  DIFFICULTY_LIST: (difficulty: string) =>
    ["tasks", "difficulty", difficulty] as const,
  USER_TASKS: (userId: string) => ["userTasks", userId] as const,
  USER_COMPLETED: ["userCompletedTasks"] as const,
  ADMIN_LIST: ["adminTasks"] as const,
  ADMIN_SUBMISSIONS: (customerId: string) =>
    ["adminSubmissions", customerId] as const,
  PARTNER_LIST: ["partnerTasks"] as const,
  PARTNER_SUBMISSIONS: ["partnerSubmissions"] as const,
} as const;
