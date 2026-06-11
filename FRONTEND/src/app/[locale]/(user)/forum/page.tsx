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
import { useCurrentUserQuery } from "@/src/queries/user/useUserQueries";
import { ForumPost } from "@/src/types/forum/forum.type";

import CreatePostWidget from "./components/CreatePostWidget";
import ForumHeader from "./components/ForumHeader";
import PostCard from "./components/PostCard";

export default function ForumPage() {
  const t = useTranslations("forum");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"hot" | "new">("hot");
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  // Fetch current user query to display coins
  const { data: userInfo, isLoading: isUserLoading } = useCurrentUserQuery();

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
    <div className="mx-auto flex max-w-[800px] flex-col gap-6 pb-20">
      <ForumHeader userCoins={userInfo?.coins || 0} loading={isUserLoading} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Segmented Control Navigation */}
        <div className="flex flex-1 rounded-xl border border-transparent bg-gray-100 p-1 shadow-xs dark:border-emerald-500/15 dark:bg-gray-800">
          <Link
            href="/forum"
            className="dark:bg-gray-750 flex flex-1 transform items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-center font-bold text-[#2F9E44] shadow-sm transition-all duration-200 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:text-green-400"
          >
            <Globe className="animate-spin-slow h-4 w-4" aria-hidden="true" />
            <span>{t("generalForum")}</span>
          </Link>
          <Link
            href="/forum/my-posts"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-center font-semibold text-gray-600 transition hover:bg-gray-50/50 hover:text-[#2F9E44] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:text-gray-400 dark:hover:bg-gray-800/30 dark:hover:text-green-400"
          >
            <History className="h-4 w-4" aria-hidden="true" />
            <span>{t("myPosts")}</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="group relative w-full shrink-0 sm:w-[260px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#9E9E9E] transition-colors duration-200 group-focus-within:text-[#2F9E44]">
            <Search className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchAriaLabel")}
            className="w-full rounded-full border border-emerald-250/70 bg-white py-2.5 pr-4 pl-11 text-[14px] text-[#1B1B1B] placeholder-[#9E9E9E] shadow-xs transition-all duration-300 hover:border-emerald-400 hover:shadow-sm focus:border-emerald-600 focus:shadow-md focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-emerald-500/15 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:hover:border-emerald-500/25 dark:focus:border-[#2F9E44] dark:focus:ring-[#2F9E44]/30"
          />
        </div>
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

      {/* Sort & Filter */}
      <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto border-b border-emerald-100 pb-3.5 dark:border-emerald-500/15">
        <button
          onClick={() => {
            setSort("hot");
            setSelectedTag(undefined);
          }}
          className={`flex shrink-0 transform cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[14px] font-[600] transition-all duration-250 active:scale-95 ${
            sort === "hot" && !selectedTag
              ? "bg-[#E6F4EA] text-[#2F9E44] shadow-xs dark:bg-green-950/40 dark:text-green-400"
              : "border border-emerald-250/50 bg-white text-[#5C5C5C] hover:bg-emerald-50/20 hover:text-emerald-800 dark:border-emerald-500/15 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/60 dark:hover:text-white"
          }`}
        >
          <Flame className="h-4 w-4" aria-hidden="true" />
          <span>{t("hot")}</span>
        </button>

        <button
          onClick={() => {
            setSort("new");
            setSelectedTag(undefined);
          }}
          className={`flex shrink-0 transform cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[14px] font-[600] transition-all duration-250 active:scale-95 ${
            sort === "new" && !selectedTag
              ? "bg-[#E6F4EA] text-[#2F9E44] shadow-xs dark:bg-green-950/40 dark:text-green-400"
              : "border border-emerald-250/50 bg-white text-[#5C5C5C] hover:bg-emerald-50/20 hover:text-emerald-800 dark:border-emerald-500/15 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/60 dark:hover:text-white"
          }`}
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>{t("new")}</span>
        </button>

        <button
          onClick={() => {
            setSelectedTag(selectedTag === "Tái chế" ? undefined : "Tái chế");
          }}
          className={`flex shrink-0 transform cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[14px] font-[600] transition-all duration-250 active:scale-95 ${
            selectedTag === "Tái chế"
              ? "bg-[#E6F4EA] text-[#2F9E44] shadow-xs dark:bg-green-950/40 dark:text-green-400"
              : "border border-emerald-250/50 bg-white text-[#5C5C5C] hover:bg-emerald-50/20 hover:text-emerald-800 dark:border-emerald-500/15 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/60 dark:hover:text-white"
          }`}
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          <span>{t("recycle")}</span>
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
          <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-white px-6 py-14 text-center shadow-xs dark:border-emerald-500/15 dark:bg-gray-900">
            <p className="text-red-650 text-[17px] font-[600] dark:text-red-400">
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
                className="dark:hover:bg-gray-850 mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white py-3.5 text-[14px] font-[600] text-[#2F9E44] shadow-xs transition-all hover:bg-gray-50/80 active:scale-[0.99] disabled:opacity-50 dark:border-emerald-500/15 dark:bg-gray-900 dark:text-green-400"
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
          <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-white px-6 py-16 text-center shadow-xs dark:border-emerald-500/15 dark:bg-gray-900">
            <Search
              className="mb-4 h-12 w-12 text-[#9E9E9E] opacity-75"
              aria-hidden="true"
            />
            <p className="text-[17px] font-[600] text-[#1B1B1B] dark:text-gray-100">
              {t("noPostsTitle")}
            </p>
            <p className="mt-1.5 max-w-md text-[14px] text-[#5C5C5C] dark:text-gray-400">
              {t("noPostsSubtitle")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
