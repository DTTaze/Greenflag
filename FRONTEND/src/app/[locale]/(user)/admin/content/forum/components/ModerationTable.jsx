import { Check, Eye, X } from "lucide-react";
import React from "react";

import Loader from "@/src/components/ui/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

function ModerationTable({
  posts,
  selectedPost,
  setSelectedPost,
  formatDate,
  handleModerate,
  loading,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm font-medium text-gray-400 dark:text-zinc-500">
          Không tìm thấy bài viết nào
        </p>
      </div>
    );
  }

  return (
    <Table className="text-xs">
      <TableHeader>
        <TableRow className="border-b border-gray-100 bg-gray-50/50 font-semibold text-gray-400 hover:bg-transparent dark:border-zinc-800 dark:bg-zinc-900/50">
          <TableHead className="h-auto px-4 py-3.5 text-gray-400 dark:text-zinc-400">
            Tác giả
          </TableHead>
          <TableHead className="h-auto px-4 py-3.5 text-gray-400 dark:text-zinc-400">
            Nội dung tóm tắt
          </TableHead>
          <TableHead className="h-auto px-4 py-3.5 text-gray-400 dark:text-zinc-400">
            Ngày đăng
          </TableHead>
          <TableHead className="h-auto px-4 py-3.5 text-gray-400 dark:text-zinc-400">
            Trạng thái
          </TableHead>
          <TableHead className="h-auto px-4 py-3.5 text-right text-gray-400 dark:text-zinc-400">
            Tác vụ
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-gray-50 font-medium text-gray-600 dark:divide-zinc-900 dark:text-zinc-400">
        {posts.map((post) => (
          <TableRow
            key={post.id}
            className={`cursor-pointer transition-colors hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 ${
              selectedPost?.id === post.id
                ? "bg-emerald-50/30 dark:bg-emerald-950/20"
                : ""
            }`}
            onClick={() => setSelectedPost(post)}
          >
            <TableCell className="px-4 py-3.5">
              <div className="flex items-center gap-2">
                <img
                  src={post.author?.avatarUrl || "/images/default-avatar.jpg"}
                  alt="avatar"
                  className="h-8 w-8 shrink-0 rounded-full border border-gray-100 object-cover dark:border-zinc-800"
                />
                <div className="max-w-[120px] overflow-hidden">
                  <span className="block truncate font-semibold text-gray-900 dark:text-white">
                    {post.author?.name || "Ẩn danh"}
                  </span>
                  <span className="block truncate text-[10px] text-gray-400 uppercase dark:text-zinc-500">
                    {post.author?.role || "Thành viên"}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell className="max-w-[200px] truncate px-4 py-3.5 text-gray-700 dark:text-zinc-300">
              {post.content}
            </TableCell>
            <TableCell className="px-4 py-3.5 text-[10px] text-gray-400 dark:text-zinc-500">
              {formatDate(post.createdAt)}
            </TableCell>
            <TableCell className="px-4 py-3.5">
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                  post.status === "approved"
                    ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400"
                    : post.status === "rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                }`}
              >
                {post.status === "approved"
                  ? "Đã duyệt"
                  : post.status === "rejected"
                    ? "Đã ẩn"
                    : "Chờ duyệt"}
              </span>
            </TableCell>
            <TableCell
              className="px-4 py-3.5 text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end gap-1.5">
                <button
                  onClick={() => setSelectedPost(post)}
                  className="cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  title="Xem chi tiết"
                >
                  <Eye size={15} />
                </button>
                {post.status !== "approved" && (
                  <button
                    onClick={() => handleModerate(post.id, "approved")}
                    className="cursor-pointer rounded-md p-1 text-green-600 transition-colors hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-950/40"
                    title="Duyệt bài đăng"
                  >
                    <Check size={15} />
                  </button>
                )}
                {post.status !== "rejected" && (
                  <button
                    onClick={() => handleModerate(post.id, "rejected")}
                    className="cursor-pointer rounded-md p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40"
                    title="Ẩn bài đăng"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ModerationTable;
