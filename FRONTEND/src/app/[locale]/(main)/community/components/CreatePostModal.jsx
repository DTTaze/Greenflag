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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-lg transform flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-emerald-50/20 p-4">
          <h2 className="flex items-center gap-1.5 text-lg font-bold text-[#0B6E4F]">
            <Sparkles size={18} /> Chia sẻ hoạt động sống xanh
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto p-5"
        >
          {/* User info */}
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar_url || "/images/default-avatar.jpg"}
              alt="Avatar"
              className="h-10 w-10 rounded-full border border-gray-100 object-cover"
            />
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                {user?.full_name || user?.username}
              </h4>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
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
            className="w-full resize-none border-0 border-b border-gray-100 py-2 text-sm placeholder-gray-400 focus:border-emerald-600 focus:ring-0 focus:outline-none"
          />

          {/* Image preview */}
          {imagePreview && (
            <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
              <img
                src={imagePreview}
                alt="Selected preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 cursor-pointer rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Alert moderation warning */}
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p className="leading-relaxed">
              <strong>Lưu ý:</strong> Để đảm bảo xây dựng một cộng đồng lành
              mạnh, bài viết sẽ trải qua kiểm duyệt từ quản trị viên trước khi
              hiển thị công khai trên Bảng tin.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              <ImageIcon size={16} className="text-emerald-600" />
              Thêm hình ảnh
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              hidden
            />
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-4 py-2 text-xs font-bold text-gray-500 transition-colors hover:text-gray-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer rounded-lg bg-[#0B6E4F] px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#075039] disabled:bg-gray-300"
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
