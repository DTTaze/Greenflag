import {
  CheckCircle,
  ClipboardEdit,
  Clock,
  Coins,
  Eye,
  EyeOff,
  FileWarning,
  Pencil,
  Trash2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";

import DeleteConfirmModal from "@/src/components/common/DeleteConfirmModal";
import { socket } from "@/src/lib/socket";
import { useAuthStore } from "@/src/store/auth/authStore";

import { MarketplaceContext } from "../../layout";
import DetailsModal from "../DetailsModal";
import PurchaseModal from "../PurchaseModal";

export const statusConfig = {
  public: { name: "Đang hiển thị", color: "text-green-605", Icon: CheckCircle },
  private: { name: "Đã ẩn", color: "text-gray-500", Icon: EyeOff },
  pending: { name: "Chờ duyệt", color: "text-amber-600", Icon: Clock },
  rejected: { name: "Bị từ chối", color: "text-red-500", Icon: FileWarning },
  draft: { name: "Tin nháp", color: "text-blue-500", Icon: ClipboardEdit },
};

const getStatusClass = (status) => {
  const statusClasses = {
    public: "border-emerald-100 bg-white hover:border-emerald-250 hover:shadow-emerald-50/50",
    private: "border-gray-200 bg-gray-50/50",
    pending: "border-amber-100 bg-amber-50/20",
    rejected: "border-red-100 bg-red-50/20",
    draft: "border-slate-200 bg-slate-50/40",
  };
  return statusClasses[status] || statusClasses.draft;
};

const getCategoryDisplayName = (key) => {
  const categories = {
    handicraft: "Đồ thủ công",
    recycled: "Đồ tái chế",
    organic: "Sản phẩm hữu cơ",
    plants: "Cây trồng",
    other: "Khác",
  };
  return categories[key] || "Không xác định";
};

const MarketplaceItemCard = ({
  item,
  onEdit,
  onDelete,
  viewMode = "all_items",
  fetchItems,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentStock, setCurrentStock] = useState(item.stock);
  const [currentStatus, setCurrentStatus] = useState(item.postStatus);
  const { user } = useAuthStore();
  const { confirmPurchase, handlePurchase } = useContext(MarketplaceContext);

  useEffect(() => {
    socket.emit("join-item-room", item.id);

    socket.on("stock-update", (data) => {
      if (data.itemId === item.id) {
        setCurrentStock(data.stock);
        setCurrentStatus(data.status);
      }
    });

    return () => {
      socket.emit("leave-item-room", item.id);
      socket.off("stock-update");
    };
  }, [item.id]);

  const handleEditClick = () => {
    setShowDetailsModal(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDelete(item.id);
    setShowDeleteModal(false);
    if (fetchItems) fetchItems();
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleDetailsClick = () => {
    if (viewMode === "redeem") {
      if (!user) {
        alert("Vui lòng đăng nhập để thực hiện giao dịch!");
        return;
      }
      handlePurchase(item);
      setShowPurchaseModal(true);
    } else {
      setShowDetailsModal(true);
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4.5 shadow-2xs transition-all duration-300 hover:translate-y-[-3px] hover:shadow-md ${getStatusClass(
        currentStatus,
      )} group`}
    >
      <div>
        {/* Item Image */}
        <div
          className={`relative mb-4.5 aspect-video w-full overflow-hidden rounded-xl bg-gray-50 transition-all duration-300 ${
            viewMode === "all_items" || viewMode === "redeem"
              ? "group-hover:blur-xs"
              : ""
          } ${showPurchaseModal || showDetailsModal ? "blur-xs" : ""}`}
        >
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Item Details */}
        <div
          className={`mb-4 transition-all duration-300 ${
            viewMode === "all_items" || viewMode === "redeem"
              ? "group-hover:blur-xs"
              : ""
          } ${showPurchaseModal || showDetailsModal ? "blur-xs" : ""}`}
        >
          <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-emerald-800 transition-colors truncate">
            {item.name}
          </h3>
          <span className="inline-block rounded-lg bg-emerald-50 px-2 py-0.5 mt-1 text-[10px] font-extrabold uppercase tracking-wide border border-emerald-100 text-[#0B6E4F]">
            {getCategoryDisplayName(item.category)}
          </span>
          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-gray-550 min-h-[32px]">
            {item.description}
          </p>
        </div>
      </div>

      <div>
        {/* Price and stock row */}
        <div
          className={`flex items-center justify-between border-t border-gray-100 pt-3 transition-all duration-300 ${
            viewMode === "all_items" || viewMode === "redeem"
              ? "group-hover:blur-xs"
              : ""
          } ${showPurchaseModal || showDetailsModal ? "blur-xs" : ""}`}
        >
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50 px-2 py-0.5 text-xs font-black text-amber-700">
            <span className="coin-value font-extrabold">{item.price}</span>
            <Coins className="h-4 w-4 text-amber-600" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Còn lại: {currentStock}
          </span>
        </div>

        {/* Hover action overlay for all_items/redeem */}
        {(viewMode === "all_items" || viewMode === "redeem") && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-3xs rounded-2xl">
            <button
              onClick={handleDetailsClick}
              className="cursor-pointer flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs font-bold text-[#0B6E4F] shadow-md hover:bg-gray-50 active:scale-95 transition-all"
            >
              <Eye size={15} />
              {viewMode === "redeem" ? "Đổi quà" : "Chi tiết"}
            </button>
          </div>
        )}

        {/* Edit/Delete Buttons for my_items */}
        {viewMode === "my_items" && (
          <div className="mt-3.5 flex items-center justify-end gap-2.5 border-t border-gray-100 pt-3">
            <button
              onClick={handleEditClick}
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-blue-600 shadow-2xs hover:bg-gray-50 hover:text-blue-800 transition-all active:scale-90"
              aria-label="Edit item"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-red-650 shadow-2xs hover:bg-gray-50 hover:text-red-800 transition-all active:scale-90"
              aria-label="Delete item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Xóa sản phẩm"
          message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        />
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          item={item}
          userCoins={user?.coins?.amount || 0}
          onConfirm={(quantity, shippingInfo) => {
            confirmPurchase(quantity, shippingInfo);
            setShowPurchaseModal(false);
            if (fetchItems) fetchItems();
          }}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <DetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          item={item}
          getCategoryDisplayName={getCategoryDisplayName}
          isEditMode={viewMode === "my_items"}
          onEdit={onEdit}
          onPurchase={() => {
            setShowDetailsModal(false);
            setShowPurchaseModal(true);
          }}
          fetchItems={fetchItems}
        />
      )}
    </div>
  );
};

export default MarketplaceItemCard;
