import { format } from "date-fns";
import { Coins, X, User, Calendar, Tag, ShieldCheck } from "lucide-react";

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
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900/95 border border-slate-800/80 p-6 text-left align-middle shadow-2xl transition-all duration-300">
          
          {/* Decorative Glow */}
          <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all duration-200"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <h3 className="pr-8 text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Chi tiết sản phẩm
          </h3>

          <div className="mt-5 space-y-5">
            {/* Image Container with Glow */}
            <div className="relative group overflow-hidden rounded-xl border border-slate-800">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="h-52 w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            </div>

            {/* Info Grid */}
            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-semibold text-white tracking-wide">{item.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                    <Tag size={12} />
                    {getCategoryDisplayName(item.category)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                {item.description}
              </p>

              {/* Price & Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Giá đổi:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-amber-400">{item.price}</span>
                    <Coins className="h-5 w-5 text-amber-400 animate-pulse" />
                  </div>
                </div>

                {isEditMode && item.postStatus && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">Trạng thái:</span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        statusConfig[item.postStatus]?.color || "text-slate-400 bg-slate-800"
                      }`}
                    >
                      {statusConfig[item.postStatus]?.name || "Không xác định"}
                    </span>
                  </div>
                )}
              </div>

              {/* Seller / Creation Date */}
              <div className="space-y-1.5 pt-2 text-xs text-slate-400 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <User size={13} className="text-emerald-500/70" />
                  <span>Người bán: <strong className="text-slate-300 font-medium">{item.seller || "Không xác định"}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-emerald-500/70" />
                  <span>
                    Ngày đăng:{" "}
                    <strong className="text-slate-300 font-medium">
                      {item.createdAt && format(new Date(item.createdAt), "dd/MM/yyyy")}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-800/60 pt-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
              onClick={onClose}
            >
              Đóng
            </button>
            {isEditMode ? (
              <button
                type="button"
                className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-95 transition-all duration-200"
                onClick={handleEdit}
              >
                Chỉnh sửa
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all duration-200"
                onClick={onPurchase}
              >
                Mua
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
