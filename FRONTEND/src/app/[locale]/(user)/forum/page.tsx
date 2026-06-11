"use client";

import CreatePostWidget from "./components/CreatePostWidget";
import PostCard from "./components/PostCard";
import { useForumPosts } from "@/src/hooks/useForum";
import { ForumPost } from "@/src/types/forum/forum.type";
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
import { useMemo, useState } from "react";

export default function ForumPage() {
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
          <h1 className="text-[24px] font-[700] text-[#1B1B1B] dark:text-gray-100">
            Diễn đàn GreenFlag
          </h1>
          <p className="mt-1 text-[14px] text-[#5C5C5C] dark:text-gray-400">
            Nơi giao lưu, hỏi đáp và chia sẻ kinh nghiệm sống xanh
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full shrink-0 md:w-[300px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9E9E9E] dark:text-gray-500">
            <Search className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài viết, kỹ thuật…"
            aria-label="Tìm kiếm bài viết trên diễn đàn"
            className="w-full rounded-full border border-[#E0E0E0] bg-white py-2.5 pr-4 pl-10 text-[14px] text-[#1B1B1B] placeholder-[#9E9E9E] focus:border-[#2F9E44] focus:ring-1 focus:ring-[#2F9E44] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-[#2F9E44] dark:focus:ring-[#2F9E44]"
          />
        </div>
      </div>

      {/* Segmented Control Navigation */}
      <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        <Link
          href="/forum"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-center font-bold text-[#2F9E44] shadow-xs focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:bg-gray-700 dark:text-green-400"
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span>Diễn đàn chung</span>
        </Link>
        <Link
          href="/forum/my-posts"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-center font-medium text-gray-600 transition hover:text-[#2F9E44] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:text-gray-400 dark:hover:text-green-400"
        >
          <History className="h-4 w-4" aria-hidden="true" />
          <span>Bài viết của tôi</span>
        </Link>
      </div>

      {/* Create Post Area */}
      <CreatePostWidget />

      {/* Sort & Filter */}
      <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto border-b border-[#E0E0E0] pb-3 dark:border-gray-800">
        <button
          onClick={() => {
            setSort("hot");
            setSelectedTag(undefined);
          }}
          className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[14px] font-[600] transition-colors ${
            sort === "hot" && !selectedTag
              ? "bg-[#E6F4EA] text-[#2F9E44] dark:bg-green-950/40 dark:text-green-400"
              : "border border-[#E0E0E0] bg-white text-[#5C5C5C] hover:bg-[#F0F2F5] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <Flame className="h-4 w-4" aria-hidden="true" />
          <span>Hot nhất</span>
        </button>

        <button
          onClick={() => {
            setSort("new");
            setSelectedTag(undefined);
          }}
          className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[14px] font-[600] transition-colors ${
            sort === "new" && !selectedTag
              ? "bg-[#E6F4EA] text-[#2F9E44] dark:bg-green-950/40 dark:text-green-400"
              : "border border-[#E0E0E0] bg-white text-[#5C5C5C] hover:bg-[#F0F2F5] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>Mới nhất</span>
        </button>

        <button
          onClick={() => {
            setSelectedTag(selectedTag === "Tái chế" ? undefined : "Tái chế");
          }}
          className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[14px] font-[600] transition-colors ${
            selectedTag === "Tái chế"
              ? "bg-[#E6F4EA] text-[#2F9E44] dark:bg-green-950/40 dark:text-green-400"
              : "border border-[#E0E0E0] bg-white text-[#5C5C5C] hover:bg-[#F0F2F5] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          <span>Tái chế</span>
        </button>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2
              className="h-10 w-10 animate-spin text-[#2F9E44]"
              aria-hidden="true"
            />
            <p className="mt-3 text-[14px] text-[#5C5C5C] dark:text-gray-400">
              Đang tải danh sách bài viết…
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#E0E0E0] bg-white py-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-[16px] font-[500] text-red-600">
              Không thể tải dữ liệu diễn đàn
            </p>
            <p className="mt-1 text-[14px] text-[#5C5C5C] dark:text-gray-400">
              Vui lòng thử lại sau hoặc kiểm tra kết nối mạng.
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
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E0E0E0] bg-white py-3 text-[14px] font-[600] text-[#2F9E44] transition-all hover:bg-[#F7F7F7] disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-green-400 dark:hover:bg-gray-800"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Đang tải thêm…</span>
                  </>
                ) : (
                  <span>Xem thêm bài viết</span>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#E0E0E0] bg-white py-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <Search
              className="mb-3 h-10 w-10 text-[#9E9E9E]"
              aria-hidden="true"
            />
            <p className="text-[16px] font-[500] text-[#1B1B1B] dark:text-gray-100">
              Không tìm thấy bài viết nào
            </p>
            <p className="mt-1 text-[14px] text-[#5C5C5C] dark:text-gray-400">
              Thử sử dụng các từ khóa khác xem sao (ví dụ: tái chế, trồng cây…)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
