"use client";

import { useTranslations } from "next-intl";
import React, { useCallback, useState } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";
import mediaServices from "@/src/services/media";

import {
  createProduct,
  deleteProduct,
  purchaseItem,
  purchaseProduct,
  updateProduct,
} from "@/src/utils/api";

export interface MarketplaceItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  category?: string;
  image?: string;
  images?: string[];
  product_status?: string;
  postStatus?: string;
  createdAt?: string;
  canPurchase?: boolean;
  sellerId?: string | number;
  entityType?: 'PRODUCT' | 'ITEM';
}

export function useMarketplaceCrud({
  auth,
  setError,
  fetchRedeemItems,
  fetchAllItems,
  setMyItems,
}: {
  auth: {
    user?: {
      id: string | number;
      username: string;
      coins?: { amount: number };
    } | null;
    isAuthenticated: boolean;
  };
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  fetchRedeemItems: () => Promise<void>;
  fetchAllItems?: () => Promise<void>;
  setMyItems: React.Dispatch<React.SetStateAction<MarketplaceItem[]>>;
}) {
  const t = useTranslations("exchangeMarket");
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<MarketplaceItem | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null,
  );

  const handlePurchase = useCallback(
    (item: MarketplaceItem) => {
      const userCoins = auth.user?.coins?.amount || 0;
      if (!item) {
        setError(t("errors.invalidItem"));
        return;
      }
      if (!auth.user) {
        setError(t("errors.loginRequired"));
        return;
      }
      if (userCoins < item.price) {
        setError(t("errors.insufficientCoins"));
        return;
      }
      setSelectedItem(item);
      setIsModalOpen(true);
      setTransactionStatus(null);
    },
    [auth.user, setError, t],
  );

  const confirmPurchase = useCallback(
    async (
      quantity: number,
      shippingInfo: any,
    ) => {
      if (!selectedItem) {
        setError(t("errors.noItemSelected"));
        setIsModalOpen(false);
        return;
      }
      if (!auth.user) {
        setError(t("errors.loginRequired"));
        setIsModalOpen(false);
        return;
      }

      const userCoins = auth.user.coins?.amount || 0;
      const totalCost = selectedItem.price * quantity;

      if (userCoins < totalCost) {
        setError(t("errors.insufficientCoinsTx"));
        setIsModalOpen(false);
        return;
      }

      setTransactionStatus("processing");
      try {
        const purchaseData = {
          name: selectedItem.name,
          quantity: quantity,
          receiver_information_id: shippingInfo.receiver_information_id,
          to_name: shippingInfo.to_name || shippingInfo.toName || "Recipient",
          to_phone: shippingInfo.to_phone || shippingInfo.toPhone || "",
          to_address: shippingInfo.to_address || shippingInfo.toAddress || "",
        };

        const isProduct = selectedItem.entityType === "PRODUCT";
        const purchaseFn = isProduct ? purchaseProduct : purchaseItem;

        const response = (await purchaseFn(
          auth.user.id,
          selectedItem.id,
          purchaseData,
        )) as any;

        const hasTransactionOrJob =
          (isProduct && (response.data?.transactionId || response.data?.transaction_id)) ||
          (!isProduct && (response.data?.jobId || response.data?.job_id));

        if (response.success && hasTransactionOrJob) {
          // Update coins balance in local state store immediately
          const currentAmount = auth.user?.coins?.amount || 0;
          const newAmount = Math.max(0, currentAmount - totalCost);
          useAuthStore.getState().dispatch({
            type: "UPDATE_USER",
            payload: {
              coins: {
                amount: newAmount,
              },
            },
          });

          setTransactionStatus("success");
          setIsModalOpen(false);
          setSelectedItem(null);
          setTransactionStatus(null);
          alert(t("alerts.txSuccess", { quantity, name: selectedItem.name }));

          if (isProduct) {
            if (fetchAllItems) await fetchAllItems();
          } else {
            await fetchRedeemItems();
          }
        } else {
          throw new Error(t("errors.txNoCode"));
        }
      } catch (error: any) {
        setTransactionStatus("failed");
        const apiError = error.response?.data;
        let errorMessage = "";

        if (apiError?.code === "exceeded_daily_limit") {
          errorMessage = t("errors.exceededDailyLimit");
        } else if (apiError?.code === "insufficient_balance") {
          errorMessage = t("errors.insufficientCoinsTx");
        } else {
          errorMessage = apiError?.message || error.message || t("common.tryAgain");
        }

        setError(
          t("errors.txFailed", {
            message: errorMessage,
          }),
        );
        console.error("Lỗi khi xử lý giao dịch:", error);
        setIsModalOpen(false);
        setSelectedItem(null);
        setTransactionStatus(null);
      }
    },
    [selectedItem, auth.user, setError, fetchRedeemItems, t],
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setTransactionStatus(null);
  };

  const handleAddItem = () => {
    setItemToEdit(null);
    setShowCreateModal(true);
  };

  const handleEditItem = (item: MarketplaceItem) => {
    if (!item || !item.id) {
      console.error("Invalid item or item ID:", item);
      alert(t("errors.missingEditInfo"));
      return;
    }
    setItemToEdit(item);
    setSelectedItem(item);
    setShowCreateModal(true);
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!itemId) {
      console.error("Invalid item ID:", itemId);
      alert(t("errors.missingDeleteInfo"));
      return;
    }
    try {
      const response = await deleteProduct(itemId);
      if (response?.data) {
        setMyItems((prev) => prev.filter((item) => item.id !== itemId));
        setSelectedItem(null);
        setItemToEdit(null);
        alert(t("alerts.deleteSuccess"));
      } else {
        alert(t("alerts.deleteFailed"));
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert(err.message || t("alerts.deleteFailed"));
    }
  };

  const handleSubmitItem = async (formData: any, isEditing: boolean) => {
    try {
      const { images, ...productData } = formData;
      if (
        !productData.name ||
        !productData.price ||
        !productData.stock ||
        !productData.category ||
        !productData.product_status
      ) {
        alert(t("errors.missingSubmitFields"));
        return;
      }
      if (productData.price < 1) {
        alert(t("errors.priceMin"));
        return;
      }
      if (productData.stock < 1) {
        alert(t("errors.stockMin"));
        return;
      }

      // 1. Upload raw images to Cloudinary
      const imageUrls: string[] = [];
      if (images && images.length > 0) {
        for (const file of images) {
          if (file instanceof File) {
            const uploadRes = await mediaServices.uploadFile(file);
            const url = uploadRes.data?.secureUrl || uploadRes.data?.secure_url;
            if (url) {
              imageUrls.push(url);
            }
          } else if (typeof file === "string") {
            imageUrls.push(file);
          }
        }
      }

      // If no new image uploaded but we have an existing image URL, preserve it
      if (imageUrls.length === 0 && productData.image) {
        imageUrls.push(productData.image);
      }

      // 2. Prepare JSON payload
      const payload = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        category: productData.category,
        product_status: productData.product_status,
        post_status: isEditing ? (itemToEdit?.postStatus || "pending") : "pending",
        images: imageUrls,
      };

      if (isEditing) {
        if (!itemToEdit || !itemToEdit.id) {
          console.error("Missing item ID for update");
          alert(t("errors.missingUpdateInfo"));
          return;
        }

        const response = await updateProduct(itemToEdit.id, payload);
        if (response?.data) {
          const updatedProduct = {
            ...itemToEdit,
            ...productData,
            id: itemToEdit.id,
            postStatus:
              response.data.postStatus ||
              response.data.post_status ||
              itemToEdit.postStatus,
            image: response.data.images?.[0] || itemToEdit.image,
            images: response.data.images || itemToEdit.images || [],
            createdAt:
              response.data.createdAt ||
              response.data.created_at ||
              itemToEdit.createdAt,
            stock: response.data.stock || itemToEdit.stock,
            canPurchase:
              (response.data.postStatus || response.data.post_status) ===
              "public",
            purchaseLimitPerDay: response.data.purchaseLimitPerDay || response.data.purchase_limit_per_day,
            weight: response.data.weight,
            length: response.data.length,
            width: response.data.width,
            height: response.data.height,
          };

          setMyItems((prev) =>
            prev.map((item) =>
              item.id === itemToEdit.id ? updatedProduct : item,
            ),
          );
          alert(t("alerts.updateSuccess"));
        } else {
          alert(t("alerts.updateFailed"));
        }
      } else {
        const response = await createProduct(payload);
        if (response?.data) {
          const newItem = {
            ...productData,
            id: response.data.id,
            postStatus:
              response.data.postStatus || response.data.post_status || "draft",
            image: response.data.images?.[0] || null,
            images: response.data.images || [],
            createdAt:
              response.data.createdAt ||
              response.data.created_at ||
              new Date().toISOString(),
            stock: response.data.stock || 0,
            canPurchase:
              (response.data.postStatus || response.data.post_status) ===
              "public",
            seller: auth.user?.username || t("categories.unknown"),
            purchaseLimitPerDay: response.data.purchaseLimitPerDay || response.data.purchase_limit_per_day,
            weight: response.data.weight,
            length: response.data.length,
            width: response.data.width,
            height: response.data.height,
          };
          setMyItems((prev) => [
            ...prev,
            newItem as unknown as MarketplaceItem,
          ]);
          alert(t("alerts.createSuccess"));
        } else {
          alert(t("alerts.createFailed"));
        }
      }
      setShowCreateModal(false);
      setItemToEdit(null);
      setSelectedItem(null);
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error("Lỗi khi xử lý sản phẩm:", error);
      alert(err.message || t("alerts.createFailed"));
    }
  };

  const handleCancelForm = () => {
    setShowCreateModal(false);
    setItemToEdit(null);
  };

  return {
    selectedItem,
    setSelectedItem,
    isModalOpen,
    setIsModalOpen,
    showCreateModal,
    setShowCreateModal,
    itemToEdit,
    setItemToEdit,
    transactionStatus,
    setTransactionStatus,
    handlePurchase,
    confirmPurchase,
    handleCloseModal,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleSubmitItem,
    handleCancelForm,
  };
}
