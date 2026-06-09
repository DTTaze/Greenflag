export const TASK_KEYS = {
  LIST: ["tasks"] as const,
  DETAIL: (id: string) => ["task", id] as const,
  CREATE: ["taskCreate"] as const,
  UPDATE: (id: string) => ["taskUpdate", id] as const,
  DELETE: (id: string) => ["taskDelete", id] as const,
} as const;
