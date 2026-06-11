"use client";

import PostStatusBadge from "../../../forum/components/PostStatusBadge";
import { useDeletePost, useMyPosts } from "@/src/hooks/useForum";
import { forumService } from "@/src/services/forum.service";
import { ForumPost } from "@/src/types/forum/forum.type";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  Calendar,
  Edit,
  Globe,
  History,
  MessageSquare,
  Search,
  Send,
  Tag,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type StatusTab = "ALL" | "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

export default function MyPostsPage() {
  const [activeTab, setActiveTab] = useState<StatusTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Edit / Publish Draft Modal
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("Hỏi đáp");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Custom confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Escape key handler to close the modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingPost(null);
        setDeleteConfirmId(null);
      }
    };
    if (editingPost || deleteConfirmId) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editingPost, deleteConfirmId]);

  // Fetch own posts with status and search
  const statusParam = activeTab === "ALL" ? undefined : activeTab;
  const {
    data: res,
    isLoading,
    refetch,
  } = useMyPosts({
    status: statusParam,
    search: debouncedSearch.trim() || undefined,
  });

  const posts = res?.success ? res.data : [];

  const deletePostMutation = useDeletePost();

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deletePostMutation.mutateAsync(deleteConfirmId);
      toast.success("Xóa bài viết thành công!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Không thể xóa bài viết.");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleEditClick = (post: ForumPost) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditCategory(post.category || "Hỏi đáp");
    setEditTags(post.tags || []);
    setTagInput("");
  };

  const handleSaveDraftOnly = async () => {
    if (!editingPost) return;
    if (!editContent.trim()) {
      toast.error("Nội dung bài viết không được để trống!");
      return;
    }

    setIsSaving(true);
    try {
      await forumService.updatePost(editingPost.id, {
        content: editContent.trim(),
        category: editCategory,
        tags: editTags,
      });
      toast.success("Đã lưu bản nháp thành công!");
      setEditingPost(null);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi lưu bản nháp.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishDraft = async () => {
    if (!editingPost) return;
    if (!editContent.trim()) {
      toast.error("Nội dung bài viết không được để trống!");
      return;
    }

    setIsSaving(true);
    try {
      // Transition from DRAFT to PENDING / APPROVED by passing isDraft: false
      const result = await forumService.updatePost(editingPost.id, {
        content: editContent.trim(),
        category: editCategory,
        tags: editTags,
        // Trigger server-side Regex & LLM validation
        ...({ isDraft: false } as any),
      });

      if (result.success && result.data?.status === "rejected") {
        toast.warning(
          `Bài đăng bị từ chối tự động: ${result.data.flaggedReason}`,
        );
      } else if (result.success) {
        toast.success("Đã gửi đăng bài viết thành công! Đang chờ kiểm duyệt.");
      } else {
        toast.error(result.message || "Lỗi khi đăng bài viết.");
      }

      setEditingPost(null);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi đăng bài viết.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/#/g, "");
      if (newTag && !editTags.includes(newTag)) {
        setEditTags([...editTags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="mx-auto max-w-[800px] flex-col gap-6 pt-6 pb-20">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-[24px] font-[700] text-[#1B1B1B] dark:text-gray-100">
            Bài viết của tôi
          </h1>
          <p className="text-[14px] text-[#5C5C5C] dark:text-gray-400">
            Xem lịch sử đăng bài, quản lý bản nháp và theo dõi trạng thái kiểm
            duyệt bài viết.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full shrink-0 md:w-[250px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9E9E9E]">
            <Search className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết…"
            aria-label="Tìm kiếm bài viết của tôi"
            className="w-full rounded-full border border-[#E0E0E0] bg-white py-2 pr-4 pl-9 text-[13px] text-[#1B1B1B] placeholder-[#9E9E9E] focus:border-[#2F9E44] focus:ring-1 focus:ring-[#2F9E44] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Segmented Control Navigation */}
      <div className="mb-6 flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        <Link
          href="/forum"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-center font-medium text-gray-600 transition hover:text-[#2F9E44] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:text-gray-400 dark:hover:text-green-400"
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span>Diễn đàn chung</span>
        </Link>
        <Link
          href="/forum/my-posts"
          className="dark:bg-gray-750 flex flex-1 items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-center font-bold text-[#2F9E44] shadow-xs focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:text-green-400"
        >
          <History className="h-4 w-4" aria-hidden="true" />
          <span>Bài viết của tôi</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
        <nav
          className="-mb-px flex space-x-6 overflow-x-auto"
          aria-label="Tabs"
        >
          {(
            [
              { key: "ALL", label: "Tất cả" },
              { key: "DRAFT", label: "Bản nháp" },
              { key: "PENDING", label: "Chờ duyệt" },
              { key: "APPROVED", label: "Đã đăng" },
              { key: "REJECTED", label: "Bị từ chối" },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`border-b-2 px-1 pb-4 text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none ${
                  isActive
                    ? "border-[#2F9E44] text-[#2F9E44]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#2F9E44]" />
          <p className="mt-2 text-sm text-gray-500">Đang tải bài viết…</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E0E0E0] bg-white py-16 text-center dark:border-gray-800 dark:bg-gray-900">
          <MessageSquare
            className="h-10 w-10 text-gray-300 dark:text-gray-700"
            aria-hidden="true"
          />
          <h3 className="mt-4 text-[15px] font-semibold text-gray-900 dark:text-white">
            Không tìm thấy bài viết nào
          </h3>
          <p className="mt-1 text-[13px] text-[#5C5C5C]">
            Bạn chưa có bài viết nào thuộc mục này.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post: ForumPost) => (
            <div
              key={post.id}
              className="group overflow-hidden rounded-xl border border-[#E0E0E0] bg-white p-5 transition-all hover:border-[#2F9E44]/30 dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-2.5 text-[12px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <span>•</span>
                  {post.category && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Tag className="h-3 w-3" aria-hidden="true" />
                      {post.category}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <PostStatusBadge
                    status={post.status}
                    rejectedBy={post.rejectedBy}
                  />
                </div>
              </div>

              {/* Content body */}
              <p className="mt-3 text-[14px] leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {post.content}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="dark:bg-gray-850 inline-block rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:border-gray-800 dark:text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Attached images */}
              {post.images && post.images.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {post.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800"
                      onClick={() => window.open(imgUrl, "_blank")}
                    >
                      <img
                        src={imgUrl}
                        alt="Preview"
                        className="h-full w-full object-cover transition-opacity hover:opacity-95"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Reject reason overlay */}
              {post.status === "rejected" && post.flaggedReason && (
                <div className="mt-3 flex items-start gap-1.5 rounded-lg border border-rose-100/50 bg-rose-50/50 p-3 text-[12px] text-rose-800">
                  <AlertTriangle
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-bold">Lý do từ chối:</span>{" "}
                    {post.flaggedReason}
                  </div>
                </div>
              )}

              {/* Footer controls */}
              <div className="mt-4 flex items-center justify-end gap-2.5 border-t border-dashed border-gray-100 pt-3 dark:border-gray-800">
                {post.status === "draft" && (
                  <button
                    type="button"
                    onClick={() => handleEditClick(post)}
                    className="flex items-center gap-1 rounded-lg bg-[#E6F4EA] px-3 py-1.5 text-[12px] font-bold text-[#2F9E44] transition hover:bg-[#D4EDDA] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:bg-emerald-950/20 dark:text-emerald-400"
                  >
                    <Edit className="h-3.5 w-3.5" aria-hidden="true" /> Chỉnh
                    sửa & Đăng bài
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(post.id)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-bold text-rose-600 transition hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:hover:bg-rose-950/10"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Xóa bài
                  viết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Draft Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setEditingPost(null)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-xl transform overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <div className="flex items-center gap-2 text-[#2F9E44]">
                <Edit className="h-5 w-5" aria-hidden="true" />
                <span className="text-[16px] font-bold">
                  Chỉnh sửa bản nháp bài viết
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[60vh] space-y-4 overflow-y-auto py-4 pr-1">
              <div>
                <label
                  htmlFor="edit-category-select"
                  className="mb-1.5 block text-[13px] font-[600] text-gray-700 dark:text-gray-300"
                >
                  Thể loại bài đăng
                </label>
                <select
                  id="edit-category-select"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 text-sm text-[#1B1B1B] outline-none focus:border-[#2F9E44] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value="Hỏi đáp">Hỏi đáp</option>
                  <option value="Kinh nghiệm">Kinh nghiệm</option>
                  <option value="Thảo luận chung">Thảo luận chung</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-content-input"
                  className="mb-1.5 block text-[13px] font-[600] text-gray-700 dark:text-gray-300"
                >
                  Nội dung bài viết
                </label>
                <textarea
                  id="edit-content-input"
                  rows={5}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Nhập nội dung chia sẻ hoặc thắc mắc của bạn…"
                  className="w-full rounded-lg border border-[#E0E0E0] bg-white p-3 text-sm text-[#1B1B1B] placeholder-[#9E9E9E] outline-none focus:border-[#2F9E44] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                />
              </div>

              {/* Tags management */}
              <div>
                <label
                  htmlFor="edit-tags-input"
                  className="mb-1.5 block text-[13px] font-[600] text-gray-700 dark:text-gray-300"
                >
                  Nhãn chủ đề (Ấn Enter để lưu nhãn)
                </label>
                <input
                  id="edit-tags-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Ví dụ: sống xanh, tái chế…"
                  className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 text-sm text-[#1B1B1B] placeholder-[#9E9E9E] outline-none focus:border-[#2F9E44] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                />
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {editTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded border border-emerald-500/10 bg-emerald-50 px-2 py-1 text-xs font-semibold text-[#2F9E44] dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        aria-label={`Xóa nhãn ${tag}`}
                        className="font-extrabold hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveDraftOnly}
                className="rounded-lg border border-[#2F9E44] px-4 py-2 text-sm font-semibold text-[#2F9E44] transition-colors hover:bg-emerald-50 disabled:opacity-50 dark:hover:bg-emerald-950/20"
              >
                Lưu bản nháp
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handlePublishDraft}
                className="flex items-center gap-1.5 rounded-lg bg-[#2F9E44] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#1F6F2E] disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
                <span>Đăng công khai</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">
              Xác nhận xóa bài viết
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Bạn có chắc chắn muốn xóa bài viết này không? Thao tác này không
              thể hoàn tác.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
