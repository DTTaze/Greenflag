"use client";

import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "@/src/contexts/auth.context";
import { Outlet } from "react-router-dom";
import ProfileCard from "@/src/components/features/user/ProfileCard.jsx";
import ProfileCardSkeleton from "@/src/components/features/user/ProfileCardSkeleton.jsx";
import ProtectedRoute from "@/src/components/common/ProtectedRoute.jsx";

export default function UserLayout({ children }: { children: React.ReactNode }) {
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
      <div className="w-screen min-h-screen bg-[#f7f8fa]">
        <div className="w-[80vw] m-auto flex gap-3">
          <div className="w-[30%] mt-4">
            {isLoading ? <ProfileCardSkeleton /> : <ProfileCard />}
          </div>
          <div className="w-[70%] mt-4">
            <Outlet>{children}</Outlet>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
