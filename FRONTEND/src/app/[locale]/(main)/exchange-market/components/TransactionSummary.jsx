import { Coins } from "lucide-react";
import React from "react";

export default function TransactionSummary({
  item,
  quantity,
  shippingFee,
  totalCost,
  userCoins,
  canPurchase,
}) {
  return (
    <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Giá sản phẩm:</span>
        <div className="flex items-center font-medium text-emerald-600">
          <span>{item.price * quantity}</span>
          <Coins className="ml-1 h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-gray-600">Phí giao hàng:</span>
        <span className="font-medium text-emerald-600">{shippingFee} VND</span>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-emerald-100 pt-2">
        <span className="text-gray-600">Tổng giá sản phẩm:</span>
        <div className="flex items-center font-medium text-emerald-600">
          <span>{totalCost}</span>
          <Coins className="ml-1 h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-gray-600">Số dư hiện tại:</span>
        <div className="flex items-center font-medium text-emerald-600">
          <span>{userCoins}</span>
          <Coins className="ml-1 h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-emerald-100 pt-2">
        <span className="text-gray-600">Số dư sau giao dịch:</span>
        <div
          className={`flex items-center font-medium ${
            canPurchase ? "text-emerald-600" : "text-red-500"
          }`}
        >
          <span>{userCoins - totalCost}</span>
          <Coins className="ml-1 h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
