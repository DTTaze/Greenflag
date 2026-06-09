"use client";

import { Calendar, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import React from "react";

export default function ScannedUsersList({ scannedUsers = [], onRemoveUser }) {
  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
        <ShieldCheck className="text-emerald-600" size={22} />
        <span>Recently Scanned Users</span>
      </h3>

      {scannedUsers.length > 0 ? (
        <div className="max-h-[400px] divide-y divide-gray-100 overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          {scannedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50/50"
            >
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full border border-gray-100 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      <Calendar size={10} />
                      <span>{user.eventTitle}</span>
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(user.scannedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onRemoveUser(user.id)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                title="Xóa người dùng khỏi danh sách quét"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-16">
          <UserPlus className="mb-2 h-12 w-12 text-gray-400" />
          <p className="text-sm font-semibold text-gray-700">
            No users scanned yet
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            Start scanning or add users manually
          </p>
        </div>
      )}
    </div>
  );
}
