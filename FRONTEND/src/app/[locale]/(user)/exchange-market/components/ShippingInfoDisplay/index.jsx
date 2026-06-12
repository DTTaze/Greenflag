import { ArrowRight, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { formatCleanAddress } from "@/src/utils/api";

export default function ShippingInfoDisplay({
  isLoadingShipping,
  shippingInfo,
  onChangeShipping,
  onAddAddress,
}) {
  const t = useTranslations("exchangeMarket");

  const cleanStreetAddress = shippingInfo
    ? formatCleanAddress(
        shippingInfo.to_address,
        shippingInfo.to_ward_name,
        shippingInfo.to_district_name,
        shippingInfo.to_province_name
      )
    : "";

  const accountType = shippingInfo
    ? (shippingInfo.account_type?.toLowerCase() || shippingInfo.accountType?.toLowerCase())
    : null;

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
            className="flex items-center gap-0.5 text-xs font-medium text-emerald-500 hover:text-emerald-400 transition-colors duration-150"
          >
            {t("shipping.btnChange")}
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      {isLoadingShipping ? (
        <div className="animate-pulse space-y-2 rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-zinc-800"></div>
          <div className="h-3.5 w-3/4 rounded bg-gray-200 dark:bg-zinc-800"></div>
          <div className="h-3.5 w-1/2 rounded bg-gray-200 dark:bg-zinc-800"></div>
        </div>
      ) : shippingInfo ? (
        <div className="relative overflow-hidden rounded-xl border border-emerald-600 bg-emerald-50/10 p-4 transition-all duration-200 dark:border-emerald-500/35 dark:bg-slate-950/40">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              {shippingInfo.to_name}
            </p>
            <div className="flex items-center gap-1.5">
              {shippingInfo.is_default && (
                <span className="rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 text-[10px] font-bold">
                  Mặc định
                </span>
              )}
              {accountType && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                    accountType === "home"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  {accountType === "home" ? "Nhà riêng" : "Văn phòng"}
                </span>
              )}
            </div>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
            {cleanStreetAddress}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {shippingInfo.to_ward_name}, {shippingInfo.to_district_name},{" "}
            {shippingInfo.to_province_name}
          </p>
          <p className="mt-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {shippingInfo.to_phone}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/20 p-5 text-center dark:border-zinc-800 dark:bg-zinc-950/20">
          <p className="text-xs font-medium text-slate-400 mb-3 leading-relaxed">
            {t("shipping.empty") || "Bạn chưa cấu hình địa chỉ nhận hàng."}
          </p>
          <button
            type="button"
            onClick={onAddAddress}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white transition-all duration-150 active:scale-[0.98] shadow-md shadow-emerald-950/10 cursor-pointer"
          >
            + Thêm địa chỉ mới
          </button>
        </div>
      )}
    </div>
  );
}

