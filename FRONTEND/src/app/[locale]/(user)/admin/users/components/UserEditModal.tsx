"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { AdminUpdateUserPayload } from "@/src/types/admin";
import { AdminUserDTO } from "@/src/types/admin";
import { UserRole } from "@/src/types/user/user.type";

interface UserEditModalProps {
  user: AdminUserDTO;
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: AdminUpdateUserPayload) => void;
  isSaving: boolean;
}

const roleOptions: Array<{ value: UserRole; label: string }> = [
  { value: UserRole.ADMIN, label: "Admin" },
  { value: UserRole.PARTNER, label: "Partner" },
  { value: UserRole.USER, label: "User" },
];

export default function UserEditModal({
  user,
  isOpen,
  onClose,
  onSave,
  isSaving,
}: UserEditModalProps) {
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("admin.common");

  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [fullName, setFullName] = useState(user.profile?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(
    user.profile?.phoneNumber || "",
  );
  const [role, setRole] = useState<UserRole>(user.role as UserRole);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({
      email,
      username,
      fullName,
      phoneNumber,
      role,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        <div className="relative z-50 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-900">
          <div className="border-b border-gray-200 px-6 py-5 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              {t("editProfile")}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
              {t("editSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                {tCommon("email")}
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="user@example.com"
                  type="email"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                {tCommon("username")}
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="username"
                  required
                />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                {t("fullName")}
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="Full name"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                {t("phoneNumber")}
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="+84 912 345 678"
                  type="tel"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {t("roleLabel")}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {tCommon("cancel")}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? tCommon("save") : tCommon("save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
