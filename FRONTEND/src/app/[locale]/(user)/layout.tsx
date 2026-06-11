"use client";

import React, { useEffect, useState } from "react";

import UserHeader from "@/src/components/layout/Header";
import Loader from "@/src/components/ui/Loader";
import { useSocket } from "@/src/hooks/useSocket";
import { useAuthStore } from "@/src/store/auth/authStore";
import { getUser } from "@/src/utils/api";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dispatch } = useAuthStore();
  const [appLoading, setAppLoading] = useState(true);

  // Initialize WebSockets realtime connection for authenticated users
  useSocket();

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_34%),linear-gradient(180deg,#f0fdf4_0%,#f8fafc_42%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.1),_transparent_40%),linear-gradient(180deg,#020617_0%,#0f172a_42%,#020617_100%)]">
      {appLoading ? (
        <div style={styles.spinnerWrapper}>
          <Loader />
        </div>
      ) : (
        <>
          {/* Decorative background blur glow elements */}
          <div className="pointer-events-none absolute -top-28 right-8 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/10" />
          <div className="pointer-events-none absolute top-72 -left-32 h-80 w-80 rounded-full bg-lime-200/40 blur-3xl dark:bg-lime-500/10" />
          <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-500/10" />

          <UserHeader />
          <div className="relative z-10">{children}</div>
        </>
      )}
    </div>
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

