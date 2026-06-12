"use client";

import { useTranslations } from "next-intl";
import React, { useCallback, useState } from "react";

import {
  createProduct,
  deleteProduct,
  purchaseItem,
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
  product_status?: string;
  postStatus?: string;
  createdAt?: string;
  canPurchase?: boolean;
}

export function useMarketplaceCrud({
  auth,
  setError,
  fetchRedeemItems,
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
      shippingInfo: { receiver_information_id: number },
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
        };

        const response = await purchaseItem(
          auth.user.id,
          selectedItem.id,
          purchaseData,
        );

        if (response.data?.job_id) {
          setTransactionStatus("success");
          setIsModalOpen(false);
          setSelectedItem(null);
          setTransactionStatus(null);
          alert(t("alerts.txSuccess", { quantity, name: selectedItem.name }));
          await fetchRedeemItems();
        } else {
          throw new Error(t("errors.txNoCode"));
        }
      } catch (error: unknown) {
        setTransactionStatus("failed");
        const err = error as { message?: string };
        setError(
          t("errors.txFailed", {
            message: err.message || t("common.tryAgain"),
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

      const formDataToSend = new FormData();
      Object.keys(productData).forEach((key) => {
        formDataToSend.append(key, String(productData[key]));
      });

      if (images && images.length > 0) {
        images.forEach((image: any) => {
          formDataToSend.append("images", image as Blob | string);
        });
      }

      if (isEditing) {
        if (!itemToEdit || !itemToEdit.id) {
          console.error("Missing item ID for update");
          alert(t("errors.missingUpdateInfo"));
          return;
        }

        const response = await updateProduct(itemToEdit.id, formDataToSend);
        if (response?.data) {
          const updatedProduct = {
            ...itemToEdit,
            ...productData,
            id: itemToEdit.id,
            postStatus: response.data.postStatus || response.data.post_status || itemToEdit.postStatus,
            image: response.data.images?.[0] || itemToEdit.image,
            createdAt: response.data.createdAt || response.data.created_at || itemToEdit.createdAt,
            stock: response.data.stock || itemToEdit.stock,
            canPurchase: (response.data.postStatus || response.data.post_status) === "public",
            purchaseLimitPerDay: response.data.purchase_limit_per_day,
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
        const response = await createProduct(formDataToSend);
        if (response?.data) {
          const newItem = {
            ...productData,
            id: response.data.id,
            postStatus: response.data.postStatus || response.data.post_status || "draft",
            image: response.data.images?.[0] || null,
            createdAt: response.data.createdAt || response.data.created_at || new Date().toISOString(),
            stock: response.data.stock || 0,
            canPurchase: (response.data.postStatus || response.data.post_status) === "public",
            seller: auth.user?.username || t("categories.unknown"),
            purchaseLimitPerDay: response.data.purchase_limit_per_day,
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
