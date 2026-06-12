"use client";

import { Camera, Loader2, Send, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface CommentInputProps {
  placeholder?: string;
  submitLabel?: string;
  isPending?: boolean;
  onSubmit: (content: string, image: File | null) => Promise<void>;
  avatarUrl?: string;
  profileName?: string;
}

export default function CommentInput({
  placeholder,
  isPending = false,
  onSubmit,
  avatarUrl,
  profileName,
}: CommentInputProps) {
  const t = useTranslations("forum");
  const MIN_COMMENT_LENGTH = 10;

  const defaultPlaceholder = placeholder || t("writeCommentPlaceholder");
  const defaultProfileName = profileName || t("user");

  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trimmedContent = content.trim();
  const showCommentMinWarning =
    trimmedContent.length > 0 && trimmedContent.length < MIN_COMMENT_LENGTH;

  // Clean up URL object on unmount to prevent memory leaks
  const activePreviewRef = useRef<string | null>(null);
  useEffect(() => {
    activePreviewRef.current = previewUrl;
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (activePreviewRef.current) {
        URL.revokeObjectURL(activePreviewRef.current);
      }
    };
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("commentImageSizeError"));
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("commentImageTypeError"));
      return;
    }

    // Revoke old URL first if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitClick = async () => {
    const trimmed = trimmedContent;
    if (!trimmed && !image) return;

    if (trimmed && trimmed.length < MIN_COMMENT_LENGTH) {
      toast.error(t("commentMinLengthError"));
      return;
    }

    if (trimmed.length > 1000) {
      toast.error(t("commentLengthError"));
      return;
    }

    try {
      await onSubmit(trimmed, image);
      setContent("");
      removeImage();
    } catch (err) {
      // Errors are handled by the caller mutation
    }
  };

  const inputArea = (
    <div className="flex flex-1 flex-col gap-2">
      {/* Image Preview Thumbnail */}
      {previewUrl && (
        <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <img
            src={previewUrl}
            alt="Preview attachment"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-rose-600 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
            aria-label={t("cancelAttachedImage")}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={defaultPlaceholder}
            maxLength={1000}
            aria-label={t("commentInputAria")}
            className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 pr-12 pb-8 text-[14px] text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitClick();
              }
            }}
          />
          {showCommentMinWarning && (
            <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">
              {t("commentMinLengthError")}
            </p>
          )}
          <span className="absolute right-3 bottom-2 text-[10px] font-medium text-[#9E9E9E] dark:text-gray-500">
            {content.length}/1000
          </span>

          {/* Hidden File input */}
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
          />

          {/* Camera Trigger Icon button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label={t("cameraAria")}
            className="absolute top-2 right-2 cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-green-600 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none dark:hover:bg-gray-700"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmitClick}
          disabled={
            (!trimmedContent && !image) || showCommentMinWarning || isPending
          }
          className="flex h-11 w-11 shrink-0 transform cursor-pointer items-center justify-center rounded-xl bg-[#2F9E44] p-3 text-white transition-colors hover:bg-[#1F6F2E] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none active:scale-95 disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );

  if (avatarUrl) {
    return (
      <div className="flex gap-3">
        <img
          src={
            avatarUrl ||
            "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png"
          }
          alt={defaultProfileName}
          className="border-gray-105 h-10 w-10 shrink-0 rounded-full border object-cover dark:border-gray-800"
        />
        {inputArea}
      </div>
    );
  }

  return inputArea;
}
