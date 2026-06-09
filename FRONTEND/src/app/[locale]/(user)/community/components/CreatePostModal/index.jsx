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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-lg transform flex-col overflow-hidden rounded-2xl bg-slate-900/95 border border-slate-800/85 shadow-2xl transition-all">
        {/* Decorative Glow */}
        <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-slate-800/60 p-5">
          <h2 className="flex items-center gap-1.5 text-md font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            <Sparkles size={18} className="text-emerald-400" /> Chia sẻ hoạt động sống xanh
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all duration-200"
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
              className="h-10 w-10 rounded-full border border-slate-850 object-cover bg-slate-950"
            />
            <div>
              <h4 className="text-sm font-semibold text-white">
                {user?.full_name || user?.username}
              </h4>
              <span className="inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
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
            className="w-full resize-none border-0 border-b border-slate-800/80 bg-transparent py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-0 focus:outline-none transition-colors"
          />

          {/* Image preview */}
          {imagePreview && (
            <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
              <img
                src={imagePreview}
                alt="Selected preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2.5 right-2.5 rounded-full bg-black/60 p-1.5 text-slate-350 hover:text-white hover:bg-black/90 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* Alert moderation warning */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-900/20 bg-amber-950/10 p-3.5 text-xs text-amber-400">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-500" />
            <p className="leading-relaxed">
              <strong>Lưu ý:</strong> Để đảm bảo xây dựng một cộng đồng lành
              mạnh, bài viết sẽ trải qua kiểm duyệt từ quản trị viên trước khi
              hiển thị công khai trên Bảng tin.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-slate-800/60 pt-4.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-850 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
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
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/10 active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 transition-all duration-200"
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
