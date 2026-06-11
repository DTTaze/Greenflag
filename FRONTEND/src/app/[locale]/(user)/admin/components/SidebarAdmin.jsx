"use client";

import {
  Bell,
  Calendar,
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
import React, { useState } from "react";

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

export default function TemporaryDrawer({ userInfo }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("admin.sidebar");
  const tMenu = useTranslations("menu");
  const { dispatch } = useAuthStore();
  const { notify } = useNotification();

  const toggleDrawer = (newOpen) => () => setOpen(newOpen);

  const handleNavigation = (item) => {
    router.push(item.path);
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch({ type: "LOGOUT" });
      if (notify) {
        notify("success", tMenu("logoutSuccess"));
      }
      router.push("/");
      setOpen(false);
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      if (notify) {
        notify("error", tMenu("logoutError"));
      }
    }
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleDrawer(true)}
        className="flex items-center justify-center rounded-md p-2 text-[var(--primary-green)] transition-colors duration-200 hover:bg-gray-100 focus:outline-none dark:text-[var(--secondary-green)] dark:hover:bg-zinc-800"
        aria-label="Open navigation menu"
      >
        <Menu size={24} />
      </button>

      {/* Drawer Overlay (Backdrop) */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 dark:bg-black/60"
          onClick={toggleDrawer(false)}
        />
      )}

      {/* Drawer Content */}
      <div
        className={`fixed top-0 left-0 z-50 flex h-full w-[280px] transform flex-col border-r border-emerald-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-emerald-500/15 dark:bg-zinc-900 ${
          open ? "translate-x-0" : "-translate-x-full"
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
              onClick={toggleDrawer(false)}
              className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* User Info Section */}
        {userInfo && userInfo.id !== 0 && (
          <div className="flex items-center gap-3 border-b border-emerald-100 bg-gray-50/30 p-4 dark:border-emerald-500/15 dark:bg-zinc-950/20">
            {userInfo.avatar_url ? (
              <img
                className="h-10 w-10 rounded-full border border-[var(--light-green)] object-cover dark:border-emerald-500/15"
                src={userInfo.avatar_url}
                alt={userInfo.username || "Admin avatar"}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-green)] text-base font-bold text-white dark:bg-[var(--secondary-green)]">
                {userInfo.username
                  ? userInfo.username.charAt(0).toUpperCase()
                  : "A"}
              </div>
            )}
            <div className="overflow-hidden">
              <div className="truncate text-sm font-semibold text-gray-800 dark:text-zinc-200">
                {userInfo.full_name || userInfo.username}
              </div>
              <div className="truncate text-xs text-gray-500 dark:text-zinc-400">
                {userInfo.email}
              </div>
            </div>
          </div>
        )}

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto py-2">
          {menuSections.map((section) => (
            <div key={section.labelKey} className="mb-4">
              <div className="px-4 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-zinc-500">
                {t(section.labelKey)}
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const selected = pathname === item.path;
                  return (
                    <li key={item.textKey}>
                      <button
                        onClick={() => handleNavigation(item)}
                        className={`flex w-full items-center gap-3 py-2.5 text-sm transition-all duration-200 ${
                          selected
                            ? "border-l-4 border-[var(--primary-green)] bg-[var(--light-green)] pl-3 font-semibold text-[var(--dark-green)] dark:border-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : "pl-4 text-gray-600 hover:bg-gray-50 hover:text-gray-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        }`}
                      >
                        <span
                          className={`transition-colors ${
                            selected
                              ? "text-[var(--primary-green)] dark:text-emerald-400"
                              : "text-gray-400 dark:text-zinc-500"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{t(item.textKey)}</span>
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
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            <LogOut size={18} />
            <span>{t("logout")}</span>
          </button>
        </div>
      </div>
    </>
  );
}
