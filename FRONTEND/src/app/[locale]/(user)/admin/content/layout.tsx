"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("admin.sidebar");
  return (
    <div className="w-full space-y-6">
      <h1 className="p-2 text-2xl font-bold text-gray-950 dark:text-zinc-50">
        {t("contentManage")}
      </h1>
      {children}
    </div>
  );
}
