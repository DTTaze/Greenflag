/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";

import { socket } from "@/src/config/socket";
import {
  getAllAvailableProductsApi,
  getAllItemsApi,
  getProductByIdUser,
  getUserApi,
} from "@/src/utils/api";

export function useMarketplaceData(userId?: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [myItems, setMyItems] = useState<any[]>([]);

  useEffect(() => {
    async function initialize() {
      try {
        const userResponse = (await getUserApi()) as any;
        if (!userResponse.success) {
          throw new Error("Không thể tải dữ liệu người dùng");
        }
      } catch (err: any) {
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
      const itemsResponse = await getAllItemsApi();
      if (itemsResponse?.data) {
        const mappedItems = itemsResponse.data.map((item: any) => ({
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
        setItems(mappedItems);

        // Join socket room for real-time updates
        itemsResponse.data.forEach((item: any) => {
          socket.emit("join-item-room", item.id);
        });

        // Listen for stock updates
        socket.on("stock-update", (data: any) => {
          setItems((prevItems) =>
            prevItems.map((prevItem) =>
              prevItem.id === data.itemId
                ? { ...prevItem, stock: data.stock, postStatus: data.status }
                : prevItem,
            ),
          );
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm cho tab đổi quà:", error);
      setError("Có lỗi xảy ra khi tải danh sách sản phẩm đổi quà");
    }
  }, []);

  const fetchMyItems = useCallback(async () => {
    if (!userId) return;
    try {
      const productResponse = await getProductByIdUser(userId);
      if (productResponse?.data) {
        const mappedMyItems = productResponse.data.map((item: any) => ({
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
        setMyItems(mappedMyItems);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm của người dùng:", error);
      setError("Có lỗi xảy ra khi tải danh sách sản phẩm của bạn");
    }
  }, [userId]);

  const fetchAllItems = useCallback(async () => {
    try {
      const allProductsResponse = await getAllAvailableProductsApi();
      if (allProductsResponse?.data) {
        const mappedAllItems = allProductsResponse.data.map((item: any) => ({
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
        setAllItems(mappedAllItems);
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
