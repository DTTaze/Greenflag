/* eslint-disable max-lines */
"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  useCreateComment,
  useDeleteComment,
  useVoteComment,
} from "@/src/hooks/useForum";
import { useProfile } from "@/src/hooks/useProfile";
import { ForumComment } from "@/src/types/forum/forum.type";

import CommentInput from "./CommentInput";

const renderRoleBadge = (role: "admin" | "partner" | "user", t: any) => {
  switch (role) {
    case "admin":
      return (
        <span className="dark:text-rose-455 shrink-0 rounded-full border border-rose-100 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:border-rose-900/30 dark:bg-rose-950/40">
          {t("admin")}
        </span>
      );
    case "partner":
      return (
        <span className="dark:text-indigo-405 shrink-0 rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-950/40">
          {t("partner")}
        </span>
      );
    case "user":
    default:
      return (
        <span className="dark:text-slate-405 shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:border-slate-700/30 dark:bg-slate-800/40">
          {t("user")}
        </span>
      );
  }
};

interface CommentItemProps {
  comment: ForumComment;
  isReply?: boolean;
}

export default function CommentItem({
  comment,
  isReply = false,
}: CommentItemProps) {
  const t = useTranslations("forum");
  const locale = useLocale();

  const [vote, setVote] = useState<"up" | "down" | null>(
    comment.userVote || null,
  );
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [visibleRepliesCount, setVisibleRepliesCount] = useState(3);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { profile } = useProfile();

  const voteMutation = useVoteComment();
  const createCommentMutation = useCreateComment(comment.postId);
  const deleteCommentMutation = useDeleteComment(comment.postId);

  useEffect(() => {
    setVote(comment.userVote || null);
  }, [comment.userVote]);

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
    voteMutation.mutate({
      commentId: comment.id,
      postId: comment.postId,
      type: nextVote,
    });
  };

  const handleDownvote = () => {
    const nextVote = vote === "down" ? "none" : "down";
    setVote(nextVote === "none" ? null : nextVote);
    voteMutation.mutate({
      commentId: comment.id,
      postId: comment.postId,
      type: nextVote,
    });
  };

  // Calculate displayed upvotes and downvotes optimistically
  const initialUserVote = comment.userVote || null;
  let displayedUpvotes = comment.upvotes;
  let displayedDownvotes = comment.downvotes;

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

  const handleReplySubmit = (content: string, imageFile: File | null) => {
    return new Promise<void>((resolve, reject) => {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("parentId", comment.id);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      createCommentMutation.mutate(formData, {
        onSuccess: () => {
          setShowReplyInput(false);
          resolve();
        },
        onError: (err) => reject(err),
      });
    });
  };

  const formattedDate = new Intl.DateTimeFormat(
    locale === "en" ? "en-US" : "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date(comment.createdAt));

  const isAuthor = profile?.id === comment.author.id;
  const isAdmin = profile?.role === "admin";
  const canDelete = isAuthor || isAdmin;

  return (
    <div className={`flex gap-3 ${isReply ? "mt-4" : "mt-5"}`}>
      {/* Avatar */}
      <img
        src={
          comment.author.avatarUrl ||
          "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png"
        }
        alt={comment.author.name}
        className={`${isReply ? "h-8 w-8" : "h-10 w-10"} shrink-0 rounded-full border border-gray-100 object-cover dark:border-gray-800`}
      />

      {/* Content Area */}
      <div className="flex-1">
        <div className="group relative">
          <div className="dark:border-gray-750/30 rounded-2xl border border-transparent bg-[#F0F2F5] px-4 py-3 shadow-xs dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="dark:text-gray-105 text-[14px] font-[600] text-[#1B1B1B]">
                  {comment.author.name}
                </span>
                {renderRoleBadge(comment.author.role, t)}
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
                    className="cursor-pointer rounded-full p-1 text-[#5C5C5C] opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 z-10 mt-1 w-44 rounded-lg border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:border-gray-800 dark:bg-gray-900">
                      <button
                        type="button"
                        onClick={() => {
                          setShowDropdown(false);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-650 flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("deleteComment")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="mt-1 text-[14px] leading-relaxed text-[#1B1B1B] dark:text-gray-200">
              {comment.content}
            </p>
            {comment.imageUrl && (
              <div className="relative mt-2 inline-block max-h-[200px] w-auto overflow-hidden rounded-lg">
                <img
                  src={comment.imageUrl}
                  alt="Comment attachment"
                  className="cursor-pointer rounded-lg object-contain transition-opacity hover:opacity-95"
                  style={{ maxHeight: "200px", maxWidth: "100%" }}
                  onClick={() =>
                    comment.imageUrl && window.open(comment.imageUrl, "_blank")
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-4 px-2 text-[13px] font-[500] text-[#5C5C5C] dark:text-gray-400">
          <span>{formattedDate}</span>
          <button
            onClick={handleUpvote}
            className={`flex cursor-pointer items-center gap-0.5 transition-colors hover:text-[#2F9E44] dark:hover:text-green-400 ${vote === "up" ? "font-[600] text-[#2F9E44]" : ""}`}
          >
            <span>{t("helpful")}</span>
            <span>({displayedUpvotes})</span>
          </button>

          <button
            onClick={handleDownvote}
            className={`flex cursor-pointer items-center gap-0.5 transition-colors hover:text-[#E53935] dark:hover:text-red-400 ${vote === "down" ? "font-[600] text-[#E53935]" : ""}`}
          >
            <span>{t("notHelpful")}</span>
            <span>({displayedDownvotes})</span>
          </button>

          {!isReply && (
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="cursor-pointer transition-colors hover:text-[#2F9E44] dark:hover:text-green-400"
            >
              {t("reply")}
            </button>
          )}
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-3">
            <CommentInput
              placeholder={t("writeReplyPlaceholder", {
                name: comment.author.name,
              })}
              isPending={createCommentMutation.isPending}
              onSubmit={handleReplySubmit}
            />
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-2 border-l-2 border-[#E0E0E0] pl-4 dark:border-gray-800">
            {comment.replies.slice(0, visibleRepliesCount).map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}

            {/* Show More / Hide Buttons for Replies */}
            {comment.replies.length > 3 && (
              <div className="mt-3 flex items-center gap-4 pt-1">
                {comment.replies.length > visibleRepliesCount && (
                  <button
                    onClick={() => setVisibleRepliesCount((prev) => prev + 5)}
                    className="cursor-pointer text-[12px] font-[600] text-[#2F9E44] transition-colors hover:text-[#1F6F2E] hover:underline dark:text-green-400 dark:hover:text-green-300"
                  >
                    {t("showMoreReplies", {
                      count: comment.replies.length - visibleRepliesCount,
                    })}
                  </button>
                )}
                {visibleRepliesCount > 3 && (
                  <button
                    onClick={() => setVisibleRepliesCount(3)}
                    className="cursor-pointer text-[12px] font-[500] text-[#5C5C5C] transition-colors hover:text-[#1B1B1B] hover:underline dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {t("collapse")}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">
              {t("confirmDeleteCommentTitle")}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t("confirmDeleteCommentDesc")}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deleteCommentMutation.mutateAsync(comment.id);
                    toast.success(t("deleteCommentSuccess"));
                  } catch (err: any) {
                    toast.error(err.message || t("deleteCommentFailed"));
                  } finally {
                    setShowDeleteConfirm(false);
                  }
                }}
                className="bg-red-650 focus-visible:outline-red-650 cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
