"use client";

import { RefreshCw, Search, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  adminGetCommunityPosts,
  adminModerateCommunityPost,
} from "@/src/services/community.service";

import ModerationDetail from "./ModerationDetail";
import ModerationTable from "./ModerationTable";

function CommunityModeration() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await adminGetCommunityPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch admin posts:", error);
      toast.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleModerate = async (postId, decision) => {
    try {
      const success = await adminModerateCommunityPost(postId, decision);
      if (success) {
        toast.success(
          decision === "approved"
            ? "Đã duyệt bài đăng thành công!"
            : "Đã ẩn bài đăng thành công!",
        );
        fetchPosts(); // Refresh
        if (selectedPost?.id === postId) {
          setSelectedPost(null);
        }
      } else {
        toast.error("Thực hiện thất bại");
      }
    } catch (error) {
      console.error("Moderation error:", error);
      toast.error("Lỗi khi kiểm duyệt bài viết");
    }
  };

  const getFilteredPosts = () => {
    let list = [...posts];

    // Status filter
    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.authorName.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q),
      );
    }

    return list;
  };

  const formatDate = (isoString) => {
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
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-950">
            <ShieldCheck size={26} className="text-emerald-600" />
            Kiểm duyệt bài viết cộng đồng
          </h1>
          <p className="text-sm text-gray-500">
            Duyệt hoặc ẩn các bài viết chia sẻ hoạt động bảo vệ môi trường của
            người dùng.
          </p>
        </div>
        <button
          onClick={fetchPosts}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
        >
          <RefreshCw size={14} /> Làm mới
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-2xs sm:flex-row">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tác giả, nội dung..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pr-4 pl-9 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: "all", label: "Tất cả" },
            { id: "pending", label: "Chờ duyệt" },
            { id: "approved", label: "Đã duyệt" },
            { id: "rejected", label: "Đã ẩn" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                statusFilter === tab.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Table list */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
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
        <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-1">
          <h3 className="border-b border-gray-100 pb-2 text-sm font-bold text-gray-900">
            Chi tiết bài viết
          </h3>
          <ModerationDetail
            selectedPost={selectedPost}
            formatDate={formatDate}
            handleModerate={handleModerate}
          />
        </div>
      </div>
    </div>
  );
}

export default CommunityModeration;
