"use client";

import React from "react";
import { AuthProvider } from "@/src/contexts/auth.context.jsx";
import { NotificationProvider } from "@/src/components/ui/NotificationProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AuthProvider>
  );
}
