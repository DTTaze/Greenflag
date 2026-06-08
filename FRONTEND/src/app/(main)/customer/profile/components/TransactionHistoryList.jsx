import React from "react";

import { Badge } from "@/src/components/ui/badge";

export default function TransactionHistoryList({
  transactions,
  loadingTransactions,
  getAmount,
}) {
  if (loadingTransactions) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4 shadow-xs"
          >
            <div className="h-4 w-1/2 rounded-md bg-slate-200"></div>
            <div className="h-3 w-3/4 rounded-md bg-slate-200"></div>
            <div className="h-3 w-1/4 rounded-md bg-slate-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-100/50 bg-emerald-50/40 p-4 text-sm text-emerald-800">
        No transaction history found.
      </div>
    );
  }

  return (
    <div className="max-h-[500px] space-y-4 overflow-y-auto pr-1">
      {transactions.map((transaction) => {
        const transactionAmount = getAmount(transaction.amount);
        const isPositive = transactionAmount > 0;

        return (
          <div
            key={transaction.id}
            className="rounded-xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-xs"
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-slate-800 md:text-base">
                  {transaction.type === "PURCHASE"
                    ? "Item Purchase"
                    : transaction.type === "REWARD"
                      ? "Reward Received"
                      : "Transaction"}
                </span>
                <Badge
                  variant={isPositive ? "default" : "destructive"}
                  className={`rounded-full px-2 py-0 text-[10px] font-bold uppercase ${
                    isPositive
                      ? "border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "border border-red-100 bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  {transaction.type}
                </Badge>
              </div>

              <span
                className={`text-sm font-bold md:text-base ${
                  isPositive ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {isPositive ? `+${transactionAmount}` : transactionAmount} Coins
              </span>
            </div>

            <p className="mb-1 text-sm leading-relaxed text-slate-500">
              {transaction.description || "No description provided"}
            </p>
            <span className="text-[11px] text-slate-400">
              {new Date(transaction.created_at).toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
