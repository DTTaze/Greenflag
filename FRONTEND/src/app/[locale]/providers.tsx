"use client";

import React from "react";

import { NotificationProvider } from "@/src/components/ui/NotificationProvider";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import QueryProvider from "@/src/providers/QueryProvider";
import { ThemeProvider } from "@/src/providers/ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NotificationProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </NotificationProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
