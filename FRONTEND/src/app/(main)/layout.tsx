"use client";

import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/src/contexts/auth.context";
import UserHeader from "@/src/layouts/Header";
import { getUserApi } from "@/src/utils/api";
import Loader from "@/src/components/ui/Loader";
import { io } from "socket.io-client";
import { SocketProvider } from "@/src/contexts/socket.context";
import { Outlet } from "react-router-dom";
import { VITE_BACKEND_URL } from "@/src/config/env.js";

const socket = io(VITE_BACKEND_URL, {
  withCredentials: true,
});

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { setAuth } = useContext(AuthContext);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await getUserApi();
        if (res && res.status === 200) {
          setAuth({
            isAuthenticated: true,
            user: res.data,
          });
        } else {
          setAuth({ isAuthenticated: false, user: null });
        }
      } catch (err) {
        setAuth({ isAuthenticated: false, user: null });
      } finally {
        setAppLoading(false);
      }
    };

    initializeAuth();
  }, [setAuth]);

  const SocketProviderCast = SocketProvider as any;

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
            <Outlet>{children}</Outlet>
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
