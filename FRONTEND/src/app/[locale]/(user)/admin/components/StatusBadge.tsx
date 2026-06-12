"use client";

import { useTranslations } from "next-intl";
import React from "react";

export type StatusType =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "PROCESSING"
  | "SHIPPED"
  | "CANCELLED"
  | "SUSPENDED"
  | "DELETED";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusConfig: Record<
  StatusType,
  {
    light: string;
    dark: string;
  }
> = {
  ACTIVE: {
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dark: "dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  COMPLETED: {
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dark: "dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  APPROVED: {
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dark: "dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  PENDING: {
    light: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  PROCESSING: {
    light: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  INACTIVE: {
    light: "bg-slate-50 text-slate-700 border-slate-200",
    dark: "dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
  },
  REJECTED: {
    light: "bg-rose-50 text-rose-700 border-rose-200",
    dark: "dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  },
  CANCELLED: {
    light: "bg-rose-50 text-rose-700 border-rose-200",
    dark: "dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  },
  SUSPENDED: {
    light: "bg-rose-50 text-rose-700 border-rose-200",
    dark: "dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  },
  DELETED: {
    light: "bg-rose-50 text-rose-700 border-rose-200",
    dark: "dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  },
  SHIPPED: {
    light: "bg-sky-50 text-sky-700 border-sky-200",
    dark: "dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
  },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const t = useTranslations("status");
  const normalizedStatus = status.toUpperCase() as StatusType;
  const config = statusConfig[normalizedStatus] || statusConfig.INACTIVE;

  const combinedClasses = `${config.light} ${config.dark}`;

  let label = status;
  try {
    const key = status.toLowerCase();
    if (t.has(key)) {
      label = t(key);
    }
  } catch (e) {
    // fallback
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${combinedClasses} ${className}`}
    >
      {label}
    </span>
  );
}
