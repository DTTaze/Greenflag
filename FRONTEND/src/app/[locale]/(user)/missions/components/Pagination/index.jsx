import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  goToNextPage,
  goToPreviousPage,
  goToPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination mt-8 flex items-center justify-center gap-1.5">
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 active:scale-95 ${
          currentPage === 1
            ? "cursor-not-allowed bg-gray-50 text-gray-300"
            : "cursor-pointer border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-emerald-500/20"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4.5 w-4.5" />
      </button>

      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        const isActive = currentPage === page;
        return (
          <button
            key={index}
            onClick={() => goToPage(page)}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-emerald-500/20 ${
              isActive
                ? "bg-[#0B6E4F] text-white shadow-sm shadow-[#0B6E4F]/20"
                : "border border-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 active:scale-95 ${
          currentPage === totalPages
            ? "cursor-not-allowed bg-gray-50 text-gray-300"
            : "cursor-pointer border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-emerald-500/20"
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="h-4.5 w-4.5" />
      </button>
    </div>
  );
};

export default Pagination;
