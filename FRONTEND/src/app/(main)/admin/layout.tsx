"use client";

import "@/src/styles/pages/admin.css";

import React, { useContext } from "react";

import ProtectedRoute from "@/src/components/common/ProtectedRoute";
import { AuthContext } from "@/src/contexts/auth.context";

import TemporaryDrawer from "./components/SidebarAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = useContext(AuthContext);

  const userInfo = auth.user
    ? {
        id: auth.user.id,
        full_name: auth.user.full_name || "User",
        avatar_url: auth.user.avatar_url,
        username: auth.user.username || "Guest",
        role_id: auth.user.role_id || 0,
        email: auth.user.email,
        phone_number: auth.user.phone_number,
        last_logined: auth.user.last_logined,
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
