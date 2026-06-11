export interface AdminReportSummaryDTO {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  totalOrders: number;
  pendingOrders: number;
  totalCoinsDistributed: number;
  totalCoinsRedeemed: number;
  periodStart: string;
  periodEnd: string;
}

export interface UserActivityMetricDTO {
  date: string;
  activeUsers: number;
  newUsers: number;
  completedTasks: number;
}

export interface AdminPaginationQuery {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
