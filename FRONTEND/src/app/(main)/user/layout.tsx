"use client";

import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import ProtectedRoute from "@/src/components/common/ProtectedRoute.jsx";
import { AuthContext } from "@/src/contexts/auth.context";

import ProfileCard from "./components/ProfileCard.jsx";
import ProfileCardSkeleton from "./components/ProfileCardSkeleton.jsx";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [auth]);

  return (
    <ProtectedRoute requiredRole={undefined}>
      <div className="min-h-screen w-screen bg-[#f7f8fa]">
        <div className="m-auto flex w-[80vw] gap-3">
          <div className="mt-4 w-[30%]">
            {isLoading ? <ProfileCardSkeleton /> : <ProfileCard />}
          </div>
          <div className="mt-4 w-[70%]">
            <Outlet>{children}</Outlet>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
