"use client";

import { Calendar, Coins, Mail, Shield, User, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { AdminUserDTO } from "@/src/types/admin";

import { StatusBadge } from "../../components/StatusBadge";

interface UserDetailDrawerProps {
  user: AdminUserDTO;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailDrawer({
  user,
  isOpen,
  onClose,
}: UserDetailDrawerProps) {
  const t = useTranslations("admin.users");

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="relative w-screen max-w-md">
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl dark:bg-slate-900">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-600/20 bg-white px-4 py-3 dark:border-zinc-800/80 dark:bg-slate-900">
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                {t("details")}
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* User Info Card */}
              <div className="mb-6 rounded-xl border border-emerald-600/20 bg-gray-50 p-4 dark:border-zinc-800/80 dark:bg-slate-800/50">
                <div className="flex items-start gap-4">
                  <img
                     src={user.avatarUrl}
                     alt={user.username}
                     className="h-16 w-16 rounded-full border-2 border-white shadow-sm dark:border-zinc-800"
                   />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        {user.profile?.fullName || user.username}
                      </h3>
                      <StatusBadge status={user.status} />
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                      @{user.username}
                    </p>
                    {user.isLocked && (
                      <div className="mt-2 rounded-md bg-rose-50 px-3 py-1.5 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                        <span className="font-medium">Account Locked</span>
                        {user.lockReason && (
                          <p className="mt-1 text-xs">{user.lockReason}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid gap-4">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-500">
                      Email
                    </p>
                    <a
                      href={`mailto:${user.email}`}
                      className="font-medium text-gray-900 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
                    >
                      {user.email}
                    </a>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-500">
                      Role
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-300">
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* EcoCoins */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <Coins size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-500">
                      EcoCoins
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-300">
                      {user.coin?.amount || 0} points
                    </p>
                  </div>
                </div>

                {/* Last Activity */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-500">
                      Last Activity
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-300">
                      {user.lastActivityDate
                        ? formatDate(user.lastActivityDate)
                        : "No activity recorded"}
                    </p>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-500">
                      Profile Details
                    </p>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-900 dark:text-slate-300">
                        <span className="font-medium">Phone:</span>{" "}
                        {user.profile?.phoneNumber || "Not provided"}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-slate-300">
                        <span className="font-medium">Streak:</span>{" "}
                        {user.profile?.streak || 0} days
                      </p>
                      <p className="text-sm text-gray-900 dark:text-slate-300">
                        <span className="font-medium">Last Task:</span>{" "}
                        {user.profile?.lastCompletedTask
                          ? new Date(
                              user.profile.lastCompletedTask,
                            ).toLocaleDateString()
                          : "None"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
                  {t("recentActivity")}
                </h3>
                <div className="rounded-lg border border-emerald-600/20 p-4 dark:border-zinc-800/80">
                  <p className="text-center text-gray-500 dark:text-slate-500">
                    {t("noActivityFound")}
                  </p>
                  <p className="mt-1 text-center text-xs text-gray-400 dark:text-slate-600">
                    Activity logging would be integrated with backend API
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-emerald-600/20 bg-gray-50 px-4 py-3 dark:border-zinc-800/80 dark:bg-slate-800/50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-emerald-600/20 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-emerald-50/20 dark:border-zinc-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
