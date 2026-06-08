"use client";

import { Box, Typography } from "@mui/material";
import React from "react";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3, p: 2 }}>
        Content Management
      </Typography>
      {children}
    </Box>
  );
}
