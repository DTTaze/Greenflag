import { create } from "zustand";

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

export interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
}

export type NotificationAction =
  | {
      type: "SET_NOTIFICATIONS";
      payload: { items: NotificationItem[]; unreadCount: number };
    }
  | { type: "ADD_NOTIFICATION"; payload: NotificationItem }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" };

const notificationReducer = (
  state: NotificationState,
  action: NotificationAction,
): NotificationState => {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload.items.slice(0, 50),
        unreadCount: action.payload.unreadCount,
      };
    case "ADD_NOTIFICATION": {
      const exists = state.notifications.some(
        (n) => n.id === action.payload.id,
      );
      if (exists) return state;

      const newNotifications = [action.payload, ...state.notifications].slice(
        0,
        50,
      );
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: state.unreadCount + (action.payload.isRead ? 0 : 1),
      };
    }
    case "MARK_AS_READ": {
      const targetNotif = state.notifications.find(
        (n) => n.id === action.payload,
      );
      if (!targetNotif || targetNotif.isRead) return state;

      const updatedNotifications = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, isRead: true } : n,
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    }
    case "MARK_ALL_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      };
    default:
      return state;
  }
};

interface NotificationStore extends NotificationState {
  dispatch: (action: NotificationAction) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  dispatch: (action) => set((state) => notificationReducer(state, action)),
}));
