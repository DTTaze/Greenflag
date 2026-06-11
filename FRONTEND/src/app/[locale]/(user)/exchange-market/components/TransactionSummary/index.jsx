import { Coins } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function TransactionSummary({
  item,
  quantity,
  shippingFee,
  totalCost,
  userCoins,
  canPurchase,
}) {
  const t = useTranslations("exchangeMarket");
  const finalBalance = userCoins - totalCost;

  return (
    <div className="space-y-3 rounded-xl border border-emerald-250/60 bg-emerald-50/15 p-4 dark:border-emerald-500/15 dark:bg-slate-950/50">
      {/* Product Cost */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">{t("summary.productPrice")}</span>
        <div className="flex items-center font-semibold text-slate-800 dark:text-slate-200">
          <span>{item.price * quantity}</span>
          <Coins className="ml-1 h-3.5 w-3.5 text-amber-400" />
        </div>
      </div>

      {/* Shipping Fee */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">{t("summary.shippingFee")}</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {shippingFee.toLocaleString()} VND
        </span>
      </div>

      {/* Separator */}
      <div className="border-t border-emerald-100 dark:border-emerald-500/10" />

      {/* Total Coin Cost */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-400">
          {t("summary.totalCost")}
        </span>
        <div className="flex items-center font-bold text-emerald-600 dark:text-emerald-400">
          <span>{totalCost}</span>
          <Coins className="ml-1 h-3.5 w-3.5 text-amber-400" />
        </div>
      </div>

      {/* Current Balance */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">{t("summary.currentBalance")}</span>
        <div className="flex items-center font-semibold text-slate-800 dark:text-slate-200">
          <span>{userCoins}</span>
          <Coins className="ml-1 h-3.5 w-3.5 text-amber-400" />
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-emerald-100 dark:border-emerald-500/10" />

      {/* Balance After Purchase */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {t("summary.balanceAfter")}
        </span>
        <div
          className={`flex items-center font-bold ${
            canPurchase ? "text-emerald-650 dark:text-emerald-400" : "text-rose-500"
          }`}
        >
          <span>{finalBalance}</span>
          <Coins className="ml-1 h-4 w-4 text-amber-400" />
        </div>
      </div>
    </div>
  );
}
