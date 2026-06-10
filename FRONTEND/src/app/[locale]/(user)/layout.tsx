"use client";

import React, { useEffect, useState } from "react";

import UserHeader from "@/src/components/layout/Header";
import Loader from "@/src/components/ui/Loader";
import { useAuthStore } from "@/src/store/auth/authStore";
import { getUser } from "@/src/utils/api";

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

  return (
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
