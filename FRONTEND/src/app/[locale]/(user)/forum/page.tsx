"use client";

import {
  Clock,
  Filter,
  Flame,
  Globe,
  History,
  Loader2,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

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

  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-6 pb-20">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-[26px] font-[800] tracking-tight text-[#1B1B1B] transition-all duration-300 dark:text-gray-100">
            {t("title")}
          </h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[#5C5C5C] dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        {/* Search Bar */}
        <div className="group relative w-full shrink-0 md:w-[300px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#9E9E9E] transition-colors duration-200 group-focus-within:text-[#2F9E44]">
            <Search className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchAriaLabel")}
            className="w-full rounded-full border border-[#E0E0E0] bg-white py-2.5 pr-4 pl-11 text-[14px] text-[#1B1B1B] placeholder-[#9E9E9E] shadow-xs transition-all duration-300 hover:border-[#CCCCCC] hover:shadow-sm focus:border-[#2F9E44] focus:shadow-md focus:ring-2 focus:ring-[#2F9E44]/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:hover:border-gray-600 dark:focus:border-[#2F9E44] dark:focus:ring-[#2F9E44]/30"
          />
        </div>
      </div>

      {/* Segmented Control Navigation */}
      <div className="flex rounded-xl border border-transparent bg-gray-100 p-1 shadow-xs dark:border-gray-700/50 dark:bg-gray-800">
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

      {/* Create Post Area */}
      <CreatePostWidget />

      {/* Sort & Filter */}
      <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto border-b border-[#E0E0E0] pb-3.5 dark:border-gray-800">
        <button
          onClick={() => {
            setSort("hot");
            setSelectedTag(undefined);
          }}
          className={`flex shrink-0 transform cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[14px] font-[600] transition-all duration-250 active:scale-95 ${
            sort === "hot" && !selectedTag
              ? "bg-[#E6F4EA] text-[#2F9E44] shadow-xs dark:bg-green-950/40 dark:text-green-400"
              : "border border-[#E0E0E0] bg-white text-[#5C5C5C] hover:bg-[#F0F2F5] hover:text-[#1B1B1B] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
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
              : "border border-[#E0E0E0] bg-white text-[#5C5C5C] hover:bg-[#F0F2F5] hover:text-[#1B1B1B] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
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
              : "border border-[#E0E0E0] bg-white text-[#5C5C5C] hover:bg-[#F0F2F5] hover:text-[#1B1B1B] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
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
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E0E0E0] bg-white px-6 py-14 text-center shadow-xs dark:border-gray-800 dark:bg-gray-900">
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
                className="dark:hover:bg-gray-850 mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E0E0E0] bg-white py-3.5 text-[14px] font-[600] text-[#2F9E44] shadow-xs transition-all hover:bg-gray-50/80 active:scale-[0.99] disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-green-400"
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
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E0E0E0] bg-white px-6 py-16 text-center shadow-xs dark:border-gray-800 dark:bg-gray-900">
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
