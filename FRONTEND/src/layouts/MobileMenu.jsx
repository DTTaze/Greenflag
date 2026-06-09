import { AnimatePresence, motion } from "framer-motion";
import { Coins, LogOut, Menu, User, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/src/i18n/navigation";

export default function MobileMenu({
  isOpen,
  setIsOpen,
  isAuthenticated,
  user,
  avatarUrl,
  pages,
  pathname,
  onLogout,
}) {
  const t = useTranslations("menu");

  return (
    <>
      <button
        className="flex items-center justify-center rounded-lg p-1.5 text-gray-600 transition-all hover:bg-gray-100 active:scale-95 md:hidden dark:text-zinc-300 dark:hover:bg-zinc-900"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-45 bg-black/80 backdrop-blur-xs md:hidden"
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-xs flex-col justify-between bg-white p-6 shadow-2xl md:hidden dark:bg-zinc-950"
            >
              <div>
                {/* Drawer Header */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/images/Logo-Greenflag.png"
                      className="h-8 w-8 object-contain"
                      alt="Logo"
                    />
                    <span className="text-lg font-bold text-[#0B6E4F] dark:text-emerald-500">
                      Green Flag
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Profile Card if Logged In */}
                {isAuthenticated && (
                  <div className="mb-6 flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 dark:bg-zinc-900">
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-11 w-11 rounded-full border border-gray-200 object-cover dark:border-zinc-800"
                    />
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-bold text-gray-800 dark:text-zinc-200">
                        {user?.username || "User"}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-500">
                        <Coins className="text-amber-550 h-3.5 w-3.5 animate-pulse" />
                        <span>{user?.coins?.amount || 0} Coins</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="flex flex-col gap-1.5">
                  {isAuthenticated ? (
                    pages.map(({ key, label, icon: Icon }) => {
                      const isActive =
                        key === ""
                          ? pathname === "/"
                          : pathname.startsWith(`/${key}`);
                      return (
                        <Link
                          key={key}
                          href={`/${key}`}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                            isActive
                              ? "bg-[#0B6E4F]/10 text-[#0B6E4F] dark:bg-emerald-950/20 dark:text-emerald-400"
                              : "text-gray-600 hover:bg-gray-50 hover:text-[#0B6E4F] dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-emerald-400"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${isActive ? "text-[#0B6E4F] dark:text-emerald-400" : "text-gray-400 dark:text-zinc-500"}`}
                          />
                          <span>{label}</span>
                        </Link>
                      );
                    })
                  ) : (
                    // Guest Mobile Buttons
                    <div className="mt-2 flex flex-col gap-2.5">
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center rounded-lg border border-gray-200 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      >
                        {t("login")}
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center rounded-lg bg-[#0B6E4F] py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#0B6E4F]/90 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                      >
                        {t("register")}
                      </Link>
                    </div>
                  )}
                </nav>
              </div>

              {/* Drawer Footer Account Management */}
              {isAuthenticated && (
                <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-4 dark:border-zinc-800">
                  <Link
                    href="/user"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#0B6E4F] dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-emerald-400"
                  >
                    <User className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                    <span>{t("profile")}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <LogOut className="h-5 w-5 text-red-400 dark:text-red-500" />
                    <span>{t("logout")}</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
