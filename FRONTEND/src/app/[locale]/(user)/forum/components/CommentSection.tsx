"use client";

import { ACCESS_TOKEN } from "@/src/services";
import { useCreateComment, useForumComments } from "@/src/hooks/useForum";
import { useProfile } from "@/src/hooks/useProfile";
import { ForumComment } from "@/src/types/forum/forum.type";
import { getCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: string;
  initialIsOpen?: boolean;
}

export default function CommentSection({ postId }: CommentSectionProps) {
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

  const profileName = profile?.fullName || profile?.username || "Thành viên";

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
    <div className="mt-6 rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm md:p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-6 text-[18px] font-[600] text-[#1B1B1B] dark:text-gray-100">
        Bình luận ({comments.length})
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
          <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
            <p className="text-[14px] text-[#5C5C5C] dark:text-gray-400">
              Vui lòng{" "}
              <Link
                href="/login"
                className="font-semibold text-[#2F9E44] hover:underline dark:text-green-400"
              >
                đăng nhập
              </Link>{" "}
              để bình luận về bài viết này.
            </p>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2
              className="h-6 w-6 animate-spin text-[#2F9E44]"
              aria-hidden="true"
            />
          </div>
        ) : isError ? (
          <p className="text-center text-[14px] text-red-500">
            Không thể tải danh sách bình luận.
          </p>
        ) : visibleComments.length > 0 ? (
          visibleComments.map((comment: ForumComment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="py-4 text-center text-[14px] text-[#5C5C5C] dark:text-gray-400">
            Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ ý kiến!
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
              Hiển thị thêm bình luận ({comments.length - visibleCount})
            </button>
          )}
          {visibleCount > 3 && (
            <button
              onClick={() => setVisibleCount(3)}
              className="cursor-pointer text-[14px] font-[500] text-[#5C5C5C] transition-colors hover:text-[#1B1B1B] hover:underline dark:text-gray-400 dark:hover:text-gray-200"
            >
              Thu gọn
            </button>
          )}
        </div>
      )}
    </div>
  );
}
