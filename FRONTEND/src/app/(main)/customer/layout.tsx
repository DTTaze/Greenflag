"use client";

import "@/src/styles/pages/customer.css";
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
      <div className="flex min-h-screen relative bg-gray-50">
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
        <main className="flex-1 w-full p-4 sm:p-6 mt-16 relative z-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
