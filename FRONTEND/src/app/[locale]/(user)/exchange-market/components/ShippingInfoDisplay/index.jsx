import React from "react";
import { MapPin, ArrowRight } from "lucide-react";

export default function ShippingInfoDisplay({
  isLoadingShipping,
  shippingInfo,
  onChangeShipping,
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MapPin size={14} className="text-emerald-500" />
          Thông tin nhận hàng
        </h3>
        <button
          onClick={onChangeShipping}
          className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 transition-colors duration-150"
        >
          Thay đổi
          <ArrowRight size={12} />
        </button>
      </div>
      
      {isLoadingShipping ? (
        <div className="animate-pulse rounded-lg border border-slate-800/80 bg-slate-950/40 p-4 space-y-2">
          <div className="h-4 w-1/3 rounded bg-slate-800/80"></div>
          <div className="h-3.5 w-3/4 rounded bg-slate-800/80"></div>
          <div className="h-3.5 w-1/2 rounded bg-slate-800/80"></div>
        </div>
      ) : shippingInfo ? (
        <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-4 hover:border-slate-700/60 transition-all duration-200">
          <p className="text-sm font-semibold text-white">{shippingInfo.to_name}</p>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{shippingInfo.to_address}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {shippingInfo.to_ward_name}, {shippingInfo.to_district_name},{" "}
            {shippingInfo.to_province_name}
          </p>
          <p className="text-xs text-emerald-400 font-medium mt-1">{shippingInfo.to_phone}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-red-900/30 bg-red-950/10 p-4 text-center">
          <p className="text-xs text-red-400 font-medium">Chưa có thông tin giao hàng</p>
        </div>
      )}
    </div>
  );
}
