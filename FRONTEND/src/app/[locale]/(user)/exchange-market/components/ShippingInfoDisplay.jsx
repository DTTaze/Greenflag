import React from "react";

export default function ShippingInfoDisplay({
  isLoadingShipping,
  shippingInfo,
  onChangeShipping,
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium text-gray-800">Thông tin nhận hàng</h3>
        <button
          onClick={onChangeShipping}
          className="text-sm text-emerald-600 hover:text-emerald-800"
        >
          Thay đổi
        </button>
      </div>
      {isLoadingShipping ? (
        <div className="animate-pulse rounded-lg bg-gray-100 p-3">
          <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </div>
      ) : shippingInfo ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm text-gray-800">{shippingInfo.to_name}</p>
          <p className="text-sm text-gray-600">{shippingInfo.to_address}</p>
          <p className="text-sm text-gray-600">
            {shippingInfo.to_ward_name}, {shippingInfo.to_district_name},{" "}
            {shippingInfo.to_province_name}
          </p>
          <p className="text-sm text-gray-600">{shippingInfo.to_phone}</p>
        </div>
      ) : (
        <p className="text-sm text-red-600">Chưa có thông tin giao hàng</p>
      )}
    </div>
  );
}
