"use client";

import { getCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useCreateComment, useForumComments } from "@/src/hooks/useForum";
import { useProfile } from "@/src/hooks/useProfile";
import { ACCESS_TOKEN } from "@/src/services";
import { ForumComment } from "@/src/types/forum/forum.type";

import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: string;
  initialIsOpen?: boolean;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const t = useTranslations("forum");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [visibleCount, setVisibleCount] = useState(3);
  const { profile } = useProfile();

  // Load comments dynamically from server via React Query
  const { data: response, isLoading, isError } = useForumComments(postId);
  const createCommentMutation = useCreateComment(postId);

  const comments = (response?.success ? response.data?.items : null) || [];

  const profileName = profile?.fullName || profile?.username || t("user");

  const avatarUrl = profile?.avatarUrl || "";

  const handleSubmit = (content: string, imageFile: File | null) => {
    return new Promise<void>((resolve, reject) => {
      const formData = new FormData();
      formData.append("content", content);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      createCommentMutation.mutate(formData, {
        onSuccess: () => resolve(),
        onError: (err) => reject(err),
      });
    });
  };

  const visibleComments = comments.slice(0, visibleCount);

  return (
    <div className="mt-6 rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md md:p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-6 text-[18px] font-[600] text-[#1B1B1B] dark:text-gray-100">
        {t("comments", { count: comments.length })}
      </h3>

      {/* Comment Input */}
      <div className="mb-8">
        {!mounted ? (
          <div className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
        ) : getCookie(ACCESS_TOKEN) ? (
          <CommentInput
            onSubmit={handleSubmit}
            avatarUrl={avatarUrl}
            profileName={profileName}
            isPending={createCommentMutation.isPending}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-[#E0E0E0] bg-gray-50/50 p-6 text-center dark:border-gray-800 dark:bg-gray-950/20">
            <p className="text-[14px] font-medium text-[#5C5C5C] dark:text-gray-400">
              {t("loginToComment")
                .split(t("login"))
                .map((part, index, arr) => (
                  <span key={index}>
                    {part}
                    {index < arr.length - 1 && (
                      <Link
                        href="/login"
                        className="mx-1 font-bold text-[#2F9E44] hover:underline dark:text-green-400"
                      >
                        {t("login")}
                      </Link>
                    )}
                  </span>
                ))}
            </p>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2
              className="h-6 w-6 animate-spin text-[#2F9E44]"
              aria-hidden="true"
            />
          </div>
        ) : isError ? (
          <p className="text-center text-[14px] font-semibold text-red-500">
            {t("loadCommentsFailed")}
          </p>
        ) : visibleComments.length > 0 ? (
          visibleComments.map((comment: ForumComment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="py-6 text-center text-[14px] text-[#5C5C5C] italic dark:text-gray-400">
            {t("noComments")}
          </p>
        )}
      </div>

      {/* Show More / Hide Buttons */}
      {comments.length > 3 && (
        <div className="mt-4 flex items-center gap-4 border-t border-[#F0F2F5] pt-3 dark:border-gray-800">
          {comments.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="cursor-pointer text-[14px] font-[600] text-[#2F9E44] transition-colors hover:text-[#1F6F2E] hover:underline dark:text-green-400 dark:hover:text-green-300"
            >
              {t("showMoreComments", { count: comments.length - visibleCount })}
            </button>
          )}
          {visibleCount > 3 && (
            <button
              onClick={() => setVisibleCount(3)}
              className="cursor-pointer text-[14px] font-[500] text-[#5C5C5C] transition-colors hover:text-[#1B1B1B] hover:underline dark:text-gray-400 dark:hover:text-gray-200"
            >
              {t("collapse")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
