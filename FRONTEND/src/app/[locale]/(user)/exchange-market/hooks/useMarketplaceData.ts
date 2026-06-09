"use client";

import { useCallback, useEffect, useState } from "react";

import { socket } from "@/src/lib/socket";
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
  product_status?: string;
  created_at: string;
  images: string[];
  stock?: number;
  creator?: { username?: string };
  purchase_limit_per_day?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
}

export function useMarketplaceData(userId?: number | string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [allItems, setAllItems] = useState<MarketplaceItem[]>([]);
  const [myItems, setMyItems] = useState<MarketplaceItem[]>([]);

  useEffect(() => {
    async function initialize() {
      try {
        const userResponse = (await getUser()) as any as {
          success: boolean;
        };
        if (!userResponse.success) {
          throw new Error("Không thể tải dữ liệu người dùng");
        }
      } catch (err: unknown) {
        setError("Lỗi khi tải dữ liệu người dùng");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, []);

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
          condition: item.product_status || "new",
          createdAt: item.created_at,
          image: item.images.length > 0 ? item.images[0] : null,
          stock: item.stock || 0,
          canPurchase: item.status === "available",
          seller: item.creator?.username || "Không xác định",
          purchaseLimitPerDay: item.purchase_limit_per_day,
          weight: item.weight,
          length: item.length,
          width: item.width,
          height: item.height,
        }));
        setItems(mappedItems as unknown as MarketplaceItem[]);

        // Join socket room for real-time updates
        rawItems.forEach((item) => {
          socket.emit("join-item-room", item.id);
        });

        // Listen for stock updates
        socket.on(
          "stock-update",
          (data: { itemId: number; stock: number; status: string }) => {
            setItems((prevItems) =>
              prevItems.map((prevItem) =>
                prevItem.id === data.itemId
                  ? { ...prevItem, stock: data.stock, postStatus: data.status }
                  : prevItem,
              ),
            );
          },
        );
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm cho tab đổi quà:", error);
      setError("Có lỗi xảy ra khi tải danh sách sản phẩm đổi quà");
    }
  }, []);

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
          postStatus: item.post_status,
          condition: item.product_status || "new",
          createdAt: item.created_at,
          image: item.images.length > 0 ? item.images[0] : null,
          stock: item.stock || 0,
          canPurchase: item.post_status === "public",
          seller: item.creator?.username || "Không xác định",
          purchaseLimitPerDay: item.purchase_limit_per_day,
          weight: item.weight,
          length: item.length,
          width: item.width,
          height: item.height,
        }));
        setMyItems(mappedMyItems as unknown as MarketplaceItem[]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm của người dùng:", error);
      setError("Có lỗi xảy ra khi tải danh sách sản phẩm của bạn");
    }
  }, [userId]);

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
          postStatus: item.post_status,
          condition: item.product_status || "new",
          createdAt: item.created_at,
          image: item.images.length > 0 ? item.images[0] : null,
          stock: item.stock || 0,
          canPurchase: item.post_status === "public",
          seller: item.creator?.username || "Không xác định",
          purchaseLimitPerDay: item.purchase_limit_per_day,
          weight: item.weight,
          length: item.length,
          width: item.width,
          height: item.height,
        }));
        setAllItems(mappedAllItems as unknown as MarketplaceItem[]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tất cả sản phẩm:", error);
      setError("Có lỗi xảy ra khi tải danh sách sản phẩm chợ trao đổi");
    }
  }, []);

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
