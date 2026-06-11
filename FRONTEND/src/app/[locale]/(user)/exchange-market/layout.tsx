"use client";

import { useTranslations } from "next-intl";
import React, { useContext } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";

import CatalogHeader from "./components/CatalogHeader";
import ItemCatalogSkeleton from "./components/ItemCatalogSkeleton";
import MarketViewNavigation from "./components/MarketViewNavigation";
import PurchaseModal from "./components/PurchaseModal";
import {
  MarketplaceContext,
  MarketplaceProvider,
} from "./contexts/marketplace.context";

// Re-export constants and utilities to avoid breaking existing imports in child components
export {
  getCategoryDisplayName,
  marketplaceCategories,
  MarketplaceContext,
  statusColors,
  statusConfig,
  userItemStatuses,
} from "./contexts/marketplace.context";

function ExchangeMarketContent({ children }: { children: React.ReactNode }) {
  const t = useTranslations("exchangeMarket");
  const { user } = useAuthStore();
  const {
    loading,
    error,
    setError,
    transactionStatus,
    selectedItem,
    isModalOpen,
    handleCloseModal,
    confirmPurchase,
  } = useContext(MarketplaceContext)!;

  if (loading) {
    return (
      <main className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:py-8">
        <ItemCatalogSkeleton />
      </main>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_34%),linear-gradient(180deg,#f0fdf4_0%,#f8fafc_42%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.1),_transparent_40%),linear-gradient(180deg,#020617_0%,#0f172a_42%,#020617_100%)]">
      <div className="pointer-events-none absolute -top-28 right-8 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/10" />
      <div className="pointer-events-none absolute top-72 -left-32 h-80 w-80 rounded-full bg-lime-200/40 blur-3xl dark:bg-lime-500/10" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-500/10" />

      <main className="relative min-h-screen bg-gray-50/50 pt-20 pb-10 transition-colors duration-300 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CatalogHeader userCoins={user?.coins?.amount || 0} />

          {/* Sticky Sub-navbar containing navigation and Wallet balance */}
          <div className="sticky top-16 z-40 mb-6 w-full rounded-[1.25rem] border border-gray-200 bg-white/95 p-3.5 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/95">
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
              <MarketViewNavigation />

              {/* Sticky Wallet (Coin Balance Display) */}
              <div className="flex w-fit items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-2 text-sm font-bold text-amber-700 shadow-2xs select-none dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-pulse text-amber-600 dark:text-amber-300"
                >
                  <circle cx="8" cy="8" r="6"></circle>
                  <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                  <path d="M7 6h1v4"></path>
                </svg>
                <span>{(user?.coins?.amount || 0).toLocaleString()} xu</span>
              </div>
            </div>
          </div>

          <section className="relative overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white/95 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-5 lg:p-6 dark:border-zinc-800/80 dark:bg-zinc-900/95 dark:shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent dark:via-emerald-500/40" />

            {error && (
              <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-red-900/30 dark:bg-red-950/20">
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                  {error}
                </p>
                <button
                  onClick={() => setError(null)}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-red-700 shadow-sm ring-1 ring-red-100 transition hover:bg-red-100 active:scale-95 dark:bg-slate-800 dark:text-red-400 dark:ring-red-900/50 dark:hover:bg-slate-700"
                >
                  {t("common.close") || "Đóng"}
                </button>
              </div>
            )}

            {transactionStatus === "processing" && (
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50/90 p-4 shadow-sm dark:border-blue-900/30 dark:bg-blue-950/20">
                <span className="h-2.5 w-2.5 animate-ping rounded-full bg-blue-500" />
                <p className="text-sm font-semibold text-blue-700">
                  {t("common.processingTx") || "Đang xử lý giao dịch..."}
                </p>
              </div>
            )}

            {children}

            {selectedItem &&
              isModalOpen &&
              React.createElement(
                PurchaseModal as React.ComponentType<{
                  isOpen: boolean;
                  onClose: () => void;
                  item: unknown;
                  userCoins: number;
                  onConfirm: (quantity: number, shippingInfo: unknown) => void;
                  transactionStatus?: string | null;
                }>,
                {
                  isOpen: isModalOpen,
                  onClose: handleCloseModal,
                  item: selectedItem,
                  userCoins: user?.coins?.amount || 0,
                  onConfirm: confirmPurchase,
                  transactionStatus: transactionStatus,
                },
              )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default function ExchangeMarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketplaceProvider>
      <ExchangeMarketContent>{children}</ExchangeMarketContent>
    </MarketplaceProvider>
  );
}
