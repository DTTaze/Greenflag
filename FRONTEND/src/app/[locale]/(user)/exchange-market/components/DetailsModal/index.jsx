import { format } from "date-fns";
import { Calendar, Coins, Tag, User, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";

import { statusConfig } from "../MarketplaceItemCard";

export default function DetailsModal({
  isOpen,
  onClose,
  item,
  isEditMode,
  onEdit,
  onPurchase,
}) {
  const t = useTranslations("exchangeMarket");

  if (!item) return null;

  const handleEdit = () => {
    if (!item || !item.id) {
      console.error("Invalid item or item ID:", item);
      alert(t("errors.missingEditInfo"));
      return;
    }
    onEdit(item);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="z-50 flex max-h-[90vh] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white p-0 shadow-2xl sm:max-w-2xl dark:border-zinc-800/80 dark:bg-zinc-900/95"
      >
        <div className="flex max-h-[90vh] flex-col overflow-hidden md:flex-row">
          {/* Left Panel: Image Section */}
          <div className="relative flex h-52 w-full shrink-0 items-center justify-center overflow-hidden bg-slate-900 md:h-auto md:w-[45%]">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r" />

            {/* Close Button for Mobile (Floating) */}
            <button
              onClick={onClose}
              className="absolute top-3 left-3 z-20 rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/60 active:scale-95 md:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* Right Panel: Content Section */}
          <div className="flex w-full flex-col overflow-hidden bg-white md:w-[55%] dark:bg-zinc-900">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-5 dark:border-zinc-800">
              <DialogTitle className="dark:from-emerald-450 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-lg font-bold text-transparent dark:to-teal-300">
                {t("detailsModal.title")}
              </DialogTitle>
              <button
                onClick={onClose}
                className="hidden items-center justify-center rounded-full p-1.5 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 md:flex dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {/* Product Title & Badge */}
              <div className="space-y-2">
                <h1 className="text-xl leading-tight font-extrabold tracking-tight text-slate-950 dark:text-white">
                  {item.name}
                </h1>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-emerald-650 dark:text-emerald-450 inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold">
                    <Tag size={11} />
                    {item.category
                      ? t("categories." + item.category)
                      : t("categories.unknown")}
                  </span>
                  {isEditMode && item.postStatus && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                        statusConfig[item.postStatus]?.color ||
                        "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {t("statuses." + item.postStatus)}
                    </span>
                  )}
                </div>
              </div>

              {/* Pricing Banner */}
              <div className="border-amber-250 flex items-center justify-between rounded-xl border bg-amber-50/15 p-4 shadow-xs dark:border-amber-500/15 dark:bg-amber-950/10">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                    {t("detailsModal.priceLabel")}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                      {item.price}
                    </span>
                    <Coins className="h-5 w-5 animate-pulse text-amber-500 dark:text-amber-400" />
                  </div>
                </div>
                <div className="space-y-0.5 text-right">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                    Số lượng còn lại
                  </span>
                  <div className="text-slate-850 dark:text-zinc-250 text-base font-bold">
                    {item.stock}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                  Mô tả sản phẩm
                </h3>
                <p className="text-slate-650 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs leading-relaxed whitespace-pre-wrap dark:border-zinc-800/40 dark:bg-zinc-950/35 dark:text-zinc-300">
                  {item.description || "Không có mô tả cho sản phẩm này."}
                </p>
              </div>

              {/* Detailed Meta Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Seller Info */}
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/30 p-3 shadow-xs dark:border-zinc-800/50 dark:bg-zinc-950/15">
                  <div className="shrink-0 rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                    <User size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                      {t("detailsModal.sellerLabel")}
                    </div>
                    <div className="text-slate-850 mt-0.5 text-xs font-semibold dark:text-zinc-300">
                      {item.seller || t("categories.unknown")}
                    </div>
                  </div>
                </div>

                {/* Date Info */}
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/30 p-3 shadow-xs dark:border-zinc-800/50 dark:bg-zinc-950/15">
                  <div className="shrink-0 rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                      {t("detailsModal.dateLabel")}
                    </div>
                    <div className="text-slate-850 mt-0.5 text-xs font-semibold dark:text-zinc-300">
                      {item.createdAt &&
                        format(new Date(item.createdAt), "dd/MM/yyyy")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="dark:border-zinc-850 flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-slate-50/50 p-5 dark:bg-zinc-950/40">
              <button
                type="button"
                className="text-slate-650 inline-flex justify-center rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 text-xs font-bold transition-all hover:bg-slate-50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
                onClick={onClose}
              >
                {t("common.close")}
              </button>

              {isEditMode ? (
                <button
                  type="button"
                  className="inline-flex justify-center rounded-xl bg-blue-600 px-4.5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-95"
                  onClick={handleEdit}
                >
                  {t("common.edit")}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={item.stock <= 0}
                  className={`inline-flex justify-center rounded-xl px-4.5 py-2.5 text-xs font-bold text-white transition-all ${
                    item.stock <= 0
                      ? "dark:bg-zinc-850 cursor-not-allowed bg-slate-400 text-slate-200 dark:text-zinc-500"
                      : "bg-emerald-600 shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95"
                  }`}
                  onClick={onPurchase}
                >
                  {item.stock <= 0
                    ? t("list.outOfStockBtn")
                    : t("list.redeemBtn")}
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
