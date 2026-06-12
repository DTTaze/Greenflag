"use client";

import { AlertTriangle, Lock, RotateCcw, Trash2, Unlock, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { AdminUserDTO } from "@/src/types/admin";

interface UserActionModalProps {
  user: AdminUserDTO;
  actionType: "lock" | "unlock" | "delete" | "restore" | "hard-delete";
  onConfirm: (
    actionType: "lock" | "unlock" | "delete" | "restore" | "hard-delete",
    reason?: string,
  ) => void;
  onCancel: () => void;
}

export default function UserActionModal({
  user,
  actionType,
  onConfirm,
  onCancel,
}: UserActionModalProps) {
  const t = useTranslations("admin.users");
  const [reason, setReason] = useState("");

  const actionConfig = {
    lock: {
      icon: Lock,
      title: t("lock"),
      confirmText: t("confirmLock"),
      description: t("confirmLock"),
      buttonText: t("lock"),
      buttonClass:
        "bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600",
    },
    unlock: {
      icon: Unlock,
      title: t("unlock"),
      confirmText: t("confirmUnlock"),
      description: t("confirmUnlock"),
      buttonText: t("unlock"),
      buttonClass:
        "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
    },
    delete: {
      icon: Trash2,
      title: t("delete"),
      confirmText: t("confirmDelete"),
      description: t("confirmDelete"),
      buttonText: t("delete"),
      buttonClass:
        "bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600",
    },
    restore: {
      icon: RotateCcw,
      title: t("restore") || "Restore",
      confirmText: t("confirmRestore") || "Are you sure you want to restore this user account?",
      description: t("confirmRestore") || "Are you sure you want to restore this user account?",
      buttonText: t("restore") || "Restore",
      buttonClass:
        "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
    },
    "hard-delete": {
      icon: Trash2,
      title: t("hardDelete") || "Hard Delete",
      confirmText: t("confirmHardDelete") || "Are you sure you want to permanently delete this user? This action is irreversible.",
      description: t("confirmHardDelete") || "Are you sure you want to permanently delete this user? This action is irreversible.",
      buttonText: t("hardDelete") || "Hard Delete",
      buttonClass:
        "bg-red-700 hover:bg-red-800 dark:bg-red-650 dark:hover:bg-red-700",
    },
  };

  const config = actionConfig[actionType];
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(actionType, reason);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onCancel}
        />

        {/* Modal */}
        <div className="relative z-50 w-full max-w-md rounded-xl border border-emerald-600/20 bg-white shadow-xl dark:border-zinc-800 dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-600/20 px-6 py-4 dark:border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                  {config.title} Account
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  User: {user.username}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {config.confirmText}
            </p>

            {/* User Info */}
            <div className="rounded-lg border border-emerald-600/20 bg-gray-50 p-4 dark:border-zinc-800/80 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    {user.profile?.fullName || user.username}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Reason Input (for lock/unlock) */}
            {actionType === "lock" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  {t("lockReason")} (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for locking account..."
                  className="w-full rounded-lg border border-emerald-600/20 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600/20 dark:border-zinc-800 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-emerald-500"
                  rows={3}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-emerald-600/20 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-zinc-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${config.buttonClass}`}
              >
                <Icon size={16} />
                {config.buttonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
