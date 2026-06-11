"use client";

import { Menu } from "lucide-react";
import React, { useState } from "react";

import ProtectedRoute from "@/src/components/common/ProtectedRoute";
import { useAuthStore } from "@/src/store/auth/authStore";

import SidebarPartner from "./components/SidebarPartner";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userInfo = user
    ? {
        username: user.username || "Guest",
        email: user.email || "",
        full_name: user.full_name || user.username,
        avatar_url: user.avatar_url,
      }
    : {
        username: "Guest",
        email: "",
      };

  return (
    <ProtectedRoute requiredRole="Partner">
      <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-100">
        {/* Sidebar */}
        <SidebarPartner
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userInfo={userInfo}
        />

        {/* Content Wrapper */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile Header Bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm md:hidden dark:border-zinc-800 dark:bg-zinc-950/80 dark:backdrop-blur-md">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center space-x-2">
              <img
                src="/images/Logo-Greenflag.png"
                className="h-8 w-8 object-contain"
                alt="Green Flag Logo"
              />
              <span className="font-extrabold text-[#0B6E4F] dark:text-emerald-500">
                Partner Hub
              </span>
            </div>
            <div className="w-8" /> {/* Spacer */}
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 dark:bg-zinc-950">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
