/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  CheckCircle,
  ClipboardEdit,
  Clock,
  EyeOff,
  FileWarning,
  Filter,
} from "lucide-react";
import React, { createContext, useContext, useState } from "react";

import { AuthContext } from "@/src/contexts/auth.context";

import { useMarketplaceCrud } from "../hooks/useMarketplaceCrud";
import { useMarketplaceData } from "../hooks/useMarketplaceData";

export const marketplaceCategories = [
  { key: "all", name: "Tất cả" },
  { key: "recycled", name: "Đồ tái chế" },
  { key: "handicraft", name: "Đồ thủ công" },
  { key: "organic", name: "Sản phẩm hữu cơ" },
  { key: "plants", name: "Cây trồng" },
  { key: "other", name: "Khác" },
];

export const statusColors: Record<string, string> = {
  displaying: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  hidden: "bg-gray-100 text-gray-700",
  draft: "bg-slate-100 text-slate-700",
  all: "bg-blue-100 text-blue-700",
  public: "bg-emerald-100 text-emerald-700",
};

export const userItemStatuses = [
  { key: "all", name: "Tất cả", icon: Filter },
  { key: "public", name: "Đang hiển thị", icon: CheckCircle },
  { key: "pending", name: "Chờ duyệt", icon: Clock },
  { key: "rejected", name: "Bị từ chối", icon: FileWarning },
  { key: "hidden", name: "Đã ẩn", icon: EyeOff },
  { key: "draft", name: "Tin nháp", icon: ClipboardEdit },
];

export const statusConfig: Record<string, { name: string; color: string }> = {
  public: { name: "Đang hiển thị", color: "emerald" },
  pending: { name: "Chờ duyệt", color: "amber" },
  rejected: { name: "Bị từ chối", color: "red" },
  hidden: { name: "Đã ẩn", color: "gray" },
  draft: { name: "Tin nháp", color: "slate" },
};

export const getCategoryDisplayName = (key: string) => {
  const categories: Record<string, string> = {
    handicraft: "Đồ thủ công",
    recycled: "Đồ tái chế",
    organic: "Sản phẩm hữu cơ",
    plants: "Cây trồng",
    other: "Khác",
  };
  return categories[key] || "Không xác định";
};

export const MarketplaceContext = createContext<any>(null);

export function MarketplaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = useContext(AuthContext);

  const {
    loading,
    error,
    setError,
    items,
    allItems,
    myItems,
    setMyItems,
    fetchRedeemItems,
    fetchMyItems,
    fetchAllItems,
  } = useMarketplaceData(auth.user?.id);

  const {
    selectedItem,
    isModalOpen,
    showCreateModal,
    itemToEdit,
    transactionStatus,
    handlePurchase,
    confirmPurchase,
    handleCloseModal,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleSubmitItem,
    handleCancelForm,
  } = useMarketplaceCrud({
    auth,
    setError,
    fetchRedeemItems,
    setMyItems,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [marketListView, setMarketListView] = useState("grid");
  const [marketCategory, setMarketCategory] = useState("all");
  const [marketStatusFilter, setMarketStatusFilter] = useState("all");
  const [marketSearchText, setMarketSearchText] = useState("");

  const contextValue = {
    loading,
    error,
    setError,
    transactionStatus,
    selectedItem,
    isModalOpen,
    items,
    allItems,
    myItems,
    fetchRedeemItems,
    fetchMyItems,
    fetchAllItems,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    isFilterOpen,
    setIsFilterOpen,
    marketListView,
    setMarketListView,
    marketCategory,
    setMarketCategory,
    marketStatusFilter,
    setMarketStatusFilter,
    marketSearchText,
    setMarketSearchText,
    showCreateModal,
    itemToEdit,
    handlePurchase,
    confirmPurchase,
    handleCloseModal,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleSubmitItem,
    handleCancelForm,
  };

  return (
    <MarketplaceContext.Provider value={contextValue}>
      {children}
    </MarketplaceContext.Provider>
  );
}
