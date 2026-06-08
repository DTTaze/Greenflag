"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import React from "react";

function HistoryTabs({
  activeTab,
  activityLogs,
  coinLogs,
  transactions,
  formatDate,
}) {
  if (activeTab === "all-activity") {
    return (
      <div className="relative ml-3 space-y-6 border-l border-gray-100 py-2 pl-6">
        {activityLogs.map((act) => (
          <div key={act.id} className="relative">
            <div
              className={`absolute top-0.5 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-white shadow-xs ${
                act.category === "task" ? "bg-blue-500" : "bg-green-500"
              }`}
            />
            <div className="space-y-1">
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                  {act.title}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      act.status.includes("Đã")
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {act.status}
                  </span>
                </span>
                <span className="text-[10px] font-medium text-gray-400">
                  {formatDate(act.date)}
                </span>
              </div>
              <p className="text-xs text-gray-500">{act.details}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === "coins") {
    return (
      <div className="divide-y divide-gray-50">
        {coinLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between py-3.5"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  log.type === "earn"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {log.type === "earn" ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-900">
                  {log.description}
                </span>
                <span className="text-[10px] text-gray-400">
                  {formatDate(log.date)}
                </span>
              </div>
            </div>
            <span
              className={`text-sm font-black ${
                log.type === "earn" ? "text-green-600" : "text-red-600"
              }`}
            >
              {log.type === "earn" ? "+" : "-"}
              {log.amount} xu
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === "redeem") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 font-semibold text-gray-400">
              <th className="px-2 py-3">Thời gian</th>
              <th className="px-2 py-3">Vật phẩm</th>
              <th className="px-2 py-3">Số lượng</th>
              <th className="px-2 py-3">Tổng chi phí</th>
              <th className="px-2 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium text-gray-600">
            {transactions.length > 0 ? (
              transactions.map((tr) => (
                <tr
                  key={tr.id}
                  className="transition-colors hover:bg-gray-50/50"
                >
                  <td className="px-2 py-3 text-[10px] text-gray-400">
                    {formatDate(new Date(tr.createdAt))}
                  </td>
                  <td className="px-2 py-3 font-semibold text-gray-900">
                    {tr.name || tr.item_snapshot?.name || "Vật phẩm"}
                  </td>
                  <td className="px-2 py-3">{tr.quantity || 1}</td>
                  <td className="px-2 py-3 font-black text-red-600">
                    -{tr.total_price || 0} xu
                  </td>
                  <td className="px-2 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        tr.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : tr.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {tr.status === "accepted"
                        ? "Đã nhận"
                        : tr.status === "cancelled"
                          ? "Đã hủy"
                          : "Đang xử lý"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              // Fallback mock item
              <tr className="transition-colors hover:bg-gray-50/50">
                <td className="px-2 py-3 text-[10px] text-gray-400">
                  {formatDate(new Date(Date.now() - 3600000 * 24))}
                </td>
                <td className="px-2 py-3 font-semibold text-gray-900">
                  Voucher giảm giá Shopee 20K
                </td>
                <td className="px-2 py-3">1</td>
                <td className="px-2 py-3 font-black text-red-600">-50 xu</td>
                <td className="px-2 py-3">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
                    Đã giao
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

export default HistoryTabs;
