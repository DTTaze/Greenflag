import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Coins, ShoppingBag, X } from "lucide-react";
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
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-slate-900/95 border border-slate-800/85 shadow-2xl"
          >
            {/* Decorative Glow elements */}
            <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

            {/* Header */}
            <div className="relative bg-gradient-to-r from-emerald-600/90 to-teal-600/90 px-6 py-5 border-b border-emerald-500/10 text-white">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-emerald-100 hover:text-white rounded-full p-1 hover:bg-white/10 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="flex items-center text-lg font-bold tracking-wide">
                <ShoppingBag className="mr-2 h-5 w-5 text-emerald-200 animate-pulse" />
                Xác nhận trao đổi
              </h2>
              <p className="mt-1 text-xs text-emerald-100/80">
                Vui lòng xác nhận thông tin giao dịch của bạn
              </p>
            </div>

            {/* Content */}
            <div className="relative p-6 space-y-5">
              
              <ShippingInfoDisplay
                isLoadingShipping={isLoadingShipping}
                shippingInfo={shippingInfo}
                onChangeShipping={handleChangeShipping}
              />

              {/* Item Details */}
              <div className="flex gap-4 border-b border-slate-800/80 pb-5 pt-1">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {item.name}
                  </h3>
                  <p className="line-clamp-2 text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex items-center text-amber-400 font-bold text-sm">
                      <span>{item.price}</span>
                      <Coins className="ml-1 h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Còn lại: {currentStock} sản phẩm
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between py-1 bg-slate-950/40 px-3 py-2.5 rounded-lg border border-slate-800/50">
                <span className="text-sm text-slate-300">Số lượng:</span>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="h-8 w-12 bg-transparent text-center text-sm font-medium text-white border-x border-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="1"
                    max={maxQuantity}
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(maxQuantity, quantity + 1))
                    }
                    className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
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
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-950/80 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!canPurchase || isProcessing || !shippingInfo}
                  className={`flex flex-1 items-center justify-center rounded-lg py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 ${
                    canPurchase && !isProcessing && shippingInfo
                      ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10 active:scale-[0.98]"
                      : "cursor-not-allowed bg-slate-800 text-slate-500 border border-slate-700/30"
                  }`}
                >
                  {isProcessing ? (
                    <span className="animate-pulse">Đang xử lý...</span>
                  ) : !canPurchase ? (
                    "Không đủ điều kiện"
                  ) : !shippingInfo ? (
                    "Chọn thông tin giao hàng"
                  ) : (
                    <>
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      Xác nhận
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
