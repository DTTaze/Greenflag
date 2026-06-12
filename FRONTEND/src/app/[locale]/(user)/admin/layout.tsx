"use client";

import "./styles/index.css";

import { Menu } from "lucide-react";
import React, { useState } from "react";

import ProtectedRoute from "@/src/components/common/ProtectedRoute";
import { useAuthStore } from "@/src/store/auth/authStore";

import SidebarAdmin from "./components/SidebarAdmin";
import Button from "@/src/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      <div className="relative flex min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_34%),linear-gradient(180deg,#f0fdf4_0%,#f8fafc_42%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.1),_transparent_40%),linear-gradient(180deg,#020617_0%,#0f172a_42%,#020617_100%)] text-gray-900 transition-colors duration-200 dark:text-zinc-100">
        {/* Decorative background blur glow elements */}
        <div className="pointer-events-none absolute -top-28 right-8 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/10" />
        <div className="pointer-events-none absolute top-72 -left-32 h-80 w-80 rounded-full bg-lime-200/40 blur-3xl dark:bg-lime-500/10" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-500/10" />

        {/* Persistent Collapsible Sidebar for Desktop, Drawer for Mobile */}
        <SidebarAdmin
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          userInfo={userInfo}
        />

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
          {/* Mobile Header Bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm md:hidden dark:border-zinc-800 dark:bg-zinc-950/80 dark:backdrop-blur-md">
            <Button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <Menu size={22} />
            </Button>
            <div className="flex items-center space-x-2">
              <img
                src="/images/Logo-Greenflag.png"
                className="h-8 w-8 object-contain"
                alt="Green Flag Logo"
              />
              <span className="font-extrabold text-[#0B6E4F] dark:text-emerald-500">
                Green Flag Admin
              </span>
            </div>
            <div className="w-8" /> {/* Spacer */}
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-transparent">
            <div className="mx-auto max-w-screen-2xl p-6 md:p-8 space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
