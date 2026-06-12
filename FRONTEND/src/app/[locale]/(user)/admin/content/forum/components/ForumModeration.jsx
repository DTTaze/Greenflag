"use client";

import { RefreshCw, Search, ShieldCheck, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { forumService } from "@/src/services/forum.service";

import ModerationDetail from "./ModerationDetail";
import ModerationTable from "./ModerationTable";

function ForumModeration() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await forumService.adminGetPosts(statusFilter);

      if (res.success && res.data) {
        setPosts(res.data.items || []);
      } else {
        setPosts([]);
        toast.error(res.message || "Không thể tải danh sách bài viết");
      }
    } catch (error) {
      console.error("Failed to fetch admin forum posts:", error);
      toast.error("Không thể tải danh sách bài viết từ máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);

  const handleModerate = async (postId, decision) => {
    try {
      let res;
      if (decision === "approved") {
        res = await forumService.approvePost(postId);
      } else {
        const flaggedReason = window.prompt("Nhập lý do ẩn bài viết (không bắt buộc):");
        if (flaggedReason === null) return; // User cancelled prompt
        res = await forumService.rejectPost(postId, flaggedReason || undefined);
      }

      if (res.success) {
        toast.success(
          decision === "approved"
            ? "Đã duyệt bài đăng thành công!"
            : "Đã ẩn bài đăng thành công!",
        );
        fetchPosts(); // Làm mới danh sách
        if (selectedPost?.id === postId) {
          setSelectedPost(null);
        }
      } else {
        toast.error(res.message || "Thực hiện kiểm duyệt thất bại");
      }
    } catch (error) {
      console.error("Moderation error:", error);
      toast.error("Lỗi khi kết nối đến máy chủ để kiểm duyệt");
    }
  };

  const getFilteredPosts = () => {
    let list = [...posts];

    // Tìm kiếm theo từ khóa (tên tác giả hoặc nội dung)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          (p.author?.name && p.author.name.toLowerCase().includes(q)) ||
          (p.content && p.content.toLowerCase().includes(q)),
      );
    }

    return list;
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="flex-1 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-emerald-100 pb-4 dark:border-emerald-500/10">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
            <ShieldCheck
              size={26}
              className="text-emerald-600 dark:text-emerald-500"
            />
            Kiểm duyệt bài viết diễn đàn
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Phê duyệt hoặc ẩn các bài viết chia sẻ hoạt động sống xanh, bảo vệ
            môi trường của thành viên.
          </p>
        </div>
        <button
          onClick={fetchPosts}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 dark:border-emerald-500/15 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
        >
          <RefreshCw size={14} /> Làm mới
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-emerald-200/60 bg-white p-4 shadow-2xs sm:flex-row dark:border-emerald-500/15 dark:bg-zinc-950">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tác giả, nội dung..."
            className="w-full rounded-lg border border-emerald-200 bg-gray-50/50 py-2 pr-4 pl-9 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none dark:border-emerald-500/15 dark:bg-zinc-900 dark:text-white dark:focus:ring-emerald-500"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: "pending", label: "Chờ duyệt" },
            { id: "approved", label: "Đã duyệt" },
            { id: "rejected", label: "Đã ẩn" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                statusFilter === tab.id
                  ? "bg-emerald-600 text-white dark:bg-emerald-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Table list */}
        <div className={`overflow-hidden rounded-xl border border-emerald-200/60 bg-white shadow-sm transition-all duration-300 dark:border-emerald-500/15 dark:bg-zinc-950 ${selectedPost ? "w-full md:w-3/5" : "w-full"}`}>
          <ModerationTable
            posts={filteredPosts}
            selectedPost={selectedPost}
            setSelectedPost={setSelectedPost}
            formatDate={formatDate}
            handleModerate={handleModerate}
            loading={loading}
          />
        </div>

        {/* Details preview */}
        {selectedPost && (
          <div className="w-full space-y-4 rounded-xl border border-emerald-200/60 bg-white p-5 shadow-sm transition-all duration-300 md:w-2/5 dark:border-emerald-500/15 dark:bg-zinc-950">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2 dark:border-emerald-500/10">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Chi tiết bài viết
              </h3>
              <button
                onClick={() => setSelectedPost(null)}
                className="cursor-pointer rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                title="Đóng chi tiết"
              >
                <X size={18} />
              </button>
            </div>
            <ModerationDetail
              selectedPost={selectedPost}
              formatDate={formatDate}
              handleModerate={handleModerate}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ForumModeration;
