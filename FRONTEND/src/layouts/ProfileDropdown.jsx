import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProfileDropdown({ user, avatarUrl, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex cursor-pointer items-center gap-1 rounded-full border border-gray-200 p-0.5 transition-colors duration-200 hover:border-[#0B6E4F] active:scale-95"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={avatarUrl}
          alt="Avatar"
          className="h-8.5 w-8.5 rounded-full object-cover"
        />
        <ChevronDown className="mr-1 hidden h-4 w-4 text-gray-400 sm:inline" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 z-40 mt-2.5 w-60 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl"
            >
              <div className="mb-1 rounded-lg bg-gray-50/50 px-3 py-2.5">
                <p className="truncate text-sm font-bold text-gray-800">
                  {user?.username || "User"}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {user?.email || ""}
                </p>
              </div>

              <Link
                href="/user"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-gray-700 transition-colors hover:bg-[#0B6E4F]/5 hover:text-[#0B6E4F]"
              >
                <User className="h-4 w-4 text-gray-400" />
                <span>Tài khoản của tôi</span>
              </Link>

              <hr className="my-1 border-gray-100" />

              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 text-red-400" />
                <span>Đăng xuất</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
