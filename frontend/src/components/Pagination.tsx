import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      {/* Prev Button */}
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium border transition-all duration-200
          ${
            currentPage === 1
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-transparent text-white hover:opacity-90"
          }`}
        style={currentPage !== 1 ? { backgroundColor: "#9d816f" } : {}}
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${
                currentPage === page
                  ? "text-white shadow-md"
                  : "text-gray-700 border border-gray-300 bg-white hover:border-[#9d816f] hover:text-[#9d816f]"
              }`}
            style={currentPage === page ? { backgroundColor: "#9d816f" } : {}}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium border transition-all duration-200
          ${
            currentPage === totalPages
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-transparent text-white hover:opacity-90"
          }`}
        style={currentPage !== totalPages ? { backgroundColor: "#9d816f" } : {}}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
