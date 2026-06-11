"use client";

import { Check, X } from "lucide-react";
import React from "react";

function ModerationDetail({ selectedPost, formatDate, handleModerate }) {
  if (!selectedPost) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-100 py-20 text-center dark:border-zinc-800">
        <p className="text-xs font-medium text-gray-400 dark:text-zinc-500">
          Chọn một bài đăng bên danh sách để xem chi tiết kiểm duyệt
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs font-medium text-gray-600 dark:text-zinc-400">
      <div className="flex items-center gap-3">
        <img
          src={selectedPost.author?.avatarUrl || "/images/default-avatar.jpg"}
          alt="Avatar"
          className="h-10 w-10 rounded-full border border-gray-100 object-cover dark:border-zinc-800"
        />
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">
            {selectedPost.author?.name || "Thành viên GreenFlag"}
          </h4>
          <p className="text-[10px] text-gray-400 uppercase dark:text-zinc-500">
            {selectedPost.author?.role || "Thành viên"}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <span className="block text-[10px] text-gray-400 dark:text-zinc-500">
          Thể loại & Chủ đề:
        </span>
        <div className="flex flex-wrap gap-1">
          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            {selectedPost.category || "Thảo luận chung"}
          </span>
          {selectedPost.tags &&
            selectedPost.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>

      <div className="space-y-1">
        <span className="block text-[10px] text-gray-400 dark:text-zinc-500">
          Ngày gửi:
        </span>
        <p className="text-gray-900 dark:text-white">
          {formatDate(selectedPost.createdAt)}
        </p>
      </div>

      <div className="space-y-1">
        <span className="block text-[10px] text-gray-400 dark:text-zinc-500">
          Nội dung bài viết:
        </span>
        <p className="rounded-lg bg-gray-50 p-3 leading-relaxed whitespace-pre-wrap text-gray-700 dark:bg-zinc-900/50 dark:text-zinc-300">
          {selectedPost.content}
        </p>
      </div>

      {selectedPost.images && selectedPost.images.length > 0 && (
        <div className="space-y-1.5">
          <span className="block text-[10px] text-gray-400 dark:text-zinc-500">
            Hình ảnh đính kèm ({selectedPost.images.length}):
          </span>
          <div className="grid grid-cols-2 gap-2">
            {selectedPost.images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-100 dark:border-zinc-800"
              >
                <img
                  src={img}
                  alt={`Attach preview ${idx + 1}`}
                  className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-90"
                  onClick={() => window.open(img, "_blank")}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPost.flaggedReason && (
        <div className="rounded-lg bg-red-50 p-3 text-red-800 dark:bg-red-950/30 dark:text-red-400">
          <span className="block text-[10px] font-bold tracking-wider uppercase">
            Lý do vi phạm (AI cảnh báo):
          </span>
          <p className="mt-1 leading-relaxed">{selectedPost.flaggedReason}</p>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        {selectedPost.status !== "approved" && (
          <button
            onClick={() => handleModerate(selectedPost.id, "approved")}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg bg-emerald-600 py-2 font-bold text-white shadow-2xs transition-colors hover:bg-emerald-700"
          >
            <Check size={14} /> Phê duyệt
          </button>
        )}
        {selectedPost.status !== "rejected" && (
          <button
            onClick={() => handleModerate(selectedPost.id, "rejected")}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg bg-rose-600 py-2 font-bold text-white shadow-2xs transition-colors hover:bg-rose-700"
          >
            <X size={14} /> Ẩn bài viết
          </button>
        )}
      </div>
    </div>
  );
}

export default ModerationDetail;
