"use client";

import { Calendar, ClipboardList, ShoppingBag } from "lucide-react";
import React from "react";

function HistoryStats({
  completedMissionsCount,
  eventsCount,
  transactionsCount,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/30 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <ClipboardList size={20} />
        </div>
        <div>
          <span className="block text-xs font-medium text-blue-700">
            Nhiệm vụ xanh
          </span>
          <span className="text-xl font-bold text-blue-900">
            {completedMissionsCount} đã hoàn thành
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50/30 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
          <Calendar size={20} />
        </div>
        <div>
          <span className="block text-xs font-medium text-green-700">
            Sự kiện môi trường
          </span>
          <span className="text-xl font-bold text-green-900">
            {eventsCount} đã tham gia
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/30 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
          <ShoppingBag size={20} />
        </div>
        <div>
          <span className="block text-xs font-medium text-amber-700">
            Vật phẩm đổi thưởng
          </span>
          <span className="text-xl font-bold text-amber-900">
            {transactionsCount} quà tặng
          </span>
        </div>
      </div>
    </div>
  );
}

export default HistoryStats;
