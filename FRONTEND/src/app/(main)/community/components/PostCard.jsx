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
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Header author details */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={post.authorAvatar || "/images/default-avatar.jpg"}
          alt="Avatar"
          className="h-10 w-10 rounded-full border border-gray-100 object-cover"
        />
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {post.authorName}
          </h3>
          <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      {/* Post content */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
          {post.content}
        </p>
      </div>

      {/* Post image */}
      {post.image && (
        <div className="relative aspect-video w-full overflow-hidden border-y border-gray-50 bg-gray-50">
          <img
            src={post.image}
            alt="Community Post Attached"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
      )}

      {/* Action panel */}
      <div className="flex items-center justify-between border-t border-gray-50 px-4 py-2.5 text-xs text-gray-600">
        <div className="flex gap-4">
          {/* Like button */}
          <button
            onClick={handleLike}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-colors hover:bg-red-50 ${
              isLiked ? "text-red-600" : "text-gray-500"
            }`}
          >
            <Heart
              size={17}
              className={`transition-all ${isLiked ? "scale-110 fill-red-600" : ""}`}
            />
            <span>{post.likes}</span>
          </button>

          {/* Comment button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-colors hover:bg-blue-50 ${
              showComments ? "bg-blue-50/50 text-blue-600" : "text-gray-500"
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
          className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold text-gray-500 transition-colors hover:bg-gray-100"
        >
          <Share2 size={16} />
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* Comments Area */}
      {showComments && (
        <div className="space-y-4 border-t border-gray-50 bg-gray-50/60 p-4">
          {/* Create comment form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-3">
            <img
              src={user?.avatar_url || "/images/default-avatar.jpg"}
              alt="My Avatar"
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            <div className="relative flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết phản hồi sống xanh của bạn..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-10 pl-3 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
              <button
                type="submit"
                disabled={commenting || !newComment.trim()}
                className="absolute top-1.5 right-2 cursor-pointer text-emerald-600 transition-colors hover:text-emerald-700 disabled:text-gray-300"
              >
                <CornerDownRight size={16} />
              </button>
            </div>
          </form>

          {/* Comments list */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-3 pt-2">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5 text-xs">
                  <img
                    src={comment.authorAvatar || "/images/default-avatar.jpg"}
                    alt="Commenter Avatar"
                    className="mt-0.5 h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <div className="flex-1 rounded-xl border border-gray-100 bg-white p-2.5 shadow-2xs">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-semibold text-gray-800">
                        {comment.authorName}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="leading-normal text-gray-600">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-2 text-center text-xs font-medium text-gray-400">
              Chưa có bình luận nào. Hãy gửi phản hồi đầu tiên nhé!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PostCard;
