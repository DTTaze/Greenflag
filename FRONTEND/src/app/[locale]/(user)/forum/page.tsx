"use client";

import {
  Clock,
  Flame,
  Globe,
  History,
  Loader2,
  MessageSquare,
  Search,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import GlobalSearchBar from "@/src/components/common/GlobalSearchBar";
import PageHeader from "@/src/components/common/PageHeader";
import { useForumPosts } from "@/src/hooks/useForum";
import { ForumPost } from "@/src/types/forum/forum.type";

import CreatePostWidget from "./components/CreatePostWidget";
import PostCard from "./components/PostCard";

export default function ForumPage() {
  const t = useTranslations("forum");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"hot" | "new">("hot");
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  // Fetch infinite posts from server via React Query hook
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useForumPosts({
    sort,
    tag: selectedTag,
    limit: 10,
  });

  // Flatten the loaded pages into a single flat array
  const posts = useMemo(() => {
    return (
      data?.pages.flatMap(
        (page) => (page.success ? page.data?.items : null) || [],
      ) || []
    );
  }, [data]);

  // Client-side search filtering over retrieved items
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;

    const query = searchQuery.toLowerCase();
    return posts.filter((post: ForumPost) => {
      const matchContent = post.content.toLowerCase().includes(query);
      const matchAuthor = post.author.name.toLowerCase().includes(query);
      const matchTags = post.tags?.some((tag: string) =>
        tag.toLowerCase().includes(query),
      );

      return matchContent || matchAuthor || matchTags;
    });
  }, [posts, searchQuery]);

  const tagsList = ["Sống xanh", "Tái chế", "Trồng cây", "Chia sẻ", "Hỏi đáp"];

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-10 transition-colors duration-300 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 1. Page Header chuẩn (Tái sử dụng PageHeader) */}
        <PageHeader
          title={t("title")}
          subtitle={t("subtitle")}
          theme="blue"
          icon={MessageSquare}
          rightContent={
            <GlobalSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchAriaLabel")}
            />
          }
        />

        {/* 2. Main Layout Area (Sidebar on left, feed on right) */}
        <div className="flex flex-col items-start gap-6 md:flex-row">
          {/* Desktop Categories Sidebar */}
          <div className="hidden w-64 shrink-0 flex-col gap-4 md:flex">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-3 text-xs font-extrabold tracking-wider text-emerald-900 uppercase dark:text-slate-100">
                Chủ đề nổi bật
              </h2>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setSelectedTag(undefined)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors duration-200 ${
                    selectedTag === undefined
                      ? "bg-emerald-50 text-[#0B6E4F] dark:bg-emerald-950/30 dark:text-emerald-400"
                      : "text-slate-600 hover:bg-gray-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
                  }`}
                >
                  <Globe className="h-4.5 w-4.5" />
                  <span>Tất cả</span>
                </button>
                {tagsList.map((tag) => {
                  const isActive = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors duration-200 ${
                        isActive
                          ? "bg-emerald-50 text-[#0B6E4F] dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "text-slate-600 hover:bg-gray-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
                      }`}
                    >
                      <Tag className="h-4 w-4" />
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Area - Post Feed */}
          <div className="flex w-full flex-grow flex-col gap-5">
            {/* Segmented Control Navigation */}
            <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <Link
                href="/forum"
                className="flex flex-1 transform items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2.5 text-center font-bold text-[#0B6E4F] shadow-sm transition-all duration-200 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:bg-emerald-950/30 dark:text-emerald-400"
              >
                <Globe
                  className="animate-spin-slow h-4 w-4"
                  aria-hidden="true"
                />
                <span>{t("generalForum")}</span>
              </Link>
              <Link
                href="/forum/my-posts"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-center font-semibold text-gray-600 transition hover:bg-gray-50/50 hover:text-[#0B6E4F] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:text-gray-400 dark:hover:bg-zinc-800/50 dark:hover:text-emerald-400"
              >
                <History className="h-4 w-4" aria-hidden="true" />
                <span>{t("myPosts")}</span>
              </Link>
            </div>

            {/* Mobile Category scrollable chips */}
            <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-1 md:hidden">
              <button
                onClick={() => setSelectedTag(undefined)}
                className={`flex shrink-0 transform cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
                  selectedTag === undefined
                    ? "bg-emerald-50 text-[#0B6E4F] dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "text-slate-650 border border-gray-200 bg-white hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <span>Tất cả</span>
              </button>
              {tagsList.map((tag) => {
                const isActive = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`flex shrink-0 transform cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
                      isActive
                        ? "bg-emerald-50 text-[#0B6E4F] dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "text-slate-650 border border-gray-200 bg-white hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Create Post Widget */}
            <CreatePostWidget />

            {/* Sort Controls */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3.5 dark:border-zinc-800/80">
              <button
                onClick={() => setSort("hot")}
                className={`flex shrink-0 transform cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[14px] font-[600] transition-all duration-250 active:scale-95 ${
                  sort === "hot"
                    ? "bg-[#E6F4EA] text-[#2F9E44] shadow-xs dark:bg-green-950/40 dark:text-green-400"
                    : "border border-gray-200 bg-white text-slate-600 hover:bg-gray-50 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
                }`}
              >
                <Flame className="h-4 w-4" aria-hidden="true" />
                <span>{t("hot")}</span>
              </button>

              <button
                onClick={() => setSort("new")}
                className={`flex shrink-0 transform cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[14px] font-[600] transition-all duration-250 active:scale-95 ${
                  sort === "new"
                    ? "bg-[#E6F4EA] text-[#2F9E44] shadow-xs dark:bg-green-950/40 dark:text-green-400"
                    : "border border-gray-200 bg-white text-slate-600 hover:bg-gray-50 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
                }`}
              >
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>{t("new")}</span>
              </button>
            </div>

            {/* Feed List */}
            <div className="flex flex-col gap-5">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Loader2
                    className="h-10 w-10 animate-spin text-[#2F9E44]"
                    aria-hidden="true"
                  />
                  <p className="mt-4 text-[14px] font-medium text-[#5C5C5C] dark:text-gray-400">
                    {t("loading")}
                  </p>
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-[17px] font-[600] text-red-600 dark:text-red-400">
                    {t("errorTitle")}
                  </p>
                  <p className="mt-1.5 text-[14px] text-[#5C5C5C] dark:text-gray-400">
                    {t("errorSubtitle")}
                  </p>
                </div>
              ) : filteredPosts.length > 0 ? (
                <>
                  {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}

                  {/* Load More Trigger */}
                  {hasNextPage && (
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3.5 text-[14px] font-[600] text-[#2F9E44] shadow-xs transition-all hover:bg-gray-50/80 active:scale-[0.99] disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-green-400 dark:hover:bg-zinc-800/50"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Loader2
                            className="h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                          <span>{t("loadingMore")}</span>
                        </>
                      ) : (
                        <span>{t("loadMore")}</span>
                      )}
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                  <Search
                    className="mb-4 h-12 w-12 text-gray-400 opacity-75"
                    aria-hidden="true"
                  />
                  <p className="text-[17px] font-[600] text-gray-950 dark:text-gray-100">
                    {t("noPostsTitle")}
                  </p>
                  <p className="mt-1.5 max-w-md text-[14px] text-gray-500 dark:text-gray-400">
                    {t("noPostsSubtitle")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
