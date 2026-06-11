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
  userItemStatuses
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
    <div className="relative">
      <main className="relative mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:py-8">
        <CatalogHeader userCoins={user?.coins?.amount || 0} />
        <MarketViewNavigation />

        <section className="relative overflow-hidden rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-5 lg:p-6 dark:border-emerald-500/20 dark:bg-slate-900/80 dark:shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
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
      </main >
    </div >
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
