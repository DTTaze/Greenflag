"use client";

import React from "react";

import { NotificationProvider } from "@/src/components/ui/NotificationProvider";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import QueryProvider from "@/src/providers/QueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NotificationProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </NotificationProvider>
    </QueryProvider>
  );
}
