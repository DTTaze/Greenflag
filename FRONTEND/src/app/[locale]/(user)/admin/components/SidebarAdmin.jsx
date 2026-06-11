"use client";

import {
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
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function TemporaryDrawer({ userInfo }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleDrawer = (newOpen) => () => setOpen(newOpen);

  const menuSections = [
    {
      label: "Quản lý chính",
      items: [
        {
          text: "Trang chủ",
          icon: <LayoutDashboard size={20} />,
          path: "/admin",
        },
        {
          text: "Quản lý người dùng",
          icon: <Users size={20} />,
          path: "/admin/users",
        },
        {
          text: "Quản lý quyền truy cập",
          icon: <ShieldCheck size={20} />,
          path: "/admin/roles-permissions",
        },
      ],
    },
    {
      label: "Quản lý nội dung",
      items: [
        {
          text: "Nhiệm vụ",
          icon: <ClipboardList size={20} />,
          path: "/admin/content/missions",
        },
        {
          text: "Sản phẩm từ đối tác",
          icon: <Gift size={20} />,
          path: "/admin/content/items",
        },
        {
          text: "Sản phẩm trao đổi P2P",
          icon: <ShoppingCart size={20} />,
          path: "/admin/content/products",
        },
        {
          text: "Sự kiện",
          icon: <Calendar size={20} />,
          path: "/admin/content/events",
        },
        {
          text: "Kiểm duyệt diễn đàn",
          icon: <MessageSquare size={20} />,
          path: "/admin/content/forum",
        },
      ],
    },
    {
      label: "Quản lý giao dịch",
      items: [
        {
          text: "Giao dịch",
          icon: <Coins size={20} />,
          path: "/admin/transactions",
        },
        {
          text: "Vận chuyển",
          icon: <Truck size={20} />,
          path: "/admin/orders",
        },
      ],
    },
    {
      label: "Khác",
      items: [
        {
          text: "Hàng đợi",
          icon: <ListPlus size={20} />,
          path: "/admin/queues",
        },
      ],
    },
  ];

  const handleNavigation = (item) => {
    router.push(item.path);
    setOpen(false);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleDrawer(true)}
        className="flex items-center justify-center rounded-md p-2 text-emerald-600 transition-colors duration-200 hover:bg-gray-100 focus:outline-none"
        aria-label="Open navigation menu"
      >
        <Menu size={24} />
      </button>

      {/* Drawer Overlay (Backdrop) */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleDrawer(false)}
        />
      )}

      {/* Drawer Content */}
      <div
        className={`fixed top-0 left-0 z-50 flex h-full w-[280px] transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-emerald-50/30 p-4">
          <span className="text-lg font-semibold text-emerald-700">
            Green Flag Admin
          </span>
          <button
            onClick={toggleDrawer(false)}
            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Info Section */}
        {userInfo && (
          <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 p-4">
            {userInfo.avatar_url ? (
              <img
                className="h-10 w-10 rounded-full border border-emerald-100 object-cover"
                src={userInfo.avatar_url}
                alt={userInfo.username || "Admin avatar"}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-base font-bold text-white">
                {userInfo.username
                  ? userInfo.username.charAt(0).toUpperCase()
                  : "A"}
              </div>
            )}
            <div className="overflow-hidden">
              <div className="truncate text-sm font-semibold text-gray-800">
                {userInfo.full_name || userInfo.username}
              </div>
              <div className="truncate text-xs text-gray-500">
                {userInfo.email}
              </div>
            </div>
          </div>
        )}

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto py-2">
          {menuSections.map((section) => (
            <div key={section.label} className="mb-4">
              <div className="px-6 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                {section.label}
              </div>
              <ul className="space-y-0.5 px-3">
                {section.items.map((item) => {
                  const selected = pathname === item.path;
                  return (
                    <li key={item.text}>
                      <button
                        onClick={() => handleNavigation(item)}
                        className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 ${
                          selected
                            ? "bg-emerald-50 font-semibold text-emerald-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span
                          className={`${
                            selected ? "text-emerald-600" : "text-gray-400"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.text}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 bg-gray-50/40 p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-950">
            <Settings size={18} className="text-gray-400" />
            <span>Cài đặt</span>
          </button>
          <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50">
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </>
  );
}
