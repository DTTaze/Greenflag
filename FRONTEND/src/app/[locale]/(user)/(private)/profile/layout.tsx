"use client";

import React, { useEffect, useState } from "react";
import { User, ShieldCheck, MapPin, Coins, Loader2, Award, ShoppingBag, History } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/src/i18n/navigation";
import ProtectedRoute from "@/src/components/common/ProtectedRoute.jsx";
import { useAuthStore } from "@/src/store/auth/authStore";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("user");
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isLoading = !(isAuthenticated && user);

  // Formatting currency/EcoCoins
  const balance = user?.coins?.amount || 0;
  const formattedCoins = new Intl.NumberFormat("vi-VN").format(balance);

  const sidebarLinks = [
    {
      href: "/profile",
      label: t("personalInfo"),
      icon: User,
      active: pathname === "/profile" || pathname === "/profile/account",
    },
    {
      href: "/profile/security",
      label: t("passwordSecurity"),
      icon: ShieldCheck,
      active: pathname === "/profile/security",
    },
    {
      href: "/profile/addresses",
      label: t("addressBook"),
      icon: MapPin,
      active: pathname === "/profile/addresses",
    },
    {
      href: "/profile/missions",
      label: t("completedMissions"),
      icon: Award,
      active: pathname === "/profile/missions",
    },
    {
      href: "/profile/purchase",
      label: t("purchaseOrders"),
      icon: ShoppingBag,
      active: pathname === "/profile/purchase",
    },
    {
      href: "/profile/history",
      label: t("activityHistory"),
      icon: History,
      active: pathname === "/profile/history",
    },
  ];

  return (
    <ProtectedRoute requiredRole={undefined}>
      <div className="min-h-screen w-full transition-colors bg-zinc-50/50 dark:bg-zinc-950/20 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24 space-y-6">
                {/* User Info Card */}
                <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50 transition-all duration-300">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                      <p className="text-sm text-zinc-500">{t("generatingQr")}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-emerald-500/20">
                        <img
                          src={user?.avatar_url || user?.avatarUrl || "/images/default-avatar.jpg"}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h2 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {user?.full_name || "-"}
                      </h2>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        @{user?.username || "-"}
                      </p>

                      {/* EcoCoins Badge */}
                      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1 text-sm font-semibold text-amber-700 dark:text-amber-400">
                        <Coins size={16} className="text-amber-500 animate-pulse" />
                        <span>{formattedCoins} 🪙</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Navigation List */}
                <nav className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-2.5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
                  <ul className="space-y-1">
                    {sidebarLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                              link.active
                                ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
                            }`}
                          >
                            <Icon
                              size={18}
                              className={
                                link.active
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-zinc-400 dark:text-zinc-500"
                              }
                            />
                            <span>{link.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-8 xl:col-span-9">
              <div className="transition-all duration-300">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
