import { getCookie } from "cookies-next/client";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

import { useRouter } from "@/src/i18n/navigation";
import { notificationService } from "@/src/services/notification.service";
import { useAuthStore } from "@/src/store/auth/authStore";
import { useNotificationStore } from "@/src/store/notification/notificationStore";

export const useSocket = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { dispatch } = useNotificationStore();
  const socketRef = useRef<Socket | null>(null);

  const fetchInitialNotifications = async () => {
    try {
      const response = await notificationService.getNotifications(1, 20);
      if (response && response.success && response.data) {
        dispatch({
          type: "SET_NOTIFICATIONS",
          payload: {
            items: response.data.items,
            unreadCount: response.data.unreadCount,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    // Only connect if authenticated
    if (!isAuthenticated) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const token = getCookie("access_token");
    if (!token) return;

    // Fetch initial notifications immediately upon auth success
    fetchInitialNotifications();

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3030";

    const socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("WebSocket client connected to server:", socket.id);
    });

    socket.on("new_notification", (data) => {
      console.log("WebSocket received new notification:", data);

      // Add to store
      dispatch({ type: "ADD_NOTIFICATION", payload: data });

      // Trigger toast notification
      toast.info(data.content, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClick: () => {
          if (data.link) {
            router.push(data.link);
          }
        },
      });
    });

    // Sync on reconnection
    socket.on("reconnect", () => {
      console.log("WebSocket reconnected, syncing notifications...");
      fetchInitialNotifications();
    });

    socket.on("disconnect", (reason) => {
      console.log("WebSocket client disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    return () => {
      console.log("Cleaning up WebSocket connection...");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated]);

  return socketRef.current;
};
export default useSocket;
