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
  const [status, setStatus] = useState<string>(user.status || "active");
  const [coinAction, setCoinAction] = useState<"add" | "subtract">("add");
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [coinReason, setCoinReason] = useState<string>("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (coinAmount > 0) {
      if (!coinReason.trim()) {
        alert("Vui lòng nhập lý do điều chỉnh xu");
        return;
      }
      if (coinAction === "subtract" && coinAmount > (user.coin?.amount || 0)) {
        alert("Số lượng xu bị trừ vượt quá số xu hiện tại của người dùng");
        return;
      }
    }

    onSave({
      email,
      username,
      fullName,
      phoneNumber,
      role,
      status,
      coinAdjustment: coinAmount > 0 ? (coinAction === "add" ? coinAmount : -coinAmount) : undefined,
      coinAdjustmentReason: coinAmount > 0 ? coinReason : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        <div className="relative z-50 w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-600/20 bg-white shadow-xl dark:border-zinc-800 dark:bg-slate-900">
          <div className="border-b border-emerald-600/20 px-6 py-5 md:px-8 dark:border-zinc-800/80">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              {t("editProfile")}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
              {t("editSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 md:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
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
                {t("phoneNumber")}
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-emerald-600/20 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-500"
                  placeholder="+84 912 345 678"
                  type="tel"
                />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
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

              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                {t("status") || "Trạng thái"}
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-emerald-600/20 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-500"
                >
                  <option value="active">{t("statusActive") || "Đã kích hoạt"}</option>
                  <option value="inactive">{t("statusInactive") || "Ngưng hoạt động"}</option>
                  <option value="suspended">{t("statusSuspended") || "Bị khóa"}</option>
                </select>
              </label>
            </div>

            {/* Coin Adjustment Section */}
            <div className="border-t border-emerald-600/10 pt-6 mt-6 dark:border-zinc-800">
              <h4 className="text-sm font-semibold text-gray-950 dark:text-slate-200 mb-4">
                Điều chỉnh EcoCoins
              </h4>
              <div className="grid gap-6 sm:grid-cols-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Hành động
                  <select
                    value={coinAction}
                    onChange={(e) => setCoinAction(e.target.value as "add" | "subtract")}
                    className="mt-2 w-full rounded-xl border border-emerald-600/20 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-500"
                  >
                    <option value="add">Cộng xu (+)</option>
                    <option value="subtract">Trừ xu (-)</option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Số lượng (Hiện tại: {user.coin?.amount || 0})
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={coinAmount === 0 ? "" : coinAmount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setCoinAmount(Math.max(0, Math.min(10000, val)));
                    }}
                    className="mt-2 w-full rounded-xl border border-emerald-600/20 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-500"
                    placeholder="0"
                  />
                  {coinAmount > 0 && (
                    <span className="text-[10px] text-gray-500 dark:text-slate-400 block mt-1">
                      Giới hạn điều chỉnh từ -10,000 đến +10,000 xu.
                    </span>
                  )}
                </label>

                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Lý do điều chỉnh {coinAmount > 0 && <span className="text-red-500">*</span>}
                  <input
                    type="text"
                    value={coinReason}
                    onChange={(e) => setCoinReason(e.target.value)}
                    required={coinAmount > 0}
                    className="mt-2 w-full rounded-xl border border-emerald-600/20 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-500"
                    placeholder="Nhập lý do điều chỉnh..."
                  />
                </label>
              </div>
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
                {isSaving ? tCommon("save") : tCommon("save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
