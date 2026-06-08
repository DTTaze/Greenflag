import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  goToNextPage,
  goToPreviousPage,
  goToPage,
}) => {
  return (
    <div className="pagination mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => goToPreviousPage()}
        disabled={currentPage === 1}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400"
            : "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none"
        }`}
      >
        &lt;
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => goToPage(index + 1)}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all focus:ring-2 focus:ring-green-400 focus:outline-none ${
            currentPage === index + 1
              ? "bg-green-600 text-white shadow-md"
              : "text-gray-700 hover:bg-green-100"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => goToNextPage()}
        disabled={currentPage === totalPages}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400"
            : "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none"
        }`}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
