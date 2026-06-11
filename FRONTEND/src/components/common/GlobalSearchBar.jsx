import React from "react";
import { Search, X } from "lucide-react";

/**
 * GlobalSearchBar component
 * Shared search bar across the application with standard dark mode styles and input behaviors.
 * 
 * @param {object} props
 * @param {string} [props.placeholder]
 * @param {string} [props.value]
 * @param {(val: string) => void} [props.onChange]
 * @param {(val: string) => void} [props.onSubmit]
 * @param {string} [props.className]
 */
export default function GlobalSearchBar({
  placeholder = "Tìm kiếm...",
  value = "",
  onChange = undefined,
  onSubmit = undefined,
  className = "",
  ...props
}) {
  const handleFormSubmit = (e) => {
    if (onSubmit) {
      e.preventDefault();
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className={`relative w-full ${className}`}>
      {/* Search icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors duration-200">
        <Search className="h-4.5 w-4.5" />
      </div>

      {/* Input element */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100 rounded-full pl-10 pr-9 py-2 text-sm focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 focus:shadow-md focus:outline-none transition-all duration-300 placeholder-gray-500 dark:placeholder-zinc-500"
        {...props}
      />

      {/* Clear search button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange && onChange("")}
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors duration-200"
          aria-label="Xóa nội dung tìm kiếm"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
