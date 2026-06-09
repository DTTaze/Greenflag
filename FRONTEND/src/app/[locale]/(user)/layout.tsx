"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

import Loader from "@/src/components/ui/Loader";
import { SocketProvider } from "@/src/providers/socket.context";
import UserHeader from "@/src/components/layout/Header";
import { useAuthStore } from "@/src/store/auth/authStore";
import { getUser } from "@/src/utils/api";

const socket = io({
  path: "/socket.io",
  withCredentials: true,
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dispatch } = useAuthStore();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await getUser();
        if (res && res.status === 200) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: res.data,
          });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch {
        dispatch({ type: "LOGOUT" });
      } finally {
        setAppLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  const SocketProviderCast = SocketProvider as React.ComponentType<{
    value: unknown;
    children?: React.ReactNode;
  }>;

  return (
    <SocketProviderCast value={socket}>
      <div>
        {appLoading ? (
          <div style={styles.spinnerWrapper}>
            <Loader />
          </div>
        ) : (
          <>
            <UserHeader />
            {children}
          </>
        )}
      </div>
    </SocketProviderCast>
  );
}

const styles = {
  spinnerWrapper: {
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};
