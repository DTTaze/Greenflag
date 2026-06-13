"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { UserRole } from "@/src/types/user/user.type";

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  isSaving: boolean;
}

const roleOptions: Array<{ value: UserRole; label: string }> = [
  { value: UserRole.ADMIN, label: "Admin" },
  { value: UserRole.PARTNER, label: "Partner" },
  { value: UserRole.USER, label: "User" },
];

export default function UserCreateModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
}: UserCreateModalProps) {
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("admin.common");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({
      email,
      username,
      password,
      fullName,
      phoneNumber: phoneNumber || undefined,
      role,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative z-50 w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-600/20 bg-white shadow-xl dark:border-zinc-800 dark:bg-slate-900">
          <div className="border-b border-emerald-600/20 px-6 py-5 md:px-8 dark:border-zinc-800/80">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              {t("createUser") || "Thêm người dùng mới"}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
              {t("createSubtitle") || "Tạo một tài khoản người dùng mới trong hệ thống."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 md:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                {tCommon("username")} <span className="text-red-500 ml-0.5">*</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-emerald-600/20 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-500"
                  placeholder="username"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                {tCommon("email")} <span className="text-red-500 ml-0.5">*</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-emerald-600/20 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-500"
                  placeholder="user@example.com"
                  type="email"
                  required
                />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                {t("fullName")} <span className="text-red-500 ml-0.5">*</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-emerald-600/20 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-500"
                  placeholder="Full name"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                {t("password") || "Mật khẩu"} <span className="text-red-500 ml-0.5">*</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-emerald-600/20 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-500"
                  placeholder="••••••••"
                  type="password"
                  required
                  minLength={6}
                />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                {t("phoneNumber")}
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-emerald-600/20 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-500"
                  placeholder="+84 912 345 678"
                  type="tel"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                {t("roleLabel")}
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="mt-2 w-full rounded-xl border border-emerald-600/20 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-500"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {role === UserRole.ADMIN && (
                  <p className="mt-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    ⚠️ Warning: This user will have full access to the management dashboard.
                  </p>
                )}
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-emerald-600/20 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50/20 dark:border-zinc-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {tCommon("cancel")}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? tCommon("loading") : tCommon("addNew")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
