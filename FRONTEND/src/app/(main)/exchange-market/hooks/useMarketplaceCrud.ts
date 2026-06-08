"use client";

import React, { useCallback, useState } from "react";

import {
  createProductApi,
  deleteProductApi,
  purchaseItemApi,
  updateProductApi,
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
    user?: { id: number; username: string; coins?: { amount: number } } | null;
    isAuthenticated: boolean;
  };
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  fetchRedeemItems: () => Promise<void>;
  setMyItems: React.Dispatch<React.SetStateAction<MarketplaceItem[]>>;
}) {
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
        setError("Mặt hàng không hợp lệ");
        return;
      }
      if (!auth.user) {
        setError("Vui lòng đăng nhập để thực hiện giao dịch");
        return;
      }
      if (userCoins < item.price) {
        setError("Bạn không có đủ số coins để giao dịch");
        return;
      }
      setSelectedItem(item);
      setIsModalOpen(true);
      setTransactionStatus(null);
    },
    [auth.user, setError],
  );

  const confirmPurchase = useCallback(
    async (
      quantity: number,
      shippingInfo: { receiver_information_id: number },
    ) => {
      if (!selectedItem) {
        setError("Không có sản phẩm được chọn");
        setIsModalOpen(false);
        return;
      }
      if (!auth.user) {
        setError("Vui lòng đăng nhập để thực hiện giao dịch");
        setIsModalOpen(false);
        return;
      }

      const userCoins = auth.user.coins?.amount || 0;
      const totalCost = selectedItem.price * quantity;

      if (userCoins < totalCost) {
        setError("Bạn không có đủ số coins để thực hiện giao dịch");
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

        const response = await purchaseItemApi(
          auth.user.id,
          selectedItem.id,
          purchaseData,
        );

        if (response.data?.job_id) {
          setTransactionStatus("success");
          setIsModalOpen(false);
          setSelectedItem(null);
          setTransactionStatus(null);
          alert(
            `Giao dịch ${quantity} ${selectedItem.name} đã được khởi tạo thành công!`,
          );
          await fetchRedeemItems();
        } else {
          throw new Error("Không nhận được mã giao dịch");
        }
      } catch (error: unknown) {
        setTransactionStatus("failed");
        const err = error as { message?: string };
        setError(`Giao dịch thất bại: ${err.message || "Vui lòng thử lại"}`);
        console.error("Lỗi khi xử lý giao dịch:", error);
        setIsModalOpen(false);
        setSelectedItem(null);
        setTransactionStatus(null);
      }
    },
    [selectedItem, auth.user, setError, fetchRedeemItems],
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
      alert("Không thể sửa sản phẩm do thiếu thông tin!");
      return;
    }
    setItemToEdit(item);
    setSelectedItem(item);
    setShowCreateModal(true);
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!itemId) {
      console.error("Invalid item ID:", itemId);
      alert("Không thể xóa sản phẩm do thiếu thông tin!");
      return;
    }
    try {
      const response = await deleteProductApi(itemId);
      if (response?.data) {
        setMyItems((prev) => prev.filter((item) => item.id !== itemId));
        setSelectedItem(null);
        setItemToEdit(null);
        alert("Sản phẩm đã được xóa thành công!");
      } else {
        alert("Xóa sản phẩm thất bại!");
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert(err.message || "Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  const handleSubmitItem = async (
    formData: any,
    isEditing: boolean,
  ) => {
    try {
      const { images, ...productData } = formData;
      if (
        !productData.name ||
        !productData.price ||
        !productData.stock ||
        !productData.category ||
        !productData.product_status
      ) {
        alert("Vui lòng điền đầy đủ các trường bắt buộc!");
        return;
      }
      if (productData.price < 1) {
        alert("Giá sản phẩm phải lớn hơn hoặc bằng 1!");
        return;
      }
      if (productData.stock < 1) {
        alert("Số lượng sản phẩm phải lớn hơn hoặc bằng 1!");
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
          alert("Không thể cập nhật sản phẩm do thiếu thông tin!");
          return;
        }

        const response = await updateProductApi(itemToEdit.id, formDataToSend);
        if (response?.data) {
          const updatedProduct = {
            ...itemToEdit,
            ...productData,
            id: itemToEdit.id,
            postStatus: response.data.post_status || itemToEdit.postStatus,
            image: response.data.images?.[0] || itemToEdit.image,
            createdAt: response.data.created_at || itemToEdit.createdAt,
            stock: response.data.stock || itemToEdit.stock,
            canPurchase: response.data.post_status === "public",
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
          alert("Cập nhật sản phẩm thành công!");
        } else {
          alert("Cập nhật sản phẩm thất bại!");
        }
      } else {
        const response = await createProductApi(formDataToSend);
        if (response?.data) {
          const newItem = {
            ...productData,
            id: response.data.id,
            postStatus: response.data.post_status || "draft",
            image: response.data.images?.[0] || null,
            createdAt: response.data.created_at || new Date().toISOString(),
            stock: response.data.stock || 0,
            canPurchase: response.data.post_status === "public",
            seller: auth.user?.username || "Không xác định",
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
          alert("Thêm sản phẩm mới thành công!");
        } else {
          alert("Thêm sản phẩm thất bại!");
        }
      }
      setShowCreateModal(false);
      setItemToEdit(null);
      setSelectedItem(null);
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error("Lỗi khi xử lý sản phẩm:", error);
      alert(err.message || "Có lỗi xảy ra khi xử lý sản phẩm");
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
