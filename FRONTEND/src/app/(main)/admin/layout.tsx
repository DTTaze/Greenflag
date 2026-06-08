"use client";

import React, { useEffect, useState } from "react";
import "@/src/styles/pages/admin.css";
import TemporaryDrawer from "./components/SidebarAdmin";
import { Outlet } from "react-router-dom";
import { getUserApi } from "@/src/utils/api";
import ProtectedRoute from "@/src/components/common/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await getUserApi();
        if (userResponse?.data) {
          const dataOfUser = {
            id: userResponse.data.id,
            full_name: userResponse.data.full_name || "User",
            avatar_url: userResponse.data.avatar_url,
            username: userResponse.data.username || "Guest",
            role_id: userResponse.data.role_id || 0,
            email: userResponse.data.email,
            phone_number: userResponse.data.phone_number,
            last_logined: userResponse.data.last_logined,
          };
          setUserInfo(dataOfUser);
        } else {
          setUserInfo({
            id: 0,
            name: "Guest User",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <ProtectedRoute requiredRole="Admin">
      <div className="admin-page admin-pages-container">
        {/* Header AppBar */}
        <div className="flex justify-start items-center p-1.5">
          <div className="rounded-full bg-gray-100 w-10 h-10 flex justify-center items-center">
            <TemporaryDrawer userInfo={userInfo} />
          </div>
        </div>

        {/* Main content */}
        <div className="admin-content-container">
          <Outlet context={userInfo}>{children}</Outlet>
        </div>
      </div>
    </ProtectedRoute>
  );
}
