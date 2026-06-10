"use client";

import { Image as ImageIcon, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";

import Loader from "@/src/components/ui/Loader";
import { getCommunityPosts } from "@/src/services/community.service";
import { useAuthStore } from "@/src/store/auth/authStore";

import CreatePostModal from "../CreatePostModal";
import PostCard from "../PostCard";

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
    <div className="min-h-screen bg-transparent py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Banner header */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-emerald-800/40 bg-gradient-to-r from-emerald-950/70 to-teal-900/60 p-8 text-white shadow-xl backdrop-blur-md">
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="relative z-10 max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Sparkles size={12} className="animate-spin-slow" /> Cộng đồng
              sống xanh
            </div>
            <h1 className="bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              Green Flag Community
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-slate-300">
              Nơi chia sẻ những khoảnh khắc bảo vệ môi trường, lan tỏa thói quen
              sống xanh và nhận phản hồi tích cực từ cộng đồng.
            </p>
          </div>
          {/* Background circle decoration */}
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex w-1/3 items-center justify-center opacity-5">
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
        <div className="mb-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-xl backdrop-blur-md transition-all hover:border-slate-700/80">
          <div className="flex gap-4">
            <img
              src={user?.avatar_url || "/images/default-avatar.jpg"}
              alt="Avatar"
              className="h-11 w-11 shrink-0 rounded-full border border-slate-800 bg-slate-950 object-cover"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 cursor-pointer rounded-full border border-slate-800 bg-slate-950/40 px-5 py-3 text-left text-sm text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-950/60 hover:text-slate-300 focus:outline-none"
            >
              Hôm nay bạn đã làm gì để bảo vệ môi trường? Chia sẻ ngay...
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3.5 text-sm">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 font-semibold text-emerald-400 transition-all hover:bg-slate-800/40 hover:text-emerald-300"
            >
              <ImageIcon size={18} className="text-emerald-400" />
              <span>Đính kèm hình ảnh</span>
            </button>
            <span className="text-[11px] text-slate-500 italic">
              Bài viết sẽ được duyệt trước khi hiển thị công khai
            </span>
          </div>
        </div>

        {/* Hashtag filter bar */}
        <div className="mb-6 flex scrollbar-none items-center gap-2 overflow-x-auto pb-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-150 ${
                selectedTag === tag.id
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/10"
                  : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white"
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
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-12 text-center">
            <p className="mb-2 text-sm font-semibold text-slate-400">
              Chưa có bài đăng nào trong mục này
            </p>
            <p className="text-xs text-slate-500">
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
