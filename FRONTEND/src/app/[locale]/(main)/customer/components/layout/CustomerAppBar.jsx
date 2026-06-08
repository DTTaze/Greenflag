"use client";

import { Bell, HelpCircle, Home, LogOut, Menu, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import { useAuthStore } from "@/src/store/auth/authStore";
import { logoutUser } from "@/src/utils/api";

export default function CustomerAppBar({
  open: _open,
  drawerWidth: _drawerWidth,
  handleDrawerToggle,
  userInfo,
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { notify } = useNotification();
  const { dispatch } = useAuthStore();

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      // Clear user data from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Call the logout API
      await logoutUser();

      notify("success", "Đăng xuất thành công");
      dispatch({ type: "LOGOUT" });

      // Immediately navigate to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      notify("error", "Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.");
      setLoggingOut(false);
    }
  };

  const getPageTitle = () => {
    const path = pathname;
    if (path === "/customer") return "Dashboard";
    if (path === "/customer/profile") return "Profile";
    if (path === "/customer/orders") return "Orders";
    if (path === "/customer/rewards") return "Rewards";
    if (path === "/customer/events") return "Event Management";
    if (path === "/customer/items") return "Item Management";
    if (path === "/customer/users") return "User Management";
    if (path === "/customer/scanner") return "QR Scanner";
    return "Customer Portal";
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 shadow-sm">
      {/* Left side actions */}
      <div className="flex items-center gap-3">
        {/* Toggle drawer button */}
        <button
          onClick={handleDrawerToggle}
          className="rounded-lg p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50 focus:outline-none"
          aria-label="Toggle drawer"
        >
          <Menu size={22} />
        </button>

        {/* Home button */}
        <button
          onClick={() => router.push("/")}
          className="rounded-lg p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50 focus:outline-none"
          title="Go to Homepage"
        >
          <Home size={20} />
        </button>

        {/* Breadcrumb / Title */}
        <div className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">
          <button
            onClick={() => router.push("/customer")}
            className="font-medium hover:text-emerald-600"
          >
            Home
          </button>
          <span>/</span>
          <span className="font-semibold text-emerald-700">
            {getPageTitle()}
          </span>
        </div>

        <span className="text-sm font-semibold text-emerald-700 sm:hidden">
          {getPageTitle()}
        </span>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
              <div className="border-b border-gray-50 px-4 py-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                Thông báo mới
              </div>
              <div className="max-h-[300px] divide-y divide-gray-50 overflow-y-auto">
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="block w-full px-4 py-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="text-sm font-semibold text-gray-800">
                    New Event Created
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    Tech Conference added to your events
                  </div>
                </button>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="block w-full px-4 py-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="text-sm font-semibold text-gray-800">
                    User Evaluation Pending
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    5 users need rating for Eco Clean-up event
                  </div>
                </button>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="block w-full px-4 py-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="text-sm font-semibold text-gray-800">
                    Item Stock Alert
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    Eco Tote Bags running low (5 remaining)
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help button */}
        <button
          className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
          title="Help"
        >
          <HelpCircle size={20} />
        </button>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center focus:outline-none"
            aria-label="User profile menu"
          >
            {userInfo?.avatar_url ? (
              <img
                src={userInfo.avatar_url}
                alt={userInfo.full_name || "Profile avatar"}
                className="h-8 w-8 rounded-full border-2 border-emerald-100 object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-100 bg-emerald-600 text-sm font-bold text-white">
                {userInfo?.username
                  ? userInfo.username.charAt(0).toUpperCase()
                  : "U"}
              </div>
            )}
          </button>

          {profileOpen && (
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg">
              <button
                onClick={() => {
                  router.push("/customer/profile");
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <User size={16} className="text-gray-400" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setProfileOpen(false);
                }}
                disabled={loggingOut}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <LogOut size={16} />
                <span>{loggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
