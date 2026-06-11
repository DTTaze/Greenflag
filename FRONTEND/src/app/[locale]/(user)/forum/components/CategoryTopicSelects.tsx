"use client";

import React from "react";
import { FORUM_CATEGORIES } from "@/src/constants/forum.constants";

interface CategoryTopicSelectsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
}

export default function CategoryTopicSelects({
  selectedCategory,
  onCategoryChange,
  selectedTopic,
  onTopicChange,
}: CategoryTopicSelectsProps) {
  const categories = Object.keys(FORUM_CATEGORIES);
  const topics = FORUM_CATEGORIES[selectedCategory] || [];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value;
    onCategoryChange(newCat);
    // Reset topic to the first item in the new category
    const newTopics = FORUM_CATEGORIES[newCat] || [];
    if (newTopics.length > 0) {
      onTopicChange(newTopics[0]);
    } else {
      onTopicChange("");
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      {/* Category Select */}
      <div className="flex flex-1 flex-col gap-1.5">
        <label
          htmlFor="category-select"
          className="text-[12px] font-semibold text-[#5C5C5C] dark:text-gray-400"
        >
          Thể loại
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full rounded-lg border border-[#E0E0E0] bg-[#F7F7F7] px-3 py-1.5 text-[13px] font-bold text-[#2F9E44] focus:border-[#2F9E44] focus:ring-1 focus:ring-[#2F9E44] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-emerald-400"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Topic Select */}
      <div className="flex flex-1 flex-col gap-1.5">
        <label
          htmlFor="topic-select"
          className="text-[12px] font-semibold text-[#5C5C5C] dark:text-gray-400"
        >
          Chủ đề con
        </label>
        <select
          id="topic-select"
          value={selectedTopic}
          onChange={(e) => onTopicChange(e.target.value)}
          className="w-full rounded-lg border border-[#E0E0E0] bg-[#F7F7F7] px-3 py-1.5 text-[13px] font-semibold text-[#5C5C5C] focus:border-[#2F9E44] focus:ring-1 focus:ring-[#2F9E44] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          {topics.map((top) => (
            <option key={top} value={top}>
              {top}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
