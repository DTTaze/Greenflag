"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Outlet } from "react-router-dom";
import {
  getUserApi,
  purchaseItemApi,
  createProductApi,
  updateProductApi,
  getProductByIdUser,
  getAllAvailableProductsApi,
  getAllItemsApi,
  deleteProductApi,
} from "@/src/utils/api";
import { AuthContext } from "@/src/contexts/auth.context";
import ItemCatalogSkeleton from "./components/ItemCatalogSkeleton";
import CatalogHeader from "./components/CatalogHeader";
import MarketViewNavigation from "./components/MarketViewNavigation";
import PurchaseModal from "./components/PurchaseModal";
import {
  Filter,
  CheckCircle,
  Clock,
  FileWarning,
  EyeOff,
  ClipboardEdit,
} from "lucide-react";
import { socket } from "@/src/config/socket";

export const marketplaceCategories = [
  { key: "all", name: "Tất cả" },
  { key: "recycled", name: "Đồ tái chế" },
  { key: "handicraft", name: "Đồ thủ công" },
  { key: "organic", name: "Sản phẩm hữu cơ" },
  { key: "plants", name: "Cây trồng" },
  { key: "other", name: "Khác" },
];

export const statusColors = {
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

export const statusConfig = {
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

export default function ExchangeMarketLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const { auth } = useContext(AuthContext);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [myItems, setMyItems] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<any>(null);
  const [marketListView, setMarketListView] = useState("grid");
  const [marketCategory, setMarketCategory] = useState("all");
  const [marketStatusFilter, setMarketStatusFilter] = useState("all");
  const [marketSearchText, setMarketSearchText] = useState("");

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
                : prevItem
            )
          );
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm cho tab đổi quà:", error);
      setError("Có lỗi xảy ra khi tải danh sách sản phẩm đổi quà");
    }
  }, []);

  const fetchMyItems = useCallback(async () => {
    if (!auth.user?.id) return;
    try {
      const productResponse = await getProductByIdUser(auth.user.id);
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
  }, [auth.user?.id]);

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

  const handlePurchase = useCallback(
    (item: any) => {
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
    [auth.user]
  );

  const confirmPurchase = useCallback(
    async (quantity: number, shippingInfo: any) => {
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
          purchaseData
        );

        if (response.data?.job_id) {
          setTransactionStatus("success");
          setIsModalOpen(false);
          setSelectedItem(null);
          setTransactionStatus(null);
          alert(
            `Giao dịch ${quantity} ${selectedItem.name} đã được khởi tạo thành công!`
          );
          await fetchRedeemItems();
        } else {
          throw new Error("Không nhận được mã giao dịch");
        }
      } catch (error: any) {
        setTransactionStatus("failed");
        setError(`Giao dịch thất bại: ${error.message || "Vui lòng thử lại"}`);
        console.error("Lỗi khi xử lý giao dịch:", error);
        setIsModalOpen(false);
        setSelectedItem(null);
        setTransactionStatus(null);
      }
    },
    [selectedItem, auth.user, fetchRedeemItems]
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

  const handleEditItem = (item: any) => {
    if (!item || !item.id) {
      console.error("Invalid item or item ID:", item);
      alert("Không thể sửa sản phẩm do thiếu thông tin!");
      return;
    }
    setItemToEdit(item);
    setSelectedItem(item);
    setShowCreateModal(true);
  };

  const handleDeleteItem = async (itemId: any) => {
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
    } catch (error: any) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert(error.message || "Có lỗi xảy ra khi xóa sản phẩm");
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
        formDataToSend.append(key, productData[key]);
      });

      if (images && images.length > 0) {
        images.forEach((image: any) => {
          formDataToSend.append("images", image);
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
              item.id === itemToEdit.id ? updatedProduct : item
            )
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
          setMyItems((prev) => [...prev, newItem]);
          alert("Thêm sản phẩm mới thành công!");
        } else {
          alert("Thêm sản phẩm thất bại!");
        }
      }
      setShowCreateModal(false);
      setItemToEdit(null);
      setSelectedItem(null);
    } catch (error: any) {
      console.error("Lỗi khi xử lý sản phẩm:", error);
      alert(error.message || "Có lỗi xảy ra khi xử lý sản phẩm");
    }
  };

  const handleCancelForm = () => {
    setShowCreateModal(false);
    setItemToEdit(null);
  };

  const contextValue = {
    items,
    myItems,
    allItems,
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
    setShowCreateModal,
    itemToEdit,
    setItemToEdit,
    handlePurchase,
    confirmPurchase,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleSubmitItem,
    handleCancelForm,
  };

  if (loading) {
    return (
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <ItemCatalogSkeleton />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceContext.Provider value={contextValue}>
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          <CatalogHeader userCoins={auth.user?.coins?.amount || 0} />
          <MarketViewNavigation />
          <div className="flex flex-col bg-white rounded-lg shadow-sm p-4">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded"
                >
                  Đóng
                </button>
              </div>
            )}
            {transactionStatus === "processing" && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-600">Đang xử lý giao dịch...</p>
              </div>
            )}
            
            <Outlet>{children}</Outlet>
            
            {selectedItem && isModalOpen && (
              React.createElement(PurchaseModal as any, {
                isOpen: isModalOpen,
                onClose: handleCloseModal,
                item: selectedItem,
                userCoins: auth.user?.coins?.amount || 0,
                onConfirm: confirmPurchase,
                transactionStatus: transactionStatus
              })
            )}
          </div>
        </main>
      </MarketplaceContext.Provider>
    </div>
  );
}
