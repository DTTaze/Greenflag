"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Package,
  Users,
  ScanQrCode,
  User,
  ShoppingCart,
  X,
} from "lucide-react";

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
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-100 shadow-xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: `${drawerWidth}px` }}
      >
        {/* Header/Brand Section */}
        <div className="h-16 flex items-center justify-between px-4 bg-emerald-600 text-white shadow-sm shrink-0">
          <span className="font-semibold text-base tracking-wide">
            Customer Portal
          </span>
          <button
            onClick={handleDrawerToggle}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* User profile details header */}
        <div className="p-4 flex items-center gap-3 bg-emerald-50/20 border-b border-gray-100 shrink-0">
          {userInfo?.avatar_url ? (
            <img
              src={userInfo.avatar_url}
              alt={userInfo.full_name || "Customer avatar"}
              className="w-10 h-10 rounded-full border border-emerald-100 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              {userInfo?.username ? userInfo.username.charAt(0).toUpperCase() : "C"}
            </div>
          )}
          <div className="overflow-hidden">
            <div className="font-semibold text-sm text-gray-800 truncate">
              {userInfo?.full_name || "Customer"}
            </div>
            <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 mt-1 inline-block">
              {getAmount(userInfo?.coins)} Coins
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <button
                key={item.text}
                onClick={() => {
                  router.push(item.path);
                  handleDrawerToggle();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                }`}
              >
                <span className={isActive ? "text-emerald-600" : "text-gray-400"}>
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
