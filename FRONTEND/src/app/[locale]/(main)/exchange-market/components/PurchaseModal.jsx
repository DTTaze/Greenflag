import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Coins, ShoppingBag, X } from "lucide-react";
import React from "react";

import ShippingInfoDisplay from "./ShippingInfoDisplay";
import ShippingInfoModal from "./ShippingInfoModal";
import TransactionSummary from "./TransactionSummary";
import usePurchaseModal from "./usePurchaseModal";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            ref={modalRef}
            className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="relative bg-emerald-600 px-6 py-4 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white transition-colors hover:text-emerald-100"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="flex items-center text-xl font-semibold">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Xác nhận trao đổi
              </h2>
              <p className="mt-1 text-sm text-emerald-100">
                Vui lòng xác nhận thông tin giao dịch của bạn
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <ShippingInfoDisplay
                isLoadingShipping={isLoadingShipping}
                shippingInfo={shippingInfo}
                onChangeShipping={handleChangeShipping}
              />

              {/* Item Details */}
              <div className="flex items-center gap-4 border-b border-gray-100 py-2 pb-4">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {item.name}
                  </h3>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {item.description}
                  </p>
                  <div className="mt-1 flex items-center text-emerald-600">
                    <span className="font-semibold">{item.price}</span>
                    <Coins className="ml-1 h-4 w-4" />
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Còn lại: {currentStock} sản phẩm
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-gray-700">Số lượng:</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-300 bg-gray-50 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="h-8 w-12 border-y border-gray-300 text-center focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    min="1"
                    max={maxQuantity}
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(maxQuantity, quantity + 1))
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-r-md border border-gray-300 bg-gray-50 hover:bg-gray-100"
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
              <div className="mt-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!canPurchase || isProcessing || !shippingInfo}
                  className={`flex flex-1 items-center justify-center rounded-lg py-2.5 font-medium text-white ${
                    canPurchase && !isProcessing && shippingInfo
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "cursor-not-allowed bg-gray-400"
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
                      <CheckCircle className="mr-1 h-4 w-4" />
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
