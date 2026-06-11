"use client";

import {
  Bell,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Coins,
  Gift,
  LayoutDashboard,
  ListPlus,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import LocaleSwitcher from "@/src/components/layout/LocaleSwitcher";
import ThemeSwitcher from "@/src/components/layout/ThemeSwitcher";
import { useNotification } from "@/src/components/ui/NotificationProvider";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";
import { useAuthStore } from "@/src/store/auth/authStore";
import { logoutUser } from "@/src/utils/api";

const menuSections = [
  {
    labelKey: "mainManage",
    items: [
      {
        textKey: "home",
        icon: <LayoutDashboard size={20} />,
        path: "/admin",
      },
      {
        textKey: "partnerSpace",
        icon: <Briefcase size={20} />,
        path: "/partner",
      },
      {
        textKey: "users",
        icon: <Users size={20} />,
        path: "/admin/users",
      },
    ],
  },
  {
    labelKey: "contentManage",
    items: [
      {
        textKey: "missions",
        icon: <ClipboardList size={20} />,
        path: "/admin/content/missions",
      },
      {
        textKey: "partnerProducts",
        icon: <Gift size={20} />,
        path: "/admin/content/items",
      },
      {
        textKey: "p2pProducts",
        icon: <ShoppingCart size={20} />,
        path: "/admin/content/products",
      },
      {
        textKey: "categories",
        icon: <ListPlus size={20} />,
        path: "/admin/content/categories",
      },
      {
        textKey: "events",
        icon: <Calendar size={20} />,
        path: "/admin/content/events",
      },
      {
        textKey: "forum",
        icon: <MessageSquare size={20} />,
        path: "/admin/content/forum",
      },
    ],
  },
  {
    labelKey: "transactionManage",
    items: [
      {
        textKey: "transactions",
        icon: <Coins size={20} />,
        path: "/admin/transactions",
      },
      {
        textKey: "shipping",
        icon: <Truck size={20} />,
        path: "/admin/orders",
      },
    ],
  },
  {
    labelKey: "other",
    items: [
      {
        textKey: "settings",
        icon: <Settings size={20} />,
        path: "/admin/settings",
      },
      {
        textKey: "notifications",
        icon: <Bell size={20} />,
        path: "/admin/notifications",
      },
    ],
  },
];

export default function SidebarAdmin({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  userInfo,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("admin.sidebar");
  const tMenu = useTranslations("menu");
  const { dispatch } = useAuthStore();
  const { notify } = useNotification();

  const handleNavigation = (path) => {
    router.push(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch({ type: "LOGOUT" });
      if (notify) {
        notify("success", tMenu("logoutSuccess"));
      }
      router.push("/login");
      onClose();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      if (notify) {
        notify("error", tMenu("logoutError"));
      }
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 md:sticky md:top-0 md:translate-x-0 dark:border-zinc-800 dark:bg-zinc-950 ${
          isCollapsed ? "w-16" : "w-72"
        } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header/Logo */}
        <div
          className={`flex h-16 items-center border-b border-gray-200 px-4 dark:border-zinc-800 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center space-x-2.5 overflow-hidden"
          >
            <img
              src="/images/Logo-Greenflag.png"
              className="h-8 w-8 min-w-[32px] object-contain"
              alt="Green Flag Logo"
            />
            {!isCollapsed && (
              <span className="text-md font-extrabold whitespace-nowrap text-[#0B6E4F] dark:text-emerald-500">
                {t("title") || "Admin Hub"}
              </span>
            )}
          </Link>
          {!isCollapsed && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* User Info Section */}
        {userInfo && userInfo.id !== 0 && (
          <div
            className={`flex items-center gap-3 border-b border-gray-200 px-4 py-4 dark:border-zinc-800 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            {userInfo.avatar_url ? (
              <img
                className="h-9 w-9 min-w-[36px] rounded-full border border-emerald-500 object-cover"
                src={userInfo.avatar_url}
                alt="Avatar"
              />
            ) : (
              <div className="flex h-9 w-9 min-w-[36px] items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white dark:bg-emerald-500">
                {userInfo.username
                  ? userInfo.username.charAt(0).toUpperCase()
                  : "A"}
              </div>
            )}
            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="truncate text-sm font-semibold text-gray-800 dark:text-zinc-200">
                  {userInfo.full_name || userInfo.username}
                </div>
                <div className="truncate text-xs font-medium text-gray-500 dark:text-zinc-400">
                  {userInfo.email}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex-1 space-y-4 overflow-y-auto py-4">
          {menuSections.map((section) => (
            <div key={section.labelKey} className="space-y-1">
              {!isCollapsed && (
                <div className="px-4 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-zinc-500">
                  {t(section.labelKey)}
                </div>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const selected =
                    pathname === item.path ||
                    (item.path !== "/admin" && pathname.startsWith(item.path));
                  return (
                    <li key={item.textKey}>
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className={`flex w-full items-center gap-3.5 py-2.5 transition-all duration-200 ${
                          isCollapsed ? "justify-center px-0" : "px-4"
                        } ${
                          selected
                            ? "bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : "text-gray-650 hover:bg-gray-50 hover:text-gray-950 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-100"
                        }`}
                        title={isCollapsed ? t(item.textKey) : undefined}
                      >
                        <span
                          className={`transition-colors ${
                            selected
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-gray-400 dark:text-zinc-500"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <span className="text-sm">{t(item.textKey)}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-gray-200 p-4 dark:border-zinc-800">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-2xl py-3 text-sm font-semibold text-red-600 transition-colors duration-150 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/10 ${
              isCollapsed ? "justify-center px-0" : "px-4"
            }`}
            title={isCollapsed ? t("logout") : undefined}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>{t("logout")}</span>}
          </button>

          {/* Toggle button for Desktop */}
          <button
            onClick={onToggleCollapse}
            className="mx-auto mt-3 hidden w-full items-center justify-center rounded-2xl border border-gray-100 p-2 text-gray-500 hover:bg-gray-100 md:flex dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900/50"
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
