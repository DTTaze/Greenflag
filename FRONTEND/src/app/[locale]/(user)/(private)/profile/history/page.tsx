"use client";

import React from "react";

import ProtectedRoute from "@/src/components/common/ProtectedRoute.jsx";

import HistoryDashboard from "./components/HistoryDashboard.jsx";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={undefined}>
      <HistoryDashboard />
    </ProtectedRoute>
  );
}
