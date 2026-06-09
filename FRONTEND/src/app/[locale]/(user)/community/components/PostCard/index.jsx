"use client";

import { CornerDownRight, Heart, MessageCircle, Share2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

import {
  addPostComment,
  likeCommunityPost,
} from "@/src/services/community.service";
import { useAuthStore } from "@/src/store/auth/authStore";

function PostCard({ post, onLikeUpdate }) {
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commenting, setCommenting] = useState(false);

  const isLiked = user?.email ? post.likedByUsers.includes(user.email) : false;

  const handleLike = async () => {
    if (!user?.email) {
      toast.warning("Vui lòng đăng nhập để tương tác");
      return;
    }
    try {
      await likeCommunityPost(post.id, user.email);
      onLikeUpdate();
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      toast.warning("Vui lòng đăng nhập để bình luận");
      return;
    }
    if (!newComment.trim()) return;

    try {
      setCommenting(true);
      await addPostComment(
        post.id,
        newComment,
        user.full_name || user.username,
        user.avatar_url,
      );
      setNewComment("");
      onLikeUpdate(); // Reload post data to show new comment
      toast.success("Đã đăng bình luận!");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setCommenting(false);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-slate-700/80">
      {/* Header author details */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={post.authorAvatar || "/images/default-avatar.jpg"}
          alt="Avatar"
          className="h-10 w-10 rounded-full border border-slate-800 object-cover bg-slate-950"
        />
        <div>
          <h3 className="text-sm font-semibold text-white">
            {post.authorName}
          </h3>
          <p className="text-[10px] text-slate-500">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      {/* Post content */}
      <div className="px-4 pb-4.5">
        <p className="text-sm leading-relaxed whitespace-pre-line text-slate-200">
          {post.content}
        </p>
      </div>

      {/* Post image */}
      {post.image && (
        <div className="relative aspect-video w-full overflow-hidden border-y border-slate-850 bg-slate-950/20">
          <img
            src={post.image}
            alt="Community Post Attached"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>
      )}

      {/* Action panel */}
      <div className="flex items-center justify-between border-t border-slate-800/60 px-4 py-2 text-xs text-slate-400">
        <div className="flex gap-2">
          {/* Like button */}
          <button
            onClick={handleLike}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 font-semibold transition-colors hover:bg-rose-500/10 ${
              isLiked ? "text-rose-500" : "text-slate-400 hover:text-slate-250"
            }`}
          >
            <Heart
              size={17}
              className={`transition-all duration-200 ${isLiked ? "scale-110 fill-rose-500" : ""}`}
            />
            <span>{post.likes}</span>
          </button>

          {/* Comment button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 font-semibold transition-colors hover:bg-blue-500/10 ${
              showComments ? "bg-slate-800/40 text-blue-400" : "text-slate-400 hover:text-slate-250"
            }`}
          >
            <MessageCircle size={17} />
            <span>{post.comments?.length || 0}</span>
          </button>
        </div>

        {/* Share Button (Mock) */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              window.location.origin + `/community#${post.id}`,
            );
            toast.info("Đã sao chép liên kết bài viết!");
          }}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
        >
          <Share2 size={16} />
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* Comments Area */}
      {showComments && (
        <div className="space-y-4 border-t border-slate-800/60 bg-slate-950/40 p-4">
          {/* Create comment form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-3">
            <img
              src={user?.avatar_url || "/images/default-avatar.jpg"}
              alt="My Avatar"
              className="h-8 w-8 shrink-0 rounded-full object-cover bg-slate-950"
            />
            <div className="relative flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết phản hồi sống xanh của bạn..."
                className="w-full rounded-lg bg-slate-900 border border-slate-850 py-2 pr-10 pl-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                disabled={commenting || !newComment.trim()}
                className="absolute top-1.5 right-2 cursor-pointer text-emerald-400 hover:text-emerald-300 disabled:text-slate-600 transition-colors"
              >
                <CornerDownRight size={16} />
              </button>
            </div>
          </form>

          {/* Comments list */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-3 pt-1.5">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5 text-xs">
                  <img
                    src={comment.authorAvatar || "/images/default-avatar.jpg"}
                    alt="Commenter Avatar"
                    className="mt-0.5 h-7 w-7 shrink-0 rounded-full object-cover bg-slate-950"
                  />
                  <div className="flex-1 rounded-xl border border-slate-850 bg-slate-900/60 p-3 shadow-inner">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="font-semibold text-slate-200">
                        {comment.authorName}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="leading-relaxed text-slate-350">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-3 text-center text-xs text-slate-500 font-medium">
              Chưa có bình luận nào. Hãy gửi phản hồi đầu tiên nhé!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PostCard;
