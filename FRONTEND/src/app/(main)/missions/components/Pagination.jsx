import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  goToNextPage,
  goToPreviousPage,
  goToPage,
}) => {
  return (
    <div className="pagination flex justify-center items-center mt-8 gap-2">
      <button
        onClick={() => goToPreviousPage()}
        disabled={currentPage === 1}
        className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
          currentPage === 1
            ? "text-gray-400 bg-gray-100"
            : "text-green-700 bg-green-100 hover:bg-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none"
        }`}
      >
        &lt;
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => goToPage(index + 1)}
          className={`h-10 w-10 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-green-400 ${
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
        className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
          currentPage === totalPages
            ? "text-gray-400 bg-gray-100"
            : "text-green-700 bg-green-100 hover:bg-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none"
        }`}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
