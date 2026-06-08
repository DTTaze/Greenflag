import { Coins } from "lucide-react";
import { useState } from "react";

import { statusStyles } from "./purchaseHelpers.js";

const OrderItem = ({ transaction, onClick, onCancel }) => {
  const item = transaction.item_snapshot;
  const [showShippingInfo, setShowShippingInfo] = useState(false);

  return (
    <div
      className="mb-4 cursor-pointer rounded-lg bg-white p-4 shadow-sm transition hover:shadow-md"
      onClick={() => onClick(transaction)}
    >
      <div className="flex items-start justify-between">
        <div className="text-sm font-semibold text-gray-700">
          Người bán: {item.creator?.full_name || "Không xác định"}
        </div>
        <div className="mb-2 text-right">
          <span
            className={`rounded px-2 py-1 text-sm ${
              statusStyles[transaction.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {transaction.status_label.toUpperCase()}
          </span>
        </div>
      </div>
      <hr className="text-gray-300"></hr>
      <div className="my-4 flex items-center">
        <div className="flex-1">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600">
            Số lượng: {transaction.quantity || 1}
          </p>
          <p className="flex items-center text-sm text-gray-600">
            Đơn giá: {(item.price || transaction.total_price).toLocaleString()}{" "}
            <Coins className="ml-1 h-5 w-5 text-emerald-600" />
          </p>
        </div>
      </div>
      <hr className="text-gray-300"></hr>
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          {transaction.status === "delivered" && (
            <button
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
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
              className="mt-2 rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
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
          <p className="flex items-center justify-end font-semibold">
            Thành tiền: {transaction.total_price.toLocaleString()}{" "}
            <Coins className="ml-1 h-5 w-5 text-emerald-600" />
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
            className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800"
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
            <div className="mt-2 border-t pt-2">
              <h4 className="text-sm font-semibold">Thông tin vận chuyển</h4>
              <p className="text-sm text-gray-600">
                Đơn vị vận chuyển:{" "}
                {transaction.shipping_info?.carrier || "Không xác định"}
              </p>
              <p className="text-sm text-gray-600">
                Mã vận đơn:{" "}
                {transaction.shipping_info?.tracking_number || "Không có"}
              </p>
              <p className="text-sm text-gray-600">
                Dự kiến giao:{" "}
                {transaction.shipping_info?.estimated_delivery
                  ? new Date(
                      transaction.shipping_info.estimated_delivery,
                    ).toLocaleDateString("vi-VN")
                  : "Không xác định"}
              </p>
              {transaction.shipping_info?.to_name && (
                <>
                  <p className="text-sm text-gray-600">
                    Người nhận: {transaction.shipping_info.to_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Số điện thoại: {transaction.shipping_info.to_phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    Địa chỉ: {transaction.shipping_info.to_address}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phí COD:{" "}
                    {transaction.shipping_info.cod_amount?.toLocaleString()} VNĐ
                  </p>
                  <p className="text-sm text-gray-600">
                    Cân nặng: {transaction.shipping_info.weight} gram
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderItem;
