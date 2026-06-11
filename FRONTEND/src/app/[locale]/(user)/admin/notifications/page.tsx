"use client";

import { Bell, FileText, ShieldCheck } from "lucide-react";
import React from "react";

const notifications = [
  {
    id: 1,
    title: "System maintenance scheduled",
    description: "Planned maintenance for service optimization on Sunday.",
    type: "System",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "New partner request",
    description: "A new partner application requires review.",
    type: "Partner",
    time: "Yesterday",
  },
  {
    id: 3,
    title: "Content approval needed",
    description: "Pending content updates are waiting for moderation.",
    type: "Admin",
    time: "2 days ago",
  },
];

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-emerald-200/60 bg-white p-6 shadow-sm dark:border-emerald-500/15 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
            <Bell size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-950 dark:text-slate-100">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Manage alerts for system updates, partner requests and moderation
              tasks.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4">
        {notifications.map((notification) => (
          <article
            key={notification.id}
            className="rounded-3xl border border-emerald-200/60 bg-white p-5 shadow-sm dark:border-emerald-500/15 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  <FileText size={16} />
                  <span>{notification.title}</span>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">
                  {notification.description}
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                {notification.type}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500">
              <ShieldCheck size={14} />
              <span>{notification.time}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
