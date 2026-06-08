"use client";

import React from "react";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full space-y-4">
      <h1 className="text-2xl font-bold text-gray-950 p-2">
        Content Management
      </h1>
      {children}
    </div>
  );
}
