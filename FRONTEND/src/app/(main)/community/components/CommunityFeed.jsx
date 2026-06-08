"use client";

import { Image as ImageIcon, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";

import Loader from "@/src/components/ui/Loader";
import { getCommunityPosts } from "@/src/services/community.service";
import { useAuthStore } from "@/src/store/auth/authStore";

import CreatePostModal from "./CreatePostModal";
import PostCard from "./PostCard";

function CommunityFeed() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getCommunityPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to load community posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    fetchPosts(); // Refresh list
  };

  const getFilteredPosts = () => {
    if (selectedTag === "all") return posts;
    const tagKeyword = selectedTag.toLowerCase();
    return posts.filter((post) =>
      post.content.toLowerCase().includes(tagKeyword),
    );
  };

  const tags = [
    { id: "all", label: "Tất cả" },
    { id: "trongcay", label: "#TrồngCây" },
    { id: "taiche", label: "#TáiChế" },
    { id: "dọn rác", label: "#NhặtRác" },
    { id: "tiết kiệm", label: "#TiếtKiệmNăngLượng" },
  ];

  const filteredPosts = getFilteredPosts();

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Banner header */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B6E4F] to-[#139a6e] p-8 text-white shadow-lg">
          <div className="relative z-10 max-w-lg space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
              <Sparkles size={12} /> Cộng đồng sống xanh
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Green Flag Community
            </h1>
            <p className="text-sm text-emerald-100 md:text-base">
              Nơi chia sẻ những khoảnh khắc bảo vệ môi trường, lan tỏa thói quen
              sống xanh và nhận phản hồi tích cực từ cộng đồng.
            </p>
          </div>
          {/* Background circle decoration */}
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex w-1/3 items-center justify-center opacity-10">
            <svg
              className="h-full w-full"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <circle cx="50" cy="50" r="40" />
            </svg>
          </div>
        </div>

        {/* Input box card */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex gap-4">
            <img
              src={user?.avatar_url || "/src/assets/images/default-avatar.jpg"}
              alt="Avatar"
              className="h-11 w-11 shrink-0 rounded-full border border-emerald-100 object-cover"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 cursor-pointer rounded-full border border-gray-100 bg-gray-50/50 px-5 py-3 text-left text-sm font-medium text-gray-500 transition-all hover:border-gray-200 hover:bg-gray-50 focus:outline-none"
            >
              Hôm nay bạn đã làm gì để bảo vệ môi trường? Chia sẻ ngay...
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3 text-sm text-gray-600">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 font-semibold text-emerald-700 transition-all hover:bg-emerald-50"
            >
              <ImageIcon size={18} className="text-emerald-600" />
              <span>Đính kèm hình ảnh</span>
            </button>
            <span className="text-xs font-medium text-gray-400 italic">
              Bài viết sẽ được duyệt trước khi hiển thị công khai
            </span>
          </div>
        </div>

        {/* Hashtag filter bar */}
        <div className="mb-6 flex scrollbar-none items-center gap-2 overflow-x-auto pb-4">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                selectedTag === tag.id
                  ? "border-[#0B6E4F] bg-[#0B6E4F] text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Feed lists */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="mb-2 font-medium text-gray-500">
              Chưa có bài đăng nào trong mục này
            </p>
            <p className="text-xs text-gray-400">
              Hãy là người đầu tiên chia sẻ hành động sống xanh của mình!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onLikeUpdate={fetchPosts} />
            ))}
          </div>
        )}
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}

export default CommunityFeed;
