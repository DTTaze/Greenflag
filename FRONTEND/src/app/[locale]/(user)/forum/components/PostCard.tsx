/* eslint-disable max-lines */
"use client";

import { MessageSquare, MoreHorizontal, Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useDeletePost, useVotePost } from "@/src/hooks/useForum";
import { useProfile } from "@/src/hooks/useProfile";
import { ForumPost } from "@/src/types/forum/forum.type";

import CommentSection from "./CommentSection";
import EventEmbeddedCard from "./EventEmbeddedCard";

const renderRoleBadge = (role: "admin" | "partner" | "user", t: any) => {
  switch (role) {
    case "admin":
      return (
        <span className="dark:text-rose-450 shrink-0 rounded-full border border-rose-100 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:border-rose-900/30 dark:bg-rose-950/40">
          {t("admin")}
        </span>
      );
    case "partner":
      return (
        <span className="shrink-0 rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-950/40 dark:text-indigo-400">
          {t("partner")}
        </span>
      );
    case "user":
    default:
      return (
        <span className="text-slate-650 dark:text-slate-405 shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold dark:border-slate-700/30 dark:bg-slate-800/40">
          {t("user")}
        </span>
      );
  }
};

interface PostCardProps {
  post: ForumPost;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("forum");

  const [vote, setVote] = useState<"up" | "down" | null>(post.userVote || null);
  const [showComments, setShowComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { profile } = useProfile();

  const renderContent = (text: string) => {
    if (!text) return null;
    const parts = text.split(/((?:^|\s)@[a-zA-Z0-9_.]+)/g);
    return parts.map((part, index) => {
      if (part.trim().startsWith("@")) {
        const username = part.trim().slice(1);
        const prefix = part.slice(0, part.indexOf("@")); // Lấy khoảng trắng nếu có
        return (
          <span key={index}>
            {prefix}
            <Link
              href={`/profile/${username}`}
              className="text-blue-650 font-semibold hover:underline dark:text-blue-400"
              onClick={(e) => e.stopPropagation()}
            >
              @{username}
            </Link>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const voteMutation = useVotePost();
  const deletePostMutation = useDeletePost();

  useEffect(() => {
    setVote(post.userVote || null);
  }, [post.userVote]);

  // Click outside listener to close the dropdown
  useEffect(() => {
    if (!showDropdown) return;
    const handleOutsideClick = () => setShowDropdown(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [showDropdown]);

  const handleUpvote = () => {
    const nextVote = vote === "up" ? "none" : "up";
    setVote(nextVote === "none" ? null : nextVote);
    voteMutation.mutate({ postId: post.id, type: nextVote });
  };

  const handleDownvote = () => {
    const nextVote = vote === "down" ? "none" : "down";
    setVote(nextVote === "none" ? null : nextVote);
    voteMutation.mutate({ postId: post.id, type: nextVote });
  };

  // Calculate displayed upvotes and downvotes optimistically
  const initialUserVote = post.userVote || null;
  let displayedUpvotes = post.upvotes;
  let displayedDownvotes = post.downvotes;

  if (initialUserVote === "up") {
    if (vote === null) {
      displayedUpvotes = Math.max(0, displayedUpvotes - 1);
    } else if (vote === "down") {
      displayedUpvotes = Math.max(0, displayedUpvotes - 1);
      displayedDownvotes += 1;
    }
  } else if (initialUserVote === "down") {
    if (vote === null) {
      displayedDownvotes = Math.max(0, displayedDownvotes - 1);
    } else if (vote === "up") {
      displayedDownvotes = Math.max(0, displayedDownvotes - 1);
      displayedUpvotes += 1;
    }
  } else {
    if (vote === "up") {
      displayedUpvotes += 1;
    } else if (vote === "down") {
      displayedDownvotes += 1;
    }
  }

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/forum/post/${post.id}`;
      await navigator.clipboard.writeText(url);
      toast.success(t("shareSuccess"));
    } catch (err) {
      toast.error(t("shareFailed"));
    }
  };

  const formattedDate = new Intl.DateTimeFormat(
    locale === "en" ? "en-US" : "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date(post.createdAt));

  const isAuthor = profile?.id === post.author.id;
  const isAdmin = profile?.role === "admin";
  const canDelete = isAuthor || isAdmin;

  return (
    <div
      className={`rounded-xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md ${
        post.isAdminPost
          ? "border-emerald-500 bg-emerald-50/10 shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:shadow-[0_0_16px_rgba(16,185,129,0.25)] dark:border-emerald-500 dark:bg-emerald-950/10"
          : "border-emerald-250/50 bg-white dark:border-emerald-500/15 dark:bg-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={
              post.author.avatarUrl ||
              "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png"
            }
            alt={post.author.name}
            className="h-10 w-10 rounded-full border border-emerald-100 object-cover dark:border-emerald-500/15"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="dark:text-gray-105 font-[600] text-[#1B1B1B]">
                {post.author.name}
              </span>
              {renderRoleBadge(post.author.role, t)}
              {post.isAdminPost && (
                <span className="shrink-0 animate-pulse rounded bg-[#2F9E44] px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                  {t("adminAnnouncement")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#757575] dark:text-gray-400">
              <span>{formattedDate}</span>
              {post.author.location && (
                <>
                  <span>•</span>
                  <span>{post.author.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {canDelete && (
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              aria-label={t("moreOptions")}
              className="cursor-pointer rounded-lg p-2 text-[#5C5C5C] transition-colors hover:bg-[#F0F2F5] dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 z-10 mt-1 w-44 rounded-lg border border-emerald-200 bg-white py-1 shadow-lg ring-1 ring-emerald-500/10 focus:outline-none dark:border-emerald-500/15 dark:bg-gray-900">
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Trash2 className="h-4 w-4" />
                  {t("deletePost")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-3">
        <div
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (
              target.tagName !== "A" &&
              !target.closest("a") &&
              !target.closest("button")
            ) {
              router.push(`/forum/post/${post.id}`);
            }
          }}
          className="cursor-pointer text-[15px] leading-relaxed text-[#1B1B1B] hover:text-[#1F6F2E] dark:text-gray-300 dark:hover:text-emerald-400"
        >
          <div>{renderContent(post.content)}</div>
        </div>

        {post.images && post.images.length > 0 && (
          <div className="relative mt-3 max-h-[400px] w-full overflow-hidden rounded-lg border border-emerald-100 dark:border-emerald-500/15">
            <img
              src={post.images[0]}
              alt="Post attachment"
              className="h-full max-h-[400px] w-full cursor-pointer object-cover transition-opacity hover:opacity-95"
              onClick={() => window.open(post.images[0], "_blank")}
            />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-transparent bg-[#F0F2F5] px-2 py-1 text-[12px] text-[#5C5C5C] dark:border-gray-700/40 dark:bg-gray-800 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.event && <EventEmbeddedCard event={post.event} />}

        {/* Top Forum Solution Highlight (Sneak Peek) */}
        {post.topComment && (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-50/10 p-4 transition-all duration-200 hover:bg-[#E6F4EA]/60 dark:border-green-900/40 dark:bg-green-950/20 dark:hover:bg-green-950/30">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2F9E44] px-2.5 py-1 text-[11px] font-[600] text-white dark:bg-green-700">
                {t("highlightedSolution")}
              </span>
              <span className="text-[12px] font-[600] text-[#2F9E44] dark:text-green-400">
                {t("ratingScore", {
                  score: post.topComment.upvotes - post.topComment.downvotes,
                })}
              </span>
            </div>

            <div className="flex gap-3">
              <img
                src={
                  post.topComment.author.avatarUrl ||
                  "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png"
                }
                alt={post.topComment.author.name}
                className="dark:border-emerald-500/15 h-8 w-8 shrink-0 rounded-full border border-emerald-50 object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-[600] text-[#1B1B1B] dark:text-gray-200">
                    {post.topComment.author.name}
                  </span>
                  {renderRoleBadge(post.topComment.author.role, t)}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-[#333333] dark:text-gray-400">
                  {post.topComment.content}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-emerald-100 pt-3 dark:border-emerald-500/15">
        <div className="flex items-center gap-2">
          {/* Upvote Button */}
          <button
            onClick={handleUpvote}
            className={`flex transform cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-[600] transition-all duration-200 active:scale-95 ${
              vote === "up"
                ? "border-[#2F9E44] bg-[#2F9E44] text-white shadow-sm hover:bg-[#1F6F2E]"
                : "border-emerald-250/60 bg-white text-[#5C5C5C] hover:border-emerald-350 hover:bg-[#F7F7F7] dark:border-emerald-500/15 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span>{t("helpful")}</span>
            <span>({displayedUpvotes})</span>
          </button>

          {/* Downvote Button */}
          <button
            onClick={handleDownvote}
            className={`flex transform cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-[600] transition-all duration-200 active:scale-95 ${
              vote === "down"
                ? "border-[#FCA5A5] bg-[#FEE2E2] text-[#991B1B] shadow-sm hover:bg-[#FECACA] dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
                : "border-emerald-250/60 bg-white text-[#5C5C5C] hover:border-emerald-350 hover:bg-[#F7F7F7] dark:border-emerald-500/15 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span>{t("notHelpful")}</span>
            <span>({displayedDownvotes})</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-[14px] font-[500] text-[#5C5C5C] transition-colors hover:bg-[#F0F2F5] dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            <span>{t("commentCount", { count: post.commentCount })}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-[14px] font-[500] text-[#5C5C5C] transition-colors hover:bg-[#F0F2F5] dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            <span>{t("share")}</span>
          </button>
        </div>
      </div>

      {/* Inline Comments */}
      {showComments && (
        <div className="mt-4 border-t border-emerald-100 pt-4 dark:border-emerald-500/15">
          <CommentSection postId={post.id} initialIsOpen={true} />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-emerald-255 bg-white p-6 shadow-xl dark:border-emerald-500/15 dark:bg-gray-900">
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">
              {t("confirmDeleteTitle")}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t("deleteConfirmDesc")}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="cursor-pointer rounded-xl border border-emerald-250 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-emerald-500/15 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deletePostMutation.mutateAsync(post.id);
                    toast.success(t("deleteSuccess"));
                  } catch (err: any) {
                    toast.error(err.message || t("deleteFailed"));
                  } finally {
                    setShowDeleteConfirm(false);
                  }
                }}
                className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
