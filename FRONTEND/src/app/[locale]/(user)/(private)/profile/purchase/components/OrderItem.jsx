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
              statusStyles[transaction.status] ||
              "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {transaction.status_label.toUpperCase()}
          </span>
        </div>
      </div>
      <hr className="my-3 border-zinc-100 dark:border-zinc-800/80" />
      <div className="my-4 flex items-start gap-4">
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-20 w-20 shrink-0 rounded-2xl border border-zinc-100 object-cover shadow-xs dark:border-zinc-800"
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-zinc-900 dark:text-zinc-100">
            {item.name}
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Số lượng: {transaction.quantity || 1}
          </p>
          <p className="text-zinc-650 mt-1 flex items-center text-sm dark:text-zinc-300">
            Đơn giá: {(item.price || transaction.total_price).toLocaleString()}{" "}
            <Coins className="text-brand-emerald ml-1 h-4 w-4" />
          </p>
        </div>
      </div>
      <hr className="my-3 border-zinc-100 dark:border-zinc-800/80" />
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          {transaction.status === "delivered" && (
            <button
              className="bg-brand-emerald rounded-2xl px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-600"
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
              className="rounded-2xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-600"
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
          <p className=" flex items-center justify-end font-bold dark:text-white text-zinc-900">
            Thành tiền: {transaction.total_price.toLocaleString()}{" "}
            <Coins className="text-brand-emerald ml-1 h-4 w-4" />
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
            className="text-brand-emerald flex items-center text-xs font-bold hover:text-emerald-700"
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
            <div className="mt-3 space-y-1.5 border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
              <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Thông tin vận chuyển
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Đơn vị vận chuyển:{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {transaction.shipping_info?.carrier || "Không xác định"}
                </span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Mã vận đơn:{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {transaction.shipping_info?.tracking_number || "Không có"}
                </span>
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
                <div className="border-zinc-150 mt-2 space-y-1 border-t border-dashed pt-2 dark:border-zinc-800/50">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Người nhận:{" "}
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {transaction.shipping_info.to_name}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Số điện thoại:{" "}
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {transaction.shipping_info.to_phone}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Địa chỉ:{" "}
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {transaction.shipping_info.to_address}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Phí COD:{" "}
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {transaction.shipping_info.cod_amount?.toLocaleString()}{" "}
                      VNĐ
                    </span>
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Cân nặng:{" "}
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {transaction.shipping_info.weight} gram
                    </span>
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
