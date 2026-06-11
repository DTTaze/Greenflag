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
      {
        textKey: "rolesPermissions",
        icon: <ShieldCheck size={20} />,
        path: "/admin/roles-permissions",
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
        textKey: "queues",
        icon: <ListPlus size={20} />,
        path: "/admin/queues",
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

      {/* Drawer Content */}
      <div
        className={`fixed top-0 left-0 z-50 flex h-full w-[280px] transform flex-col border-r border-emerald-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-emerald-500/15 dark:bg-zinc-900 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50/20 p-4 dark:border-emerald-500/15 dark:bg-zinc-950/10">
          <span className="text-md font-bold text-[var(--primary-green)] dark:text-[var(--secondary-green)]">
            {t("title")}
          </span>
          <div className="flex items-center gap-1.5">
            <ThemeSwitcher />
            <LocaleSwitcher />
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
            >
              <X size={20} />
            </button>
          )}
          </div>

          {/* User Info Section */}
          {userInfo && userInfo.id !== 0 && (
            <div className="flex items-center gap-3 border-b border-emerald-100 bg-gray-50/30 p-4 dark:border-emerald-500/15 dark:bg-zinc-950/20">
              {userInfo.avatar_url ? (
                <img
                  className="h-10 w-10 rounded-full border border-[var(--light-green)] object-cover dark:border-emerald-500/15"
                  src={userInfo.avatar_url}
                  alt="Avatar"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white dark:bg-emerald-500 min-w-[36px]">
                  {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : "A"}
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
                    const selected = pathname === item.path || (item.path !== "/admin" && pathname.startsWith(item.path));
                    return (
                      <li key={item.textKey}>
                        <button
                          onClick={() => handleNavigation(item.path)}
                          className={`flex w-full items-center gap-3.5 py-2.5 transition-all duration-200 ${isCollapsed ? "justify-center px-0" : "px-4"
                            } ${selected
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 font-semibold"
                              : "text-gray-650 hover:bg-gray-50 hover:text-gray-950 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-100"
                            }`}
                          title={isCollapsed ? t(item.textKey) : undefined}
                        >
                          <span
                            className={`transition-colors ${selected
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
        </div>

        {/* Footer Actions */}
        <div className="border-t border-emerald-100 bg-gray-50/30 p-3 dark:border-emerald-500/15 dark:bg-zinc-950/20">
          <Link
            href="/user"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <Settings size={18} className="text-gray-400 dark:text-zinc-500" />
            <span>{t("settings")}</span>
          </Link>
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-2xl py-3 text-sm font-semibold text-red-600 transition-colors duration-150 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/10 ${isCollapsed ? "justify-center px-0" : "px-4"
              }`}
            title={isCollapsed ? t("logout") : undefined}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>{t("logout")}</span>}
          </button>

          {/* Toggle button for Desktop */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex items-center justify-center p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-900/50 text-gray-500 dark:text-zinc-400 mt-3 mx-auto w-full border border-gray-100 dark:border-zinc-800"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
