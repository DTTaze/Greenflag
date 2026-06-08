"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import CustomerDrawer from "./components/layout/CustomerDrawer";
import CustomerAppBar from "./components/layout/CustomerAppBar";
import "@/src/styles/pages/customer.css";
import { getUserApi } from "@/src/utils/api";
import ProtectedRoute from "@/src/components/common/ProtectedRoute";

const drawerWidth = 240;

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await getUserApi();
        if (userResponse?.data) {
          setUserInfo(userResponse.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <ProtectedRoute requiredRole={["Customer", "Admin"]}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          position: "relative",
        }}
      >
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
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: "100%",
            mt: "64px",
            backgroundColor: "var(--background-light)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Outlet context={userInfo}>{children}</Outlet>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
