"use client";

import React from "react";

import ProtectedRoute from "@/src/components/common/ProtectedRoute.jsx";
import { useAuthStore } from "@/src/store/auth/authStore";

import ProfileCard from "./components/ProfileCard.jsx";
import ProfileCardSkeleton from "./components/ProfileCardSkeleton.jsx";

/**
 * UserLayout — improved responsive layout, dark mode, subtle animations
 * - Responsive grid: sidebar (lg:col-span-4) + main (lg:col-span-8)
 * - Dark/light friendly backgrounds
 * - Sticky sidebar for better UX on long pages
 * - Smooth transitions for entrance + color changes
 */
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const isLoading = !(isAuthenticated && user);

  return (
    <ProtectedRoute requiredRole={undefined}>
      <div className="min-h-screen w-screen transition-colors">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <div className="sticky top-6">
                <div
                  className={`rounded-lg transition-transform duration-300 ${
                    isLoading
                      ? "-translate-y-1 opacity-90"
                      : "translate-y-0 opacity-100"
                  }`}
                >
                  {isLoading ? <ProfileCardSkeleton /> : <ProfileCard />}
                </div>
              </div>
            </aside>

            <main className="lg:col-span-8">
                <div className="transition-opacity duration-300">
                  {children}
                </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
