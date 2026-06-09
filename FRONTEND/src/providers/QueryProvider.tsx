"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { queryClient } from "@/src/lib/react-query/queryClient";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
