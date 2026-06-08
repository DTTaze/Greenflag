"use client";

import React, { useContext } from "react";

import { AuthContext } from "@/src/contexts/auth.context";

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
  const { auth } = useContext(AuthContext);
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
      <main className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
        <ItemCatalogSkeleton />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
        <CatalogHeader userCoins={auth.user?.coins?.amount || 0} />
        <MarketViewNavigation />
        <div className="flex flex-col rounded-lg bg-white p-4 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 rounded bg-red-100 px-3 py-1 text-red-800 hover:bg-red-200"
              >
                Đóng
              </button>
            </div>
          )}
          {transactionStatus === "processing" && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-blue-600">Đang xử lý giao dịch...</p>
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
                userCoins: auth.user?.coins?.amount || 0,
                onConfirm: confirmPurchase,
                transactionStatus: transactionStatus,
              },
            )}
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
