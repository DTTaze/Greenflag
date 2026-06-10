"use client";

import { AlertCircle, Image as ImageIcon, Sparkles, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

import { createCommunityPost } from "@/src/services/community.service";
import { useAuthStore } from "@/src/store/auth/authStore";

function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { user } = useAuthStore();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(""); // Base64 representation of image
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImage(reader.result); // Base64 encoding
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Vui lòng đăng nhập");
      return;
    }
    if (!content.trim() && !image) {
      toast.warning("Vui lòng nhập nội dung hoặc thêm hình ảnh!");
      return;
    }

    try {
      setSubmitting(true);
      await createCommunityPost(
        content,
        user.full_name || user.username || "Thành viên",
        user.email,
        image,
        user.avatar_url,
      );

      toast.success("🎉 Bài viết đã được gửi! Đang chờ Admin duyệt.", {
        position: "top-right",
        autoClose: 4000,
      });

      // Reset states and close
      setContent("");
      handleRemoveImage();
      onPostCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("❌ Đã xảy ra lỗi khi đăng bài viết.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-lg transform flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/20 transition-all dark:border-slate-800/85 dark:bg-slate-900/95 dark:shadow-black/40">
        {/* Decorative Glow */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/10" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-sky-300/25 blur-3xl dark:bg-blue-500/10" />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800/60">
          <h2 className="text-md flex items-center gap-1.5 bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text font-bold text-transparent dark:from-emerald-400 dark:to-teal-300">
            <Sparkles size={18} className="text-emerald-400" /> Chia sẻ hoạt
            động sống xanh
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative flex-1 space-y-4 overflow-y-auto p-6"
        >
          {/* User info */}
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar_url || "/images/default-avatar.jpg"}
              alt="Avatar"
              className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 object-cover dark:border-slate-800 dark:bg-slate-950"
            />
            <div>
              <h4 className="text-sm font-semibold text-slate-950 dark:text-white">
                {user?.full_name || user?.username}
              </h4>
              <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                Thành viên xanh
              </span>
            </div>
          </div>

          {/* Content field */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Kể về hành động xanh của bạn hôm nay (Ví dụ: Trồng thêm một cái cây #TrongCay, Phân loại rác thải nhựa #TaiChe...)"
            rows={5}
            className="w-full resize-none border-0 border-b border-slate-200 bg-transparent py-2 text-sm text-slate-900 placeholder-slate-500 transition-colors focus:border-emerald-500 focus:ring-0 focus:outline-none dark:border-slate-800/80 dark:text-white dark:placeholder-slate-500"
          />

          {/* Image preview */}
          {imagePreview && (
            <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-950/40">
              <img
                src={imagePreview}
                alt="Selected preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2.5 right-2.5 rounded-full bg-black/60 p-1.5 text-slate-200 transition-colors hover:bg-black/90 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* Alert moderation warning */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-500" />
            <p className="leading-relaxed">
              <strong>Lưu ý:</strong> Để đảm bảo xây dựng một cộng đồng lành
              mạnh, bài viết sẽ trải qua kiểm duyệt từ quản trị viên trước khi
              hiển thị công khai trên Bảng tin.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4.5 dark:border-slate-800/60">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <ImageIcon size={16} className="text-emerald-400" />
              Thêm hình ảnh
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              hidden
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-500 active:scale-95 disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800"
              >
                {submitting ? "Đang đăng..." : "Đăng bài"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
