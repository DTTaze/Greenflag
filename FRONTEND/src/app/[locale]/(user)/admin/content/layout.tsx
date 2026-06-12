"use client";

import React from "react";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full space-y-6">
      <h1 className="p-2 text-2xl font-bold text-gray-950 dark:text-zinc-50">
        Content Management
      </h1>
      {children}
    </div>
  );
}
