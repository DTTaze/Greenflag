"use client";

import {
  Calendar,
  ClipboardList,
  Gift,
  LayoutDashboard,
  Package,
  ScanQrCode,
  ShoppingCart,
  User,
  Users,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const menuItems = [
  {
    text: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/customer",
  },
  {
    text: "Events",
    icon: <Calendar size={20} />,
    path: "/customer/events",
  },
  {
    text: "Items",
    icon: <Package size={20} />,
    path: "/customer/items",
  },
  {
    text: "Rewards",
    icon: <Gift size={20} />,
    path: "/customer/rewards",
  },
  {
    text: "Tasks",
    icon: <ClipboardList size={20} />,
    path: "/customer/tasks",
  },
  {
    text: "Users",
    icon: <Users size={20} />,
    path: "/customer/users",
  },
  {
    text: "QR Scanner",
    icon: <ScanQrCode size={20} />,
    path: "/customer/scanner",
  },
  {
    text: "Profile",
    icon: <User size={20} />,
    path: "/customer/profile",
  },
  {
    text: "Orders",
    icon: <ShoppingCart size={20} />,
    path: "/customer/orders",
  },
];

// Helper to always get a number from coins
function getAmount(val) {
  if (val == null) return 0;
  if (typeof val === "object") return val.amount || 0;
  return val;
}

export default function CustomerDrawer({
  drawerWidth = 240,
  open,
  handleDrawerToggle,
  userInfo,
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Backdrop overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={handleDrawerToggle}
        />
      )}

      {/* Sliding Drawer Container */}
      <div
        id="customer-drawer"
        role="navigation"
        aria-label="Customer sidebar navigation"
        className={`fixed top-0 left-0 z-50 flex h-full transform flex-col border-r border-gray-100 bg-white shadow-xl transition-transform duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-800 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: `${drawerWidth}px` }}
      >
        {/* Header/Brand Section */}
        <div className="flex h-16 shrink-0 items-center justify-between bg-emerald-600 px-4 text-white shadow-sm">
          <span className="text-base font-semibold tracking-wide">
            Customer Portal
          </span>
          <button
            onClick={handleDrawerToggle}
            className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* User profile details header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 bg-emerald-50/20 p-4">
          {userInfo?.avatar_url ? (
            <img
              src={userInfo.avatar_url}
              alt={userInfo.full_name || "Customer avatar"}
              className="h-10 w-10 rounded-full border border-emerald-100 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              {userInfo?.username
                ? userInfo.username.charAt(0).toUpperCase()
                : "C"}
            </div>
          )}
          <div className="overflow-hidden">
            <div className="truncate text-sm font-semibold text-gray-800">
              {userInfo?.full_name || "Customer"}
            </div>
            <div className="mt-1 inline-block rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              {getAmount(userInfo?.coins)} Coins
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <button
                key={item.text}
                onClick={() => {
                  router.push(item.path);
                  handleDrawerToggle();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-150 ${
                  isActive
                    ? "border border-emerald-100 bg-emerald-50 font-bold text-emerald-700 shadow-sm"
                    : "border border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span
                  className={isActive ? "text-emerald-600" : "text-gray-400"}
                >
                  {item.icon}
                </span>
                <span>{item.text}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
