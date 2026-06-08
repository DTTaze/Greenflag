"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ClipboardList,
  Gift,
  ShoppingCart,
  Calendar,
  Coins,
  Truck,
  ListPlus,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

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
        className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 text-emerald-600 focus:outline-none transition-colors duration-200"
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
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-emerald-50/30">
          <span className="font-semibold text-lg text-emerald-700">
            Green Flag Admin
          </span>
          <button
            onClick={toggleDrawer(false)}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Info Section */}
        {userInfo && (
          <div className="p-4 flex items-center gap-3 border-b border-gray-100 bg-gray-50/50">
            {userInfo.avatar_url ? (
              <img
                className="w-10 h-10 rounded-full border border-emerald-100 object-cover"
                src={userInfo.avatar_url}
                alt={userInfo.username || "Admin avatar"}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : "A"}
              </div>
            )}
            <div className="overflow-hidden">
              <div className="font-semibold text-sm text-gray-800 truncate">
                {userInfo.full_name || userInfo.username}
              </div>
              <div className="text-xs text-gray-500 truncate">
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
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                          selected
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
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
        <div className="border-t border-gray-100 p-3 bg-gray-50/40">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-950 rounded-lg text-sm transition-colors duration-150">
            <Settings size={18} className="text-gray-400" />
            <span>Cài đặt</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-colors duration-150 mt-1">
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </>
  );
}
