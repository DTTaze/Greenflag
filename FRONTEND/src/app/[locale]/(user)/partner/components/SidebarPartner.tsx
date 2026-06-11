"use client";

import {
  BarChart2,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  ScanQrCode,
  User,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import LocaleSwitcher from "@/src/components/layout/LocaleSwitcher";
import ThemeSwitcher from "@/src/components/layout/ThemeSwitcher";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";
import { useAuthStore } from "@/src/store/auth/authStore";
import { logoutUser } from "@/src/utils/api";

type SidebarPartnerProps = {
  isOpen: boolean;
  onClose: () => void;
  userInfo: {
    username: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
};

export default function SidebarPartner({
  isOpen,
  onClose,
  userInfo,
}: SidebarPartnerProps) {
  const t = useTranslations("partner");
  const pathname = usePathname();
  const router = useRouter();
  const { dispatch } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch({ type: "LOGOUT" });
      router.push("/login");
      onClose();
    } catch (error) {
      console.error("Lỗi khi đăng xuất đối tác:", error);
    }
  };

  const menuItems = [
    {
      label: t("dashboard.title") || "Tổng quan",
      path: "/partner",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: t("events.openScanner") || "Quét QR",
      path: "/partner/scanner",
      icon: <ScanQrCode size={20} />,
    },
    {
      label: t("events.badge") || "Sự kiện",
      path: "/partner/events",
      icon: <Calendar size={20} />,
    },
    {
      label: t("inventory.title") || "Kho hàng",
      path: "/partner/inventory",
      icon: <Package size={20} />,
    },
    {
      label: t("reports.title") || "Báo cáo",
      path: "/partner/reports",
      icon: <BarChart2 size={20} />,
    },
    {
      label: t("profile.title") || "Hồ sơ đối tác",
      path: "/partner/profile",
      icon: <User size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 dark:border-zinc-800 dark:bg-zinc-950 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header/Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-zinc-800">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center space-x-2.5"
          >
            <img
              src="/images/Logo-Greenflag.png"
              className="h-8 w-8 object-contain"
              alt="Green Flag Logo"
            />
            <span className="text-lg font-extrabold text-[#0B6E4F] dark:text-emerald-500">
              Partner Hub
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* User profile info info */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4 dark:border-zinc-800">
          {userInfo.avatar_url ? (
            <img
              className="h-10 w-10 rounded-full border border-emerald-500 object-cover"
              src={userInfo.avatar_url}
              alt="Avatar"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-base font-bold text-white dark:bg-emerald-500">
              {userInfo.username
                ? userInfo.username.charAt(0).toUpperCase()
                : "P"}
            </div>
          )}
          <div className="overflow-hidden">
            <div className="truncate text-sm font-semibold text-gray-800 dark:text-zinc-200">
              {userInfo.full_name || userInfo.username}
            </div>
            <div className="truncate text-xs font-medium text-gray-500 dark:text-zinc-400">
              {userInfo.email}
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
          {menuItems.map((item) => {
            const isActive =
              item.path === "/partner"
                ? pathname === "/partner"
                : pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-950 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-100"
                }`}
              >
                <span
                  className={`transition-colors ${
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-400 dark:text-zinc-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-gray-200 p-4 dark:border-zinc-800">
          <div className="flex items-center justify-between px-2 pb-4">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 transition-colors duration-150 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/10"
          >
            <LogOut size={20} />
            <span>{t("logout") || "Đăng xuất"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
