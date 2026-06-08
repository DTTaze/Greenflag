"use client";

import { Check, X } from "lucide-react";
import React from "react";

function ModerationDetail({ selectedPost, formatDate, handleModerate }) {
  if (!selectedPost) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-100 py-20 text-center">
        <p className="text-xs font-medium text-gray-400">
          Chọn một bài đăng bên danh sách để xem chi tiết kiểm duyệt
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs font-medium text-gray-600">
      <div className="flex items-center gap-3">
        <img
          src={
            selectedPost.authorAvatar || "/src/assets/images/default-avatar.jpg"
          }
          alt="Avatar"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <h4 className="font-bold text-gray-900">{selectedPost.authorName}</h4>
          <p className="text-[10px] text-gray-400">
            {selectedPost.authorEmail}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <span className="block text-[10px] text-gray-400">Ngày gửi:</span>
        <p className="text-gray-900">{formatDate(selectedPost.createdAt)}</p>
      </div>

      <div className="space-y-1">
        <span className="block text-[10px] text-gray-400">
          Nội dung bài viết:
        </span>
        <p className="rounded-lg bg-gray-50 p-3 leading-relaxed whitespace-pre-wrap text-gray-700">
          {selectedPost.content}
        </p>
      </div>

      {selectedPost.image && (
        <div className="space-y-1">
          <span className="block text-[10px] text-gray-400">
            Hình ảnh đính kèm:
          </span>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-100">
            <img
              src={selectedPost.image}
              alt="Attach preview"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        {selectedPost.status !== "approved" && (
          <button
            onClick={() => handleModerate(selectedPost.id, "approved")}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg bg-green-600 py-2 font-bold text-white shadow-2xs transition-colors hover:bg-green-700"
          >
            <Check size={14} /> Phê duyệt
          </button>
        )}
        {selectedPost.status !== "rejected" && (
          <button
            onClick={() => handleModerate(selectedPost.id, "rejected")}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg bg-red-600 py-2 font-bold text-white shadow-2xs transition-colors hover:bg-red-700"
          >
            <X size={14} /> Ẩn bài viết
          </button>
        )}
      </div>
    </div>
  );
}

export default ModerationDetail;
