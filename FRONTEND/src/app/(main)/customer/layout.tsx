"use client";

import "@/src/styles/pages/customer.css";

import { Box } from "@mui/material";
import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";

import ProtectedRoute from "@/src/components/common/ProtectedRoute";
import { AuthContext } from "@/src/contexts/auth.context";

import CustomerAppBar from "./components/layout/CustomerAppBar";
import CustomerDrawer from "./components/layout/CustomerDrawer";

const drawerWidth = 240;

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = useContext(AuthContext);
  const userInfo = auth.user;
  const [open, setOpen] = useState(false);

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
