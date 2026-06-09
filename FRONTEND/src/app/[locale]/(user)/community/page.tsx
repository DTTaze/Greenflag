"use client";

import React from "react";

import ProtectedRoute from "@/src/components/common/ProtectedRoute.jsx";

import CommunityFeed from "./components/CommunityFeed";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={undefined}>
      <CommunityFeed />
    </ProtectedRoute>
  );
}
