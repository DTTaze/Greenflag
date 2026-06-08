"use client";

import React from "react";
import { AuthProvider } from "@/src/contexts/auth.context.jsx";
import { NotificationProvider } from "@/src/components/ui/NotificationProvider";
import { TooltipProvider } from "@/src/components/ui/tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
