/* eslint-disable max-lines */
"use client";

import { getCookie } from "cookies-next";
import {
  Image as ImageIcon,
  Loader2,
  Paperclip,
  Send,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

// Use absolute import or local hook since we already have useCreatePost in hook file
import { useCreatePost as useCreatePostHook } from "@/src/hooks/useForum";
import { useProfile } from "@/src/hooks/useProfile";
import { ACCESS_TOKEN } from "@/src/services";
import { forumService } from "@/src/services/forum.service";
import { searchUsers } from "@/src/services/user.service";
import { EventType } from "@/src/types/event/event.type";

import CategoryTopicSelects from "./CategoryTopicSelects";
import EventSelectionModal from "./EventSelectionModal";
import MiniEventCard from "./MiniEventCard";

// 1. Các chủ đề cố định (Gợi ý chip)
const STATIC_TAGS = ["Hỏi đáp", "Chia sẻ", "Tái chế", "Trồng cây", "Sống xanh"];

export default function CreatePostWidget() {
  const t = useTranslations("forum");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("Sống xanh");
  const [topic, setTopic] = useState<string>("Tái chế");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [customTagInput, setCustomTagInput] = useState(""); // Custom tag input state
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Custom Mentions State
  const [showMentionsDropdown, setShowMentionsDropdown] = useState(false);
  const [mentionSearchQuery, setMentionSearchQuery] = useState("");
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [activeUserIndex, setActiveUserIndex] = useState(0);

  // Mentions & Event state
  const [userList, setUserList] = useState<
    {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      email: string;
    }[]
  >([]);
  const [attachedEvent, setAttachedEvent] = useState<EventType | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const handleMentionSearch = async (text: string) => {
    if (!text) {
      setUserList([]);
      return;
    }
    try {
      const res = await searchUsers(text);
      if (res.success && Array.isArray(res.data)) {
        setUserList(res.data);
      }
    } catch (err) {
      console.error("Lỗi tìm kiếm user:", err);
    }
  };

  // State lưu danh sách gợi ý tổng hợp
  const [suggestedTags] = useState<string[]>(STATIC_TAGS);

  // Keep track of preview URLs to revoke them on unmount
  const activePreviewsRef = useRef<string[]>([]);
  useEffect(() => {
    activePreviewsRef.current = previewUrls;
  }, [previewUrls]);

  useEffect(() => {
    return () => {
      activePreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("imageSizeError", { name: file.name }));
        continue;
      }

      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(t("imageTypeError", { name: file.name }));
        continue;
      }

      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    }

    if (images.length + validFiles.length > 4) {
      toast.warning(t("imageMaxCount"));
      newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      return;
    }

    setImages((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setImages((prev) => prev.filter((_, idx) => idx !== index));
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const { profile } = useProfile();
  const createPostMutation = useCreatePostHook();

  const profileName = profile?.fullName || profile?.username || t("user");
  const avatarUrl = profile?.avatarUrl || "";

  // Core normalization function: lowercase and strip spaces/hashes for case-insensitive duplicate check
  const normalizeTag = (tag: string) => {
    return tag.toLowerCase().replace(/[\s#]/g, "");
  };

  // Checks if tag already exists (case and space insensitive)
  const isTagExists = (newTag: string) => {
    const normalizedNew = normalizeTag(newTag);
    return tags.some(
      (existingTag) => normalizeTag(existingTag) === normalizedNew,
    );
  };

  // Dynamic chip toggler: tap to select/deselect
  const toggleTag = (tagToToggle: string) => {
    if (isTagExists(tagToToggle)) {
      // Exists -> Remove it
      setTags(
        tags.filter((tag) => normalizeTag(tag) !== normalizeTag(tagToToggle)),
      );
    } else {
      // Doesn't exist -> Add it
      if (tags.length >= 5) {
        toast.warning(t("tagMaxCount"));
        return;
      }
      setTags([...tags, tagToToggle]);
    }
  };

  // Add custom tag entered manually
  const handleAddCustomTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = customTagInput.trim();
    if (!trimmed) return;

    if (tags.length >= 5) {
      toast.warning(t("tagMaxCount"));
      return;
    }

    // FRONTEND FILTER: Strip out excessive whitespace and duplicate # characters
    const cleanString = trimmed.replace(/#/g, "").trim().replace(/\s+/g, " ");

    if (cleanString.length > 50) {
      toast.warning(t("tagMaxLength"));
      return;
    }

    if (cleanString.length > 0 && !isTagExists(cleanString)) {
      // Sentence casing (e.g. "tái chế" -> "Tái chế")
      const formattedTag =
        cleanString.charAt(0).toUpperCase() +
        cleanString.slice(1).toLowerCase();
      setTags([...tags, formattedTag]);
    }
    setCustomTagInput("");
  };

  const handleAiEnhance = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      toast.warning(t("aiWarning"));
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await forumService.aiEnhanceContent(trimmed);
      if (response.success && response.data) {
        const {
          enhancedContent,
          hashtags,
          category: suggestedCategory,
        } = response.data;

        setContent(enhancedContent);
        if (suggestedCategory) {
          setCategory(suggestedCategory);
        }
        if (hashtags && hashtags.length > 0) {
          setTopic(hashtags[0]);
          setTags(hashtags.slice(0, 5));
        }

        toast.success(t("aiSuccess"));
      } else {
        throw new Error("API response error");
      }
    } catch (err) {
      // Fallback safety: Keep current content, suggest default metadata
      setTags(["Sống xanh", "Môi trường"]);
      setCategory("Sống xanh");
      setTopic("Tái chế");
      toast.info(t("aiFailed"));
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = (submitAsDraft: boolean) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    if (trimmed.length < 10) {
      toast.error(t("contentMinLength"));
      return;
    }

    if (trimmed.length > 5000) {
      toast.error(t("contentMaxLength"));
      return;
    }

    const formData = new FormData();
    formData.append("content", trimmed);
    formData.append("category_id", category);
    formData.append("topic_id", topic);
    if (submitAsDraft) {
      formData.append("isDraft", "true");
    }

    // Extract tagged usernames using regex from the content text
    const mentionRegex = /(?:^|\s)@([a-zA-Z0-9_.]+)/g;
    const usernames: string[] = [];
    let match;
    while ((match = mentionRegex.exec(trimmed)) !== null) {
      usernames.push(match[1]);
    }
    const finalTaggedUsernames = Array.from(new Set(usernames)).slice(0, 10);

    if (finalTaggedUsernames.length > 0) {
      formData.append("taggedUsernames", finalTaggedUsernames.join(","));
    }

    if (attachedEvent) {
      formData.append("attachedEventId", attachedEvent.id);
    }

    const postTags = tags.length > 0 ? tags : [];
    postTags.forEach((tag) => {
      formData.append("tags", tag);
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    createPostMutation.mutate(formData, {
      onSuccess: () => {
        setContent("");
        setTags([]);
        setCategory("Sống xanh");
        setTopic("Tái chế");
        setAttachedEvent(null);
        setUserList([]);

        // Reset image state
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        setImages([]);
        setPreviewUrls([]);
      },
    });
  };

  // Custom Mentions Handlers
  const handleTextareaChange = (val: string, selectionStart: number) => {
    setContent(val);

    const textBeforeCursor = val.slice(0, selectionStart);
    const lastAtIdx = textBeforeCursor.lastIndexOf("@");

    if (lastAtIdx !== -1) {
      const charBeforeAt = lastAtIdx > 0 ? textBeforeCursor[lastAtIdx - 1] : "";
      const isStartOfWord =
        charBeforeAt === "" || charBeforeAt === " " || charBeforeAt === "\n";

      const textAfterAt = textBeforeCursor.slice(lastAtIdx + 1);
      const hasSpaceAfterAt =
        textAfterAt.includes(" ") || textAfterAt.includes("\n");

      if (isStartOfWord && !hasSpaceAfterAt) {
        setShowMentionsDropdown(true);
        setMentionStartIndex(lastAtIdx);
        setMentionSearchQuery(textAfterAt);
        setActiveUserIndex(0);
        handleMentionSearch(textAfterAt);
        return;
      }
    }

    setShowMentionsDropdown(false);
    setMentionStartIndex(-1);
    setMentionSearchQuery("");
    setUserList([]);
  };

  const selectMention = (username: string) => {
    if (mentionStartIndex === -1) return;
    const val = content;
    const textBefore = val.slice(0, mentionStartIndex);
    const textarea = textareaRef.current;
    const selectionEnd = textarea ? textarea.selectionStart : val.length;
    const textAfter = val.slice(selectionEnd);

    const newContent = `${textBefore}@${username} ${textAfter}`;
    setContent(newContent);
    setShowMentionsDropdown(false);
    setUserList([]);
    setMentionStartIndex(-1);
    setMentionSearchQuery("");

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const cursorPosition = textBefore.length + username.length + 2;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showMentionsDropdown && userList.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveUserIndex((prev) => (prev + 1) % userList.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveUserIndex(
          (prev) => (prev - 1 + userList.length) % userList.length,
        );
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const selectedUser = userList[activeUserIndex];
        if (selectedUser) {
          selectMention(selectedUser.username);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowMentionsDropdown(false);
      }
    }
  };

  const hasToken =
    typeof window !== "undefined" ? !!getCookie(ACCESS_TOKEN) : false;

  if (!mounted || !hasToken) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* 1. Profile information */}
      <div className="mb-3 flex items-center justify-between border-b border-[#E0E0E0] pb-3 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src={
              avatarUrl ||
              "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png"
            }
            alt={profileName}
            className="h-10 w-10 rounded-full border border-gray-100 object-cover dark:border-gray-800"
          />
          <div>
            <span className="text-[14px] font-[600] text-[#1B1B1B] dark:text-gray-100">
              {profileName}
            </span>
            <p className="text-[11px] text-[#9E9E9E] dark:text-gray-500">
              {t("postNew")}
            </p>
          </div>
        </div>
      </div>

      {/* Categories & Topics Select Dropdowns */}
      <div className="mb-3">
        <CategoryTopicSelects
          selectedCategory={category}
          onCategoryChange={setCategory}
          selectedTopic={topic}
          onTopicChange={setTopic}
        />
      </div>

      {/* 2. Textarea with absolute bottom-right AI trigger and custom mentions suggestions */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) =>
            handleTextareaChange(e.target.value, e.target.selectionStart)
          }
          onKeyDown={handleKeyDown}
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement;
            handleTextareaChange(target.value, target.selectionStart);
          }}
          placeholder={t("postDraftPlaceholder")}
          maxLength={5000}
          aria-label={t("newPostContent")}
          className="min-h-[120px] w-full resize-none rounded-lg border border-gray-200 bg-white p-3 pb-14 text-[14px] text-gray-900 placeholder-gray-500 shadow-sm transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/50 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
          rows={4}
        />

        {/* Mentions Dropdown Suggestions */}
        {showMentionsDropdown && userList.length > 0 && (
          <div className="dark:border-gray-750 absolute bottom-14 left-2 z-20 max-h-48 w-72 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-xl ring-1 ring-black/5 dark:bg-gray-900">
            {userList.map((user, idx) => {
              const fullName =
                [user.lastName, user.firstName].filter(Boolean).join(" ") ||
                user.username;
              const isActive = idx === activeUserIndex;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => selectMention(user.username)}
                  onMouseEnter={() => setActiveUserIndex(idx)}
                  className={`flex w-full cursor-pointer flex-col px-4 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "dark:hover:bg-gray-850 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {fullName}
                  </span>
                  <span className="text-gray-550 text-xs">
                    @{user.username} • {user.email}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="absolute right-2 bottom-2 z-10 flex items-center gap-2.5">
          <span className="dark:text-gray-505 mr-1 text-[11px] font-medium text-[#9E9E9E]">
            {content.length}/5000
          </span>
          <button
            type="button"
            onClick={handleAiEnhance}
            disabled={isEnhancing || !content.trim()}
            className="flex transform cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-50/50 px-3 py-1.5 text-[12px] font-semibold text-[#2F9E44] transition-all hover:scale-[1.02] hover:bg-emerald-100/60 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
          >
            {isEnhancing ? (
              <Loader2
                className="h-3.5 w-3.5 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Sparkles
                className="h-3.5 w-3.5 animate-pulse text-[#2F9E44] dark:text-emerald-400"
                aria-hidden="true"
              />
            )}
            <span>{t("aiEnhance")}</span>
          </button>
        </div>
      </div>

      {/* Embedded Event Mini Card Preview */}
      {attachedEvent && (
        <MiniEventCard
          event={attachedEvent}
          onRemove={() => setAttachedEvent(null)}
        />
      )}

      {/* Image Preview Grid */}
      {previewUrls.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {previewUrls.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-square overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800"
            >
              <img
                src={url}
                alt={`preview-${idx}`}
                className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-95"
                onClick={() => window.open(url, "_blank")}
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-rose-600 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                aria-label="Xóa ảnh này"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. Suggested chips area using natural language tags */}
      <div className="border-gray-105 mt-4 space-y-2.5 border-t border-dashed pt-3 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <Tag className="h-4 w-4 text-[#2F9E44]" aria-hidden="true" />
          <span className="text-[13px] font-semibold text-[#5C5C5C] dark:text-gray-400">
            {t("tagTitle")}
          </span>
        </div>

        {/* Selected chips collection (natural format, no '#') */}
        <div className="flex min-h-[32px] flex-wrap gap-2 rounded-lg border border-emerald-500/5 bg-emerald-50/10 p-2 dark:bg-emerald-950/5">
          {tags.length === 0 ? (
            <span className="text-[12px] text-gray-400 italic">
              {t("noTags")}
            </span>
          ) : (
            tags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed="true"
                className="hover:text-rose-650 inline-flex cursor-pointer items-center gap-1 rounded-md border border-emerald-500/10 bg-[#E6F4EA] px-3 py-1.5 text-[13px] font-bold text-[#2F9E44] shadow-xs transition-colors hover:border-rose-200 hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:bg-emerald-950/40 dark:text-emerald-400"
                title="Bấm để xóa thẻ này"
              >
                {tag}
                <span
                  className="ml-1 text-[11px] font-extrabold opacity-75"
                  aria-hidden="true"
                >
                  ✕
                </span>
              </button>
            ))
          )}
        </div>

        {/* Suggested unselected tags collection */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
            {t("suggestedQuick")}
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedTags
              .filter((tag) => !isTagExists(tag))
              .map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={isTagExists(tag)}
                  className="dark:border-gray-850 inline-block cursor-pointer rounded-md border border-gray-100 bg-[#F7F7F7] px-3 py-1.5 text-[13px] font-semibold text-[#5C5C5C] transition-all hover:bg-[#E6F4EA] hover:text-[#2F9E44] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-[#2F9E44]/25"
                >
                  + {tag}
                </button>
              ))}
          </div>
        </div>

        {/* Ô nhập thẻ TÙY CHỈNH */}
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCustomTag(e)}
            placeholder={t("customTagPlaceholder")}
            aria-label={t("customTagAria")}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-gray-900 placeholder-gray-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          <button
            type="button"
            onClick={handleAddCustomTag}
            className="dark:text-emerald-450 cursor-pointer rounded-lg bg-[#2F9E44]/10 px-4 py-1.5 text-[13px] font-semibold text-[#2F9E44] transition hover:bg-[#2F9E44]/20 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30"
          >
            {t("add")}
          </button>
        </div>
      </div>

      {/* 4. Action Buttons (Submit & Media upload) */}
      <div className="mt-4 flex items-center justify-between border-t border-[#E0E0E0] pt-3 dark:border-gray-800">
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageSelect}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-[600] text-[#5C5C5C] transition-colors hover:bg-[#F0F2F5] hover:text-[#2F9E44] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ImageIcon className="h-4 w-5" aria-hidden="true" />
            <span>
              {t("addImage")} {images.length > 0 && `(${images.length}/4)`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowEventModal(true)}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-[600] text-[#5C5C5C] transition-colors hover:bg-[#F0F2F5] hover:text-[#2F9E44] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Paperclip
              className="h-4 w-5 animate-pulse text-emerald-600"
              aria-hidden="true"
            />
            <span>{attachedEvent ? t("changeEvent") : t("attachEvent")}</span>
          </button>
        </div>

        <div className="flex gap-2">
          {/* Button 1: Save Draft */}
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={
              content.trim().length < 10 ||
              content.trim().length > 5000 ||
              createPostMutation.isPending ||
              isEnhancing
            }
            className="dark:text-gray-250 cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-[14px] font-semibold text-gray-700 transition hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            {t("saveDraft")}
          </button>

          {/* Button 2: Publish */}
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={
              content.trim().length < 10 ||
              content.trim().length > 5000 ||
              createPostMutation.isPending ||
              isEnhancing
            }
            className="flex transform cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-5 py-2 text-[14px] font-bold text-white shadow-xs transition hover:bg-[#1F6F2E] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createPostMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{t("publish")}</span>
          </button>
        </div>
      </div>

      {/* Event Selection Modal */}
      <EventSelectionModal
        open={showEventModal}
        onCancel={() => setShowEventModal(false)}
        onSelectEvent={(evt) => setAttachedEvent(evt)}
      />
    </div>
  );
}
