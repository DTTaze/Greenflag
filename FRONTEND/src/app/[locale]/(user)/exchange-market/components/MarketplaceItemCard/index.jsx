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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentStock, setCurrentStock] = useState(item.stock);
  const [currentStatus, setCurrentStatus] = useState(item.postStatus);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const { user } = useAuthStore();
  const { confirmPurchase, handlePurchase } = useContext(MarketplaceContext);

  const isOwnItem = user && (
    String(item.sellerId) === String(user.id) ||
    String(item.seller_id) === String(user.id) ||
    String(item.creatorId) === String(user.id) ||
    String(item.creator_id) === String(user.id) ||
    String(item.owner_id) === String(user.id) ||
    String(item.ownerId) === String(user.id)
  );

  const images = item.images && item.images.length > 0
    ? item.images
    : item.image
    ? [item.image]
    : ["/placeholder.svg"];

  useEffect(() => {
    setCurrentStock(item.stock);
    setCurrentStatus(item.postStatus);
  }, [item.stock, item.postStatus]);

  useEffect(() => {
    let intervalId;
    if (isHovered && images.length > 1) {
      intervalId = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % images.length);
      }, 1500);
    } else {
      setCurrentImgIndex(0);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHovered, images]);

  const handleEditClick = () => {
    onEdit(item);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border shadow-sm transition-all ${getStatusClass(
        currentStatus,
      )} group`}
    >
      <div>
        {/* Item Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
          <motion.img
            key={currentImgIndex}
            src={images[currentImgIndex]}
            alt={item.name}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {images.length > 1 && isHovered && (
            <div className="absolute bottom-2.5 left-0 right-0 z-20 flex justify-center gap-1.5 px-3">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    idx === currentImgIndex
                      ? "bg-white w-4"
                      : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
          {/* Status Badge for My Items */}
          {viewMode === "my_items" && currentStatus && (
            <div className="absolute top-3 left-3 z-20">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black tracking-wider uppercase shadow-md backdrop-blur-xs transition-all duration-300 group-hover:opacity-0 ${
                currentStatus === 'public' ? 'border-emerald-500/30 bg-emerald-600/95 text-white' :
                currentStatus === 'private' ? 'border-slate-500/30 bg-slate-600/95 text-white' :
                currentStatus === 'pending' ? 'border-amber-500/30 bg-amber-600/95 text-white' :
                currentStatus === 'rejected' ? 'border-rose-500/30 bg-rose-600/95 text-white' :
                'border-sky-500/30 bg-sky-600/95 text-white'
              }`}>
                {(() => {
                  const Icon = statusConfig[currentStatus]?.Icon || Clock;
                  return <Icon size={11} className="shrink-0" />;
                })()}
                {t("statuses." + currentStatus)}
              </span>
            </div>
          )}
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
        <div className={`p-5 pb-0 transition-all duration-300 group-hover:blur-xs ${showDetailsModal ? "blur-sm" : ""}`}>
          <h3 className="truncate text-sm leading-snug font-bold text-slate-800 dark:text-zinc-200 transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
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
          <p className="mt-3 line-clamp-2 min-h-[32px] text-xs leading-relaxed font-medium text-slate-600 dark:text-zinc-400">
            {item.description}
          </p>
        </div>
      </div>

      <div className={`p-5 ${(viewMode === "all_items" || viewMode === "redeem") ? "pb-14" : ""}`}>
        {/* Price and stock row */}
        <motion.div
          className={`flex items-center justify-between border-t border-emerald-100 dark:border-emerald-500/10 pt-4 transition-all duration-300 group-hover:blur-xs ${showDetailsModal ? "blur-sm" : ""}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-50/60 px-3 py-1.5 text-xs font-black text-amber-700 shadow-sm dark:border-amber-500/20 dark:from-amber-950/30 dark:to-amber-900/10 dark:text-amber-400">
            <span className="coin-value font-extrabold">{item.price}</span>
            <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
            {t("list.remaining", { count: currentStock })}
          </span>
        </motion.div>
      </div>

      {/* Hover action overlay with dynamic actions */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[1.5px]">
        {isOwnItem && viewMode !== "my_items" ? (
          <div className="flex flex-col items-center gap-2 px-4 text-center animate-fade-in">
            <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-600/95 px-3 py-1.5 text-[10px] font-black tracking-wider uppercase text-white shadow-md backdrop-blur-xs">
              Sản phẩm của bạn
            </span>
            <button
              onClick={() => setShowDetailsModal(true)}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-250 bg-white px-5 py-3 text-xs font-bold text-[#0B6E4F] shadow-md transition-all hover:bg-emerald-50 active:scale-95 dark:border-emerald-500/15 dark:bg-slate-900 dark:text-emerald-400 dark:hover:bg-slate-800"
            >
              <Eye size={15} />
              {t("list.detailsBtn")}
            </button>
          </div>
        ) : (
          <button
            onClick={handleDetailsClick}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-250 bg-white px-5 py-3 text-xs font-bold text-[#0B6E4F] shadow-md transition-all hover:bg-emerald-50 active:scale-95 dark:border-emerald-500/15 dark:bg-slate-900 dark:text-emerald-400 dark:hover:bg-slate-800"
          >
            <Eye size={15} />
            {viewMode === "my_items"
              ? t("list.detailsBtn")
              : viewMode === "redeem"
              ? t("list.redeemBtn")
              : t("list.detailsBtn")}
          </button>
        )}

        {viewMode === "my_items" && (
          <div className="flex gap-2">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3.5 py-1.5 text-xs font-bold text-blue-600 shadow-sm transition-all hover:bg-blue-50 active:scale-90 dark:border-zinc-800 dark:bg-zinc-950 dark:text-blue-400 dark:hover:bg-zinc-900"
            >
              <Pencil size={12} />
              {t("common.edit")}
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-1.5 text-xs font-bold text-red-650 shadow-sm transition-all hover:bg-red-50 active:scale-90 dark:border-zinc-800 dark:bg-zinc-950 dark:text-red-400 dark:hover:bg-zinc-900"
            >
              <Trash2 size={12} />
              {t("common.delete")}
            </button>
          </div>
        )}
      </div>

      {/* Edit/Delete Buttons for my_items (Visible on non-hover / mobile) */}
      {viewMode === "my_items" && (
        <div className="mx-5 mb-5 flex items-center justify-end gap-2.5 border-t border-emerald-100 pt-3 dark:border-emerald-500/10">
          <button
            onClick={handleEditClick}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-emerald-200 bg-white text-blue-600 shadow-sm transition-all hover:bg-emerald-50/15 hover:text-blue-800 active:scale-90 dark:border-emerald-500/15 dark:bg-slate-900"
            aria-label="Edit item"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDeleteClick}
            className="text-red-650 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-emerald-200 bg-white shadow-sm transition-all hover:bg-emerald-50/15 hover:text-red-800 active:scale-90 dark:border-emerald-500/15 dark:bg-slate-900"
            aria-label="Delete item"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

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
            handlePurchase(item);
          }}
          fetchItems={fetchItems}
        />
      )}
    </motion.div>
  );
};

export default MarketplaceItemCard;