"use client";

import "./styles/index.css";

import React, { useState } from "react";

import ProtectedRoute from "@/src/components/common/ProtectedRoute";
import { useAuthStore } from "@/src/store/auth/authStore";

import CustomerAppBar from "./components/layout/CustomerAppBar";
import CustomerDrawer from "./components/layout/CustomerDrawer";

const drawerWidth = 240;

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const userInfo = user;
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <ProtectedRoute requiredRole={["Customer", "Admin"]}>
      <div className="relative flex min-h-screen bg-gray-50">
        <CustomerAppBar
          open={open}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
          userInfo={userInfo}
        />
        <CustomerDrawer
          drawerWidth={drawerWidth}
          open={open}
          handleDrawerToggle={handleDrawerToggle}
          userInfo={userInfo}
        />
        <main className="relative z-10 mt-16 w-full flex-1 overflow-x-hidden p-4 sm:p-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
