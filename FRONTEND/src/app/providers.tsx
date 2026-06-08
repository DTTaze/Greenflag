"use client";

import React from "react";

import { NotificationProvider } from "@/src/components/ui/NotificationProvider";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { AuthProvider } from "@/src/contexts/auth.context.jsx";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
