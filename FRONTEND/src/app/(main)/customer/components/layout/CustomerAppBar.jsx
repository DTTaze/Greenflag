"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Home,
  Bell,
  HelpCircle,
  User,
  LogOut,
} from "lucide-react";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import { useAuthStore } from "@/src/store/auth/authStore";
import { logoutUser } from "@/src/utils/api";

export default function CustomerAppBar({
  open: _open,
  drawerWidth,
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
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
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
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm h-16 flex items-center px-4 justify-between">
      {/* Left side actions */}
      <div className="flex items-center gap-3">
        {/* Toggle drawer button */}
        <button
          onClick={handleDrawerToggle}
          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 focus:outline-none transition-colors"
          aria-label="Toggle drawer"
        >
          <Menu size={22} />
        </button>

        {/* Home button */}
        <button
          onClick={() => router.push("/")}
          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 focus:outline-none transition-colors"
          title="Go to Homepage"
        >
          <Home size={20} />
        </button>

        {/* Breadcrumb / Title */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => router.push("/customer")}
            className="hover:text-emerald-600 font-medium"
          >
            Home
          </button>
          <span>/</span>
          <span className="font-semibold text-emerald-700">{getPageTitle()}</span>
        </div>

        <span className="sm:hidden text-sm font-semibold text-emerald-700">
          {getPageTitle()}
        </span>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-[10px] text-white flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-50 font-bold text-xs text-gray-400 uppercase tracking-wider">
                Thông báo mới
              </div>
              <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 block transition-colors"
                >
                  <div className="font-semibold text-sm text-gray-800">New Event Created</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Tech Conference added to your events
                  </div>
                </button>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 block transition-colors"
                >
                  <div className="font-semibold text-sm text-gray-800">User Evaluation Pending</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    5 users need rating for Eco Clean-up event
                  </div>
                </button>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 block transition-colors"
                >
                  <div className="font-semibold text-sm text-gray-800">Item Stock Alert</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Eco Tote Bags running low (5 remaining)
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help button */}
        <button
          className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
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
                className="w-8 h-8 rounded-full border-2 border-emerald-100 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm border-2 border-emerald-100">
                {userInfo?.username ? userInfo.username.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50">
              <button
                onClick={() => {
                  router.push("/customer/profile");
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
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
