import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Coins, ShoppingBag, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import ShippingInfoDisplay from "../ShippingInfoDisplay";
import ShippingInfoModal from "../ShippingInfoModal";
import TransactionSummary from "../TransactionSummary";
import usePurchaseModal from "./hooks/usePurchaseModal";

export default function PurchaseModal({
  isOpen,
  onClose,
  item,
  userCoins,
  onConfirm,
}) {
  const t = useTranslations("exchangeMarket");

  const {
    quantity,
    setQuantity,
    isProcessing,
    shippingInfo,
    shippingFee,
    isShippingModalOpen,
    isLoadingShipping,
    currentStock,
    modalRef,
    shippingModalRef,
    totalCost,
    canPurchase,
    maxQuantity,
    handleQuantityChange,
    handleConfirm,
    handleChangeShipping,
    handleSelectShipping,
    setIsShippingModalOpen,
  } = usePurchaseModal({ isOpen, onClose, item, userCoins, onConfirm });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            ref={modalRef}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800/85 bg-slate-900/95 shadow-2xl"
          >
            {/* Decorative Glow elements */}
            <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

            {/* Header */}
            <div className="relative border-b border-emerald-500/10 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 px-6 py-5 text-white">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 rounded-full p-1 text-emerald-100 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="flex items-center text-lg font-bold tracking-wide">
                <ShoppingBag className="mr-2 h-5 w-5 animate-pulse text-emerald-200" />
                {t("purchaseModal.txConfirmTitle")}
              </h2>
              <p className="mt-1 text-xs text-emerald-100/80">
                {t("purchaseModal.txConfirmDesc")}
              </p>
            </div>

            {/* Content */}
            <div className="relative space-y-5 p-6">
              <ShippingInfoDisplay
                isLoadingShipping={isLoadingShipping}
                shippingInfo={shippingInfo}
                onChangeShipping={handleChangeShipping}
              />

              {/* Item Details */}
              <div className="flex gap-4 border-b border-slate-800/80 pt-1 pb-5">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {item.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex items-center text-sm font-bold text-amber-400">
                      <span>{item.price}</span>
                      <Coins className="ml-1 h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {t("purchaseModal.remainingLabel", {
                        count: currentStock,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-950/40 px-3 py-2.5">
                <span className="text-sm text-slate-300">
                  {t("purchaseModal.quantityLabel")}
                </span>
                <div className="flex items-center overflow-hidden rounded-md border border-slate-800 bg-slate-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-8 w-8 items-center justify-center text-slate-400 transition-colors hover:bg-slate-800/80 hover:text-white"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="h-8 w-12 [appearance:textfield] border-x border-slate-800 bg-transparent text-center text-sm font-medium text-white focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    min="1"
                    max={maxQuantity}
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(maxQuantity, quantity + 1))
                    }
                    className="flex h-8 w-8 items-center justify-center text-slate-400 transition-colors hover:bg-slate-800/80 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <TransactionSummary
                item={item}
                quantity={quantity}
                shippingFee={shippingFee}
                totalCost={totalCost}
                userCoins={userCoins}
                canPurchase={canPurchase}
              />

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-950/80 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!canPurchase || isProcessing || !shippingInfo}
                  className={`flex flex-1 items-center justify-center rounded-lg py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 ${
                    canPurchase && !isProcessing && shippingInfo
                      ? "bg-emerald-600 shadow-emerald-600/10 hover:bg-emerald-500 active:scale-[0.98]"
                      : "cursor-not-allowed border border-slate-700/30 bg-slate-800 text-slate-500"
                  }`}
                >
                  {isProcessing ? (
                    <span className="animate-pulse">
                      {t("purchaseModal.btnProcessing")}
                    </span>
                  ) : !canPurchase ? (
                    t("purchaseModal.btnIneligible")
                  ) : !shippingInfo ? (
                    t("purchaseModal.btnSelectShipping")
                  ) : (
                    <>
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      {t("purchaseModal.btnConfirm")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Shipping Info Modal */}
          {isShippingModalOpen && (
            <ShippingInfoModal
              isOpen={isShippingModalOpen}
              onClose={() => setIsShippingModalOpen(false)}
              onSelect={handleSelectShipping}
              ref={shippingModalRef}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
