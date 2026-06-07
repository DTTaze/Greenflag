"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3, p: 2 }}>
        Content Management
      </Typography>
      <Outlet>{children}</Outlet>
    </Box>
  );
}
