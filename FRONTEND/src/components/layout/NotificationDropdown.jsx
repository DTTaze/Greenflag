import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  Bell,
  CheckCheck,
  ChevronRight,
  Inbox,
  MessageSquare,
  RefreshCw,
  ThumbsUp,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";

import { useRouter } from "@/src/i18n/navigation";
import { notificationService } from "@/src/services/notification.service";
import { useNotificationStore } from "@/src/store/notification/notificationStore";

const notificationTypeConfig = {
  NEW_COMMENT: {
    icon: MessageSquare,
    bgClass: "bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30",
  },
  POST_APPROVED: {
    icon: ThumbsUp,
    bgClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30",
  },
  POST_REJECTED: {
    icon: AlertCircle,
    bgClass: "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30",
  },
  MENTION: {
    icon: MessageSquare,
    bgClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30",
  },
  COIN_RECEIVED: {
    icon: Award,
    bgClass: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30",
  },
  ORDER_REFUNDED: {
    icon: RefreshCw,
    bgClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30",
  },
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("notifications");
  const { notifications, unreadCount, dispatch } = useNotificationStore();

  const handleMarkAsRead = async (id, link) => {
    try {
      // Optimitic update on UI
      dispatch({ type: "MARK_AS_READ", payload: id });
      
      // Call API
      await notificationService.markAsRead(id);

      setIsOpen(false);
      if (link) {
        router.push(link);
      }
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
      const code = error.response?.data?.code;
      if (code) {
        toast.error(t(`errors.${code}`));
      } else {
        toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      // Optimistic update
      dispatch({ type: "MARK_ALL_AS_READ" });
      
      // Call API
      await notificationService.markAllAsRead();
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả đã đọc:", error);
      const code = error.response?.data?.code;
      if (code) {
        toast.error(t(`errors.${code}`));
      } else {
        toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }
    }
  };

  const formatTimeAgo = (dateStr) => {
    const now = new Date();
    const created = new Date(dateStr);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return t("justNow");
    }
    if (diffMins < 60) {
      return t("minutesAgo", { count: diffMins });
    }
    if (diffHours < 24) {
      return t("hoursAgo", { count: diffHours });
    }
    return t("daysAgo", { count: diffDays });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex cursor-pointer items-center justify-center rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        aria-label="Notifications"
      >
        <Bell className="h-5.5 w-5.5" />
        
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-900">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
            <span className="absolute top-1.5 right-1.5 h-4.5 w-4.5 animate-ping rounded-full bg-red-500 opacity-75 ring-2 ring-white dark:ring-zinc-900" />
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click handling */}
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 z-40 mt-2.5 w-80 rounded-xl border border-gray-100 bg-white p-0 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:w-96"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-zinc-800">
                <span className="text-sm font-bold text-gray-800 dark:text-zinc-200">
                  {t("title")}
                </span>
                
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#0B6E4F] transition-colors hover:text-[#0B6E4F]/80 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>{t("markAllAsRead")}</span>
                  </button>
                )}
              </div>

              {/* List Container */}
              <div className="custom-scrollbar max-h-96 overflow-y-auto py-1">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 dark:bg-zinc-800/50 dark:text-zinc-500">
                      <Inbox className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-500 dark:text-zinc-400">
                      {t("noNotifications")}
                    </p>
                  </div>
                ) : (
                  notifications.map((item) => {
                    const config = notificationTypeConfig[item.type] || {
                      icon: Bell,
                      bgClass: "bg-gray-50 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400",
                    };
                    const IconComponent = config.icon;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleMarkAsRead(item.id, item.link)}
                        className={`group flex items-start gap-3 px-4 py-3 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer ${
                          !item.isRead
                            ? "bg-emerald-50/30 dark:bg-emerald-950/10"
                            : ""
                        }`}
                      >
                        {/* Icon or Sender Avatar */}
                        {item.sender?.avatarUrl ? (
                          <img
                            src={item.sender.avatarUrl}
                            alt={item.sender.username || "Sender"}
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-gray-100 dark:ring-zinc-800"
                          />
                        ) : (
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bgClass}`}>
                            <IconComponent className="h-4.5 w-4.5" />
                          </div>
                        )}

                        {/* Content text */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs sm:text-sm text-gray-700 dark:text-zinc-300 break-words ${
                            !item.isRead ? "font-semibold text-gray-900 dark:text-zinc-100" : ""
                          }`}>
                            {item.content}
                          </p>
                          <span className="mt-1 block text-xs text-gray-400 dark:text-zinc-500">
                            {formatTimeAgo(item.createdAt)}
                          </span>
                        </div>

                        {/* Unread indicator dot */}
                        {!item.isRead && (
                          <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                        )}
                        
                        {item.link && (
                          <ChevronRight className="mt-2 h-4 w-4 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-600" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
