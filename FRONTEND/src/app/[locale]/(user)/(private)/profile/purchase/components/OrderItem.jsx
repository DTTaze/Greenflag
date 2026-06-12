import { Coins } from "lucide-react";
import { useState } from "react";

import { statusStyles } from "./purchaseHelpers";

const OrderItem = ({ transaction, onClick, onCancel }) => {
  const item = transaction.item_snapshot;
  const [showShippingInfo, setShowShippingInfo] = useState(false);

  return (
    <div
      className="mb-4 cursor-pointer rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50"
      onClick={() => onClick(transaction)}
    >
      <div className="flex items-start justify-between">
        <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Người bán: {item.creator?.full_name || "Không xác định"}
        </div>
        <div className="mb-2 text-right">
          <span
            className={`rounded-xl px-3 py-1 text-xs font-bold ${
              statusStyles[transaction.status] || "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {transaction.status_label.toUpperCase()}
          </span>
        </div>
      </div>
      <hr className="border-zinc-100 dark:border-zinc-800/80 my-3" />
      <div className="my-4 flex items-center">
        <div className="flex-1">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{item.name}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Số lượng: {transaction.quantity || 1}
          </p>
          <p className="flex items-center text-sm text-zinc-600 dark:text-zinc-300 mt-1">
            Đơn giá: {(item.price || transaction.total_price).toLocaleString()}{" "}
            <Coins className="ml-1 h-4 w-4 text-brand-emerald" />
          </p>
        </div>
      </div>
      <hr className="border-zinc-100 dark:border-zinc-800/80 my-3" />
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          {transaction.status === "delivered" && (
            <button
              className="rounded-2xl bg-brand-emerald px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                /* Handle confirm receipt */
              }}
            >
              Xác nhận đã nhận
            </button>
          )}
          {transaction.status === "pending" && (
            <button
              className="rounded-2xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onCancel(transaction.id);
              }}
            >
              Hủy đơn hàng
            </button>
          )}
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end font-bold text-zinc-900 dark:text-zinc-150">
            Thành tiền: {transaction.total_price.toLocaleString()}{" "}
            <Coins className="ml-1 h-4 w-4 text-brand-emerald" />
          </p>
        </div>
      </div>

      {(transaction.shipping_info ||
        [
          "ready_to_pick",
          "picking",
          "picked",
          "storing",
          "transporting",
          "sorting",
          "delivering",
        ].includes(transaction.status)) && (
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShippingInfo(!showShippingInfo);
            }}
            className="flex items-center text-xs font-bold text-brand-emerald hover:text-emerald-700"
          >
            {showShippingInfo
              ? "Ẩn thông tin vận chuyển"
              : "Xem thông tin vận chuyển"}
            <svg
              className={`ml-1 h-4 w-4 transform transition-transform ${
                showShippingInfo ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showShippingInfo && (
            <div className="mt-3 border-t border-zinc-100 dark:border-zinc-800/80 pt-3 space-y-1.5">
              <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Thông tin vận chuyển</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Đơn vị vận chuyển:{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{transaction.shipping_info?.carrier || "Không xác định"}</span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Mã vận đơn:{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{transaction.shipping_info?.tracking_number || "Không có"}</span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Dự kiến giao:{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {transaction.shipping_info?.estimated_delivery
                    ? new Date(
                        transaction.shipping_info.estimated_delivery,
                      ).toLocaleDateString("vi-VN")
                    : "Không xác định"}
                </span>
              </p>
              {transaction.shipping_info?.to_name && (
                <div className="mt-2 pt-2 border-t border-dashed border-zinc-150 dark:border-zinc-800/50 space-y-1">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Người nhận: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{transaction.shipping_info.to_name}</span>
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Số điện thoại: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{transaction.shipping_info.to_phone}</span>
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Địa chỉ: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{transaction.shipping_info.to_address}</span>
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Phí COD:{" "}
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {transaction.shipping_info.cod_amount?.toLocaleString()} VNĐ
                    </span>
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Cân nặng: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{transaction.shipping_info.weight} gram</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderItem;
