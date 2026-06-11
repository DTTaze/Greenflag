import { format } from "date-fns";
import { Calendar, Coins, Tag, User, X } from "lucide-react";

import { statusConfig } from "../MarketplaceItemCard";

export default function DetailsModal({
  isOpen,
  onClose,
  item,
  getCategoryDisplayName,
  isEditMode,
  onEdit,
  onPurchase,
}) {
  if (!isOpen) return null;

  const handleEdit = () => {
    if (!item || !item.id) {
      console.error("Invalid item or item ID:", item);
      alert("Không thể sửa sản phẩm do thiếu thông tin!");
      return;
    }
    onEdit(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 text-left align-middle shadow-2xl transition-all duration-300 dark:border-zinc-800/80 dark:bg-zinc-900/95">
          {/* Decorative Glow */}
          <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 transition-all duration-200 hover:bg-gray-100 hover:text-slate-800 dark:hover:bg-slate-800/85 dark:hover:text-white"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <h3 className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-450 dark:to-teal-300 bg-clip-text pr-8 text-xl font-bold text-transparent">
            Chi tiết sản phẩm
          </h3>

          <div className="mt-5 space-y-5">
            {/* Image Container with Glow */}
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="h-52 w-full transform object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Info Grid */}
            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-semibold tracking-wide text-slate-900 dark:text-white">
                  {item.name}
                </h4>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-650 dark:text-emerald-400">
                    <Tag size={12} />
                    {getCategoryDisplayName(item.category)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="rounded-xl border border-gray-200/50 bg-gray-50/50 p-3 text-sm leading-relaxed text-slate-650 dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:text-zinc-300">
                {item.description}
              </p>

              {/* Price & Status */}
              <div className="flex items-center justify-between rounded-xl border border-gray-200/50 bg-gray-50/50 dark:border-zinc-800/50 dark:bg-zinc-950/40 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-zinc-400">Giá đổi:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {item.price}
                    </span>
                    <Coins className="h-5 w-5 animate-pulse text-amber-500 dark:text-amber-400" />
                  </div>
                </div>

                {isEditMode && item.postStatus && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Trạng thái:</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusConfig[item.postStatus]?.color ||
                        "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {statusConfig[item.postStatus]?.name || "Không xác định"}
                    </span>
                  </div>
                )}
              </div>

              {/* Seller / Creation Date */}
              <div className="space-y-1.5 border-t border-gray-100 dark:border-zinc-800/60 pt-2.5 text-xs text-slate-500 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <User size={13} className="text-emerald-600/70 dark:text-emerald-400/70" />
                  <span>
                    Người bán:{" "}
                    <strong className="font-semibold text-slate-700 dark:text-zinc-350">
                      {item.seller || "Không xác định"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-emerald-600/70 dark:text-emerald-400/70" />
                  <span>
                    Ngày đăng:{" "}
                    <strong className="font-semibold text-slate-700 dark:text-zinc-350">
                      {item.createdAt &&
                        format(new Date(item.createdAt), "dd/MM/yyyy")}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3 border-t border-gray-150 dark:border-zinc-800/60 pt-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/80 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-zinc-300 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white"
              onClick={onClose}
            >
              Đóng
            </button>
            {isEditMode ? (
              <button
                type="button"
                className="inline-flex justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 active:scale-95"
                onClick={handleEdit}
              >
                Chỉnh sửa
              </button>
            ) : (
              <button
                type="button"
                disabled={item.stock <= 0}
                className={`inline-flex justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200 ${
                  item.stock <= 0
                    ? "bg-slate-400 text-slate-200 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed"
                    : "bg-emerald-600 shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95"
                }`}
                onClick={onPurchase}
              >
                {item.stock <= 0 ? "Đang chờ nhập thêm hàng" : "Đổi quà"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
