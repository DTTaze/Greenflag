import axiosClient from "@/src/services";
import { ApiResponse } from "@/src/types/api";

export interface NotificationItem {
  id: string;
  recipientId: string;
  type: string;
  content: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    username: string;
    avatarUrl?: string;
    fullName?: string;
  } | null;
}

export interface PaginatedNotifications {
  items: NotificationItem[];
  total: number;
  unreadCount: number;
}

export const notificationService = {
  getNotifications: async (
    page = 1,
    limit = 20,
  ): Promise<ApiResponse<PaginatedNotifications>> => {
    return axiosClient.get(`/notifications?page=${page}&limit=${limit}`);
  },

  markAsRead: async (id: string): Promise<ApiResponse<NotificationItem>> => {
    return axiosClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    return axiosClient.patch("/notifications/read-all");
  },
};
