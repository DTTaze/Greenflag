import { ArrowRight, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function ShippingInfoDisplay({
  isLoadingShipping,
  shippingInfo,
  onChangeShipping,
  onAddAddress,
}) {
  const t = useTranslations("exchangeMarket");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          <MapPin size={14} className="text-emerald-500" />
          {t("shipping.title")}
        </h3>
        {shippingInfo && (
          <button
            onClick={onChangeShipping}
            className="flex items-center gap-0.5 text-xs font-medium text-emerald-400 transition-colors duration-150 hover:text-emerald-300"
          >
            {t("shipping.btnChange")}
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      {isLoadingShipping ? (
        <div className="animate-pulse space-y-2 rounded-lg border border-slate-800/80 bg-slate-950/40 p-4">
          <div className="h-4 w-1/3 rounded bg-slate-800/80"></div>
          <div className="h-3.5 w-3/4 rounded bg-slate-800/80"></div>
          <div className="h-3.5 w-1/2 rounded bg-slate-800/80"></div>
        </div>
      ) : shippingInfo ? (
        <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-4 transition-all duration-200 hover:border-slate-700/60">
          <p className="text-sm font-semibold text-white">
            {shippingInfo.to_name}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            {shippingInfo.to_address}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {shippingInfo.to_ward_name}, {shippingInfo.to_district_name},{" "}
            {shippingInfo.to_province_name}
          </p>
          <p className="mt-1 text-xs font-medium text-emerald-400">
            {shippingInfo.to_phone}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-800 bg-slate-950/20 p-5 text-center">
          <p className="text-xs font-medium text-slate-400 mb-3 leading-relaxed">
            {t("shipping.empty") || "Bạn chưa cấu hình địa chỉ nhận hàng."}
          </p>
          <button
            type="button"
            onClick={onAddAddress}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition-all duration-150 active:scale-[0.98] shadow-md shadow-emerald-950/20 cursor-pointer"
          >
            + Thêm địa chỉ mới
          </button>
        </div>
      )}
    </div>
  );
}
