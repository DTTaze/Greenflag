"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import {
  getAllAvailableProducts,
  getAllItems,
  getProductByUserId,
  getUser,
} from "@/src/utils/api";

import { MarketplaceItem } from "./useMarketplaceCrud";

interface RawProductData {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  status?: string;
  post_status?: string;
  postStatus?: string;
  product_status?: string;
  productStatus?: string;
  created_at: string;
  createdAt?: string;
  images: string[];
  stock?: number;
  creator?: { username?: string };
  purchase_limit_per_day?: number;
  purchaseLimitPerDay?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
}

export function useMarketplaceData(userId?: number | string) {
  const t = useTranslations("exchangeMarket");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [allItems, setAllItems] = useState<MarketplaceItem[]>([]);
  const [myItems, setMyItems] = useState<MarketplaceItem[]>([]);

  useEffect(() => {
    async function initialize() {
      try {
        const userResponse = (await getUser()) as any;
        if (userResponse.status !== 200 || !userResponse.data) {
          throw new Error(t("errors.loadUserFailed"));
        }
      } catch (err: unknown) {
        setError(t("errors.loadUserError"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [t]);

  const fetchRedeemItems = useCallback(async () => {
    try {
      const itemsResponse = await getAllItems();
      if (itemsResponse?.data) {
        const rawItems = itemsResponse.data as RawProductData[];
        const mappedItems = rawItems.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category || "other",
          postStatus: item.status === "available" ? "public" : item.status,
          condition: item.productStatus || item.product_status || "new",
          createdAt: item.createdAt || item.created_at,
          image: item.images?.[0] || null,
          stock: item.stock || 0,
          canPurchase: item.status === "available",
          seller: item.creator?.username || t("categories.unknown"),
          purchaseLimitPerDay: item.purchaseLimitPerDay || item.purchase_limit_per_day,
          weight: item.weight,
          length: item.length,
          width: item.width,
          height: item.height,
        }));
        setItems(mappedItems as unknown as MarketplaceItem[]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm cho tab đổi quà:", error);
      setError(t("errors.loadRedeemFailed"));
    }
  }, [t]);

  const fetchMyItems = useCallback(async () => {
    if (!userId) return;
    try {
      const productResponse = await getProductByUserId(userId);
      if (productResponse?.data) {
        const rawItems = productResponse.data as RawProductData[];
        const mappedMyItems = rawItems.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category || "other",
          postStatus: item.postStatus || item.post_status,
          condition: item.productStatus || item.product_status || "new",
          createdAt: item.createdAt || item.created_at,
          image: item.images?.[0] || null,
          stock: item.stock || 0,
          canPurchase: item.post_status === "public",
          seller: item.creator?.username || t("categories.unknown"),
          purchaseLimitPerDay: item.purchaseLimitPerDay || item.purchase_limit_per_day,
          weight: item.weight,
          length: item.length,
          width: item.width,
          height: item.height,
        }));
        setMyItems(mappedMyItems as unknown as MarketplaceItem[]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm của người dùng:", error);
      setError(t("errors.loadMyItemsFailed"));
    }
  }, [userId, t]);

  const fetchAllItems = useCallback(async () => {
    try {
      const allProductsResponse = await getAllAvailableProducts();
      if (allProductsResponse?.data) {
        const rawItems = allProductsResponse.data as RawProductData[];
        const mappedAllItems = rawItems.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category || "other",
          postStatus: item.postStatus || item.post_status,
          condition: item.productStatus || item.product_status || "new",
          createdAt: item.createdAt || item.created_at,
          image: item.images?.[0] || null,
          stock: item.stock || 0,
          canPurchase: item.post_status === "public",
          seller: item.creator?.username || t("categories.unknown"),
          purchaseLimitPerDay: item.purchaseLimitPerDay || item.purchase_limit_per_day,
          weight: item.weight,
          length: item.length,
          width: item.width,
          height: item.height,
        }));
        setAllItems(mappedAllItems as unknown as MarketplaceItem[]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tất cả sản phẩm:", error);
      setError(t("errors.loadAllItemsFailed"));
    }
  }, [t]);

  return {
    loading,
    error,
    setError,
    items,
    setItems,
    allItems,
    setAllItems,
    myItems,
    setMyItems,
    fetchRedeemItems,
    fetchMyItems,
    fetchAllItems,
  };
}
