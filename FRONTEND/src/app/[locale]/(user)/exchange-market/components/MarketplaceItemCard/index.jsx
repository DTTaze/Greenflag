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
import { useTranslations } from "next-intl";
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
      "border-emerald-200 bg-white hover:border-emerald-350 hover:shadow-emerald-50/50 dark:border-emerald-500/15 dark:bg-slate-900/60 dark:hover:border-emerald-500/25",
    private: "border-emerald-100 bg-gray-50/50 dark:border-emerald-500/10 dark:bg-slate-900/40",
    pending: "border-amber-150 bg-amber-50/10 dark:border-amber-500/20 dark:bg-amber-950/10",
    rejected: "border-red-150 bg-red-50/10 dark:border-red-500/20 dark:bg-red-950/10",
    draft: "border-emerald-200 bg-slate-50/40 dark:border-emerald-500/10 dark:bg-slate-900/40",
  };
  return statusClasses[status] || statusClasses.draft;
};

const MarketplaceItemCard = ({
  item,
  onEdit,
  onDelete,
  viewMode = "all_items",
  fetchItems,
}) => {
  const t = useTranslations("exchangeMarket");
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
        alert(t("errors.loginRequired"));
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
      className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border p-5 shadow-sm transition-all ${getStatusClass(
        currentStatus,
      )} group`}
    >
      <div>
        {/* Item Image */}
        <motion.div
          className={`relative mb-5 aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 shadow-sm transition-all ${
            viewMode === "all_items" || viewMode === "redeem"
              ? "group-hover:blur-sm"
              : ""
          } ${showPurchaseModal || showDetailsModal ? "blur-sm" : ""}`}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500"
          />
        </motion.div>

        {/* Item Details */}
        <motion.div
          className={`mb-4 transition-all duration-300 ${
            viewMode === "all_items" || viewMode === "redeem"
              ? "group-hover:blur-sm"
              : ""
          } ${showPurchaseModal || showDetailsModal ? "blur-sm" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="truncate text-sm leading-snug font-bold text-slate-800 transition-colors group-hover:text-emerald-700">
            {item.name}
          </h3>
          <motion.span
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-2 inline-block rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-emerald-50/70 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-[#0B6E4F] uppercase shadow-sm dark:border-emerald-500/20 dark:from-emerald-950/35 dark:to-emerald-900/10 dark:text-emerald-300"
          >
            {item.category
              ? t("categories." + item.category)
              : t("categories.unknown")}
          </motion.span>
          <p className="mt-3 line-clamp-2 min-h-[32px] text-xs leading-relaxed font-medium text-slate-600">
            {item.description}
          </p>
        </motion.div>
      </div>

      <div>
        {/* Price and stock row */}
        <motion.div
          className={`flex items-center justify-between border-t border-emerald-100 dark:border-emerald-500/10 pt-4 transition-all duration-300 ${
            viewMode === "all_items" || viewMode === "redeem"
              ? "group-hover:blur-sm"
              : ""
          } ${showPurchaseModal || showDetailsModal ? "blur-sm" : ""}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-50/60 px-3 py-1.5 text-xs font-black text-amber-700 shadow-sm dark:border-amber-500/20 dark:from-amber-950/30 dark:to-amber-900/10 dark:text-amber-400"
            whileHover={{ scale: 1.05 }}
          >
            <span className="coin-value font-extrabold">{item.price}</span>
            <Coins className="h-4 w-4 text-amber-600" />
          </motion.div>
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            {t("list.remaining", { count: currentStock })}
          </span>
        </motion.div>

        {/* Hover action overlay for all_items/redeem */}
        {(viewMode === "all_items" || viewMode === "redeem") && (
          <div className="backdrop-blur-3xs absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={handleDetailsClick}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-250 bg-white px-5 py-3 text-xs font-bold text-[#0B6E4F] shadow-md transition-all hover:bg-emerald-50/20 active:scale-95 dark:border-emerald-500/15 dark:bg-slate-900 dark:text-emerald-400 dark:hover:bg-slate-800"
            >
              <Eye size={15} />
              {viewMode === "redeem"
                ? t("list.redeemBtn")
                : t("list.detailsBtn")}
            </button>
          </div>
        )}

        {/* Edit/Delete Buttons for my_items */}
        {viewMode === "my_items" && (
          <div className="mt-3.5 flex items-center justify-end gap-2.5 border-t border-emerald-100 pt-3 dark:border-emerald-500/10">
            <button
              onClick={handleEditClick}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-emerald-200 bg-white text-blue-600 shadow-2xs transition-all hover:bg-emerald-50/15 hover:text-blue-800 active:scale-90 dark:border-emerald-500/15 dark:bg-slate-900"
              aria-label="Edit item"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-red-650 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-emerald-200 bg-white shadow-2xs transition-all hover:bg-emerald-50/15 hover:text-red-800 active:scale-90 dark:border-emerald-500/15 dark:bg-slate-900"
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
          title={t("list.deleteTitle")}
          message={t("list.deleteMessage")}
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
