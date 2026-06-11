import { motion } from "framer-motion";
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
    public:
      "border-gray-250 bg-white hover:border-emerald-250 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-green-500/50",
    private: "border-gray-200 bg-gray-50/50 dark:border-zinc-800/80 dark:bg-zinc-900/50",
    pending: "border-amber-100 bg-amber-50/20 dark:border-amber-900/30 dark:bg-zinc-900",
    rejected: "border-red-100 bg-red-50/20 dark:border-red-900/30 dark:bg-zinc-900",
    draft: "border-slate-200 bg-slate-50/40 dark:border-zinc-850 dark:bg-zinc-900",
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
    setCurrentStock(item.stock);
    setCurrentStatus(item.postStatus);
  }, [item.stock, item.postStatus]);

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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border shadow-sm transition-all ${getStatusClass(
        currentStatus,
      )} group`}
    >
      <div>
        {/* Item Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Frosted glass overlay when Out of stock */}
          {currentStock <= 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900/50 backdrop-blur-[2px]">
              <span className="rounded-lg bg-black/60 px-3 py-1.5 text-xs font-black tracking-wide text-white uppercase">
                Tạm hết
              </span>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className={`p-5 pb-0 ${showPurchaseModal || showDetailsModal ? "blur-sm" : ""}`}>
          <h3 className="truncate text-sm leading-snug font-bold text-slate-800 dark:text-zinc-200 transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
            {item.name}
          </h3>
          <span className="mt-2 inline-block rounded-xl border border-emerald-100 dark:border-zinc-800 bg-gradient-to-r from-emerald-50 to-emerald-50/70 dark:from-zinc-800 dark:to-zinc-800/70 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-[#0B6E4F] dark:text-emerald-400 uppercase shadow-sm">
            {getCategoryDisplayName(item.category)}
          </span>
          <p className="mt-3 line-clamp-2 min-h-[32px] text-xs leading-relaxed font-medium text-slate-600 dark:text-zinc-400">
            {item.description}
          </p>
        </div>
      </div>

      <div className={`p-5 ${(viewMode === "all_items" || viewMode === "redeem") ? "pb-14" : ""}`}>
        {/* Price and stock row */}
        <div className="flex items-center justify-between border-t border-emerald-100/40 dark:border-zinc-800/80 pt-4">
          <div className="flex items-center gap-1.5 rounded-xl border border-amber-100 dark:border-amber-900/40 bg-gradient-to-r from-amber-50 to-amber-50/60 dark:from-amber-950/20 dark:to-amber-950/10 px-3 py-1.5 text-xs font-black text-amber-700 dark:text-amber-400 shadow-sm">
            <span className="coin-value font-extrabold">{item.price}</span>
            <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
            Còn: {currentStock}
          </span>
        </div>

        {/* Hover action slide-up button for all_items/redeem */}
        {(viewMode === "all_items" || viewMode === "redeem") && (
          <button
            onClick={handleDetailsClick}
            className="absolute bottom-0 left-0 right-0 z-20 w-full cursor-pointer bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 py-3 text-center text-xs font-bold text-white transition-all duration-300 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          >
            {viewMode === "redeem" ? "Đổi ngay" : "Chi tiết"}
          </button>
        )}

        {/* Edit/Delete Buttons for my_items */}
        {viewMode === "my_items" && (
          <div className="mt-3.5 flex items-center justify-end gap-2.5 border-t border-gray-100 dark:border-zinc-800/80 pt-3">
            <button
              onClick={handleEditClick}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/85 text-blue-600 dark:text-blue-400 shadow-2xs transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-blue-800 dark:hover:text-blue-300 active:scale-90"
              aria-label="Edit item"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-red-650 dark:text-red-400 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/85 shadow-2xs transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-red-800 dark:hover:text-red-300 active:scale-90"
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
    </motion.div>
  );
};

export default MarketplaceItemCard;
