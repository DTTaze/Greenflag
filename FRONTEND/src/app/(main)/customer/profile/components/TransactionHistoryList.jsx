import React from "react";
import { Badge } from "@/src/components/ui/badge";

export default function TransactionHistoryList({
  transactions,
  loadingTransactions,
  getAmount
}) {
  if (loadingTransactions) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-100 shadow-xs space-y-3 animate-pulse bg-slate-50"
          >
            <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
            <div className="h-3 bg-slate-200 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded-md w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-emerald-50/40 text-emerald-800 border border-emerald-100/50 text-sm">
        No transaction history found.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
      {transactions.map((transaction) => {
        const transactionAmount = getAmount(transaction.amount);
        const isPositive = transactionAmount > 0;

        return (
          <div
            key={transaction.id}
            className="p-4 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-xs transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-800 text-sm md:text-base">
                  {transaction.type === "PURCHASE"
                    ? "Item Purchase"
                    : transaction.type === "REWARD"
                    ? "Reward Received"
                    : "Transaction"}
                </span>
                <Badge
                  variant={isPositive ? "default" : "destructive"}
                  className={`text-[10px] uppercase font-bold py-0 px-2 rounded-full ${
                    isPositive
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
                      : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-100"
                  }`}
                >
                  {transaction.type}
                </Badge>
              </div>

              <span
                className={`font-bold text-sm md:text-base ${
                  isPositive ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {isPositive ? `+${transactionAmount}` : transactionAmount} Coins
              </span>
            </div>

            <p className="text-sm text-slate-500 mb-1 leading-relaxed">
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
