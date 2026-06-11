import {
  AdminPaginationQuery,
  AdminUserDTO,
  LockAccountPayload,
  PaginatedResponse,
} from "@/types/admin";

// Mock API client - replace with actual axios/fetch implementation
const apiClient = {
  get: async <T>(url: string, options?: any): Promise<{ data: T }> => {
    // In a real implementation, this would be an actual API call
    console.log("GET", url, options);
    return { data: {} as T };
  },
  post: async <T>(url: string, data: any): Promise<{ data: T }> => {
    console.log("POST", url, data);
    return { data: {} as T };
  },
  patch: async <T>(url: string, data: any): Promise<{ data: T }> => {
    console.log("PATCH", url, data);
    return { data: {} as T };
  },
  delete: async <T>(url: string): Promise<{ data: T }> => {
    console.log("DELETE", url);
    return { data: {} as T };
  },
};

export const adminUserService = {
  getUsers: async (
    params: AdminPaginationQuery,
  ): Promise<PaginatedResponse<AdminUserDTO>> => {
    const response = await apiClient.get<PaginatedResponse<AdminUserDTO>>(
      "/api/admin/users",
      { params },
    );
    return response.data;
  },

  lockUser: async (userId: string, payload: LockAccountPayload) => {
    const response = await apiClient.patch(
      `/api/admin/users/${userId}/status`,
      payload,
    );
    return response.data;
  },

  unlockUser: async (userId: string, payload: LockAccountPayload) => {
    const response = await apiClient.patch(
      `/api/admin/users/${userId}/status`,
      {
        ...payload,
        isLocked: false,
      },
    );
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await apiClient.delete(`/api/admin/users/${userId}`);
    return response.data;
  },

  getUserActivity: async (userId: string) => {
    const response = await apiClient.get(`/api/admin/users/${userId}/activity`);
    return response.data;
  },
};

// Mock data for demonstration
export const mockUsers: AdminUserDTO[] = [
  {
    id: "1",
    email: "admin@greenflag.com",
    username: "admin",
    role: "ADMIN",
    status: "ACTIVE",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    profile: {
      fullName: "System Admin",
      phoneNumber: "+123456789",
      streak: 45,
      lastCompletedTask: "2026-06-10",
    },
    coin: { amount: 1250 },
    isLocked: false,
    lastActivityDate: "2026-06-10T15:30:00Z",
  },
  {
    id: "2",
    email: "user1@example.com",
    username: "eco_warrior",
    role: "USER",
    status: "ACTIVE",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=eco_warrior",
    profile: {
      fullName: "John Doe",
      phoneNumber: "+987654321",
      streak: 28,
      lastCompletedTask: "2026-06-10",
    },
    coin: { amount: 850 },
    isLocked: false,
    lastActivityDate: "2026-06-09T10:15:00Z",
  },
  {
    id: "3",
    email: "partner@green.org",
    username: "green_partner",
    role: "PARTNER",
    status: "ACTIVE",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=green_partner",
    profile: {
      fullName: "Eco Organization",
      phoneNumber: "+555123456",
      streak: 0,
      lastCompletedTask: "2026-06-08",
    },
    coin: { amount: 3200 },
    isLocked: false,
    lastActivityDate: "2026-06-08T14:45:00Z",
  },
  {
    id: "4",
    email: "inactive@example.com",
    username: "sleepy_user",
    role: "USER",
    status: "INACTIVE",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sleepy_user",
    profile: {
      fullName: "Jane Smith",
      phoneNumber: "+111222333",
      streak: 0,
      lastCompletedTask: "2026-05-15",
    },
    coin: { amount: 150 },
    isLocked: false,
    lastActivityDate: "2026-05-15T09:20:00Z",
  },
  {
    id: "5",
    email: "suspended@example.com",
    username: "rule_breaker",
    role: "USER",
    status: "SUSPENDED",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=rule_breaker",
    profile: {
      fullName: "Bad User",
      phoneNumber: "+444555666",
      streak: 5,
      lastCompletedTask: "2026-05-10",
    },
    coin: { amount: 50 },
    isLocked: true,
    lockReason: "Violation of community guidelines",
    lastActivityDate: "2026-05-10T16:40:00Z",
  },
  {
    id: "6",
    email: "newbie@example.com",
    username: "new_green",
    role: "USER",
    status: "ACTIVE",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=new_green",
    profile: {
      fullName: "New User",
      phoneNumber: "+777888999",
      streak: 3,
      lastCompletedTask: "2026-06-11",
    },
    coin: { amount: 300 },
    isLocked: false,
    lastActivityDate: "2026-06-11T08:10:00Z",
  },
];
