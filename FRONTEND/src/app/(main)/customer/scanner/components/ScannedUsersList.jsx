"use client";

import React from "react";
import { Calendar, ShieldCheck, Trash2, UserPlus } from "lucide-react";

export default function ScannedUsersList({ scannedUsers = [], onRemoveUser }) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
        <ShieldCheck className="text-emerald-600" size={22} />
        <span>Recently Scanned Users</span>
      </h3>

      {scannedUsers.length > 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100 max-h-[400px] overflow-y-auto shadow-sm">
          {scannedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-gray-900">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user.email}
                  </span>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
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
                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Xóa người dùng khỏi danh sách quét"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <UserPlus className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-sm font-semibold text-gray-700">No users scanned yet</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Start scanning or add users manually
          </p>
        </div>
      )}
    </div>
  );
}
