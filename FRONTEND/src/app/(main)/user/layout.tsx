"use client";

import React from "react";

import ProtectedRoute from "@/src/components/common/ProtectedRoute.jsx";
import { useAuthStore } from "@/src/store/auth/authStore";

import ProfileCard from "./components/ProfileCard.jsx";
import ProfileCardSkeleton from "./components/ProfileCardSkeleton.jsx";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const isLoading = !(isAuthenticated && user);

  return (
    <ProtectedRoute requiredRole={undefined}>
      <div className="min-h-screen w-screen bg-[#f7f8fa]">
        <div className="m-auto flex w-[80vw] gap-3">
          <div className="mt-4 w-[30%]">
            {isLoading ? <ProfileCardSkeleton /> : <ProfileCard />}
          </div>
          <div className="mt-4 w-[70%]">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
