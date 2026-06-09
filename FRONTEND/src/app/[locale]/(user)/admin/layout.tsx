"use client";

import "./styles/index.css";

import React from "react";

import ProtectedRoute from "@/src/components/common/ProtectedRoute";
import { useAuthStore } from "@/src/store/auth/authStore";

import TemporaryDrawer from "./components/SidebarAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();

  const userInfo = user
    ? {
        id: user.id,
        full_name: user.full_name || "User",
        avatar_url: user.avatar_url,
        username: user.username || "Guest",
        role_id: user.role_id || 0,
        email: user.email,
        phone_number: user.phone_number,
        last_logined: user.last_logined,
      }
    : {
        id: 0,
        name: "Guest User",
      };

  return (
    <ProtectedRoute requiredRole="Admin">
      <div className="admin-page admin-pages-container">
        {/* Header AppBar */}
        <div className="flex items-center justify-start p-1.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <TemporaryDrawer userInfo={userInfo} />
          </div>
        </div>

        {/* Main content */}
        <div className="admin-content-container">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
