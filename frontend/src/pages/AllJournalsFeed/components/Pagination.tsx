import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handleChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible)
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push("...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...");
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
    return pages;
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => handleChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-white border-2 border-amber-300 text-amber-900 font-medium disabled:opacity-50 hover:bg-amber-50 transition-colors flex items-center gap-1"
      >
        <ChevronLeft size={20} />
        <span className="hidden sm:inline">Previous</span>
      </button>
      <div className="flex gap-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handleChange(page)}
            disabled={page === "..."}
            className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors ${
              page === currentPage
                ? "bg-amber-500 text-white border-2 border-amber-600"
                : page === "..."
                ? "bg-transparent text-amber-900 cursor-default"
                : "bg-white border-2 border-amber-300 text-amber-900 hover:bg-amber-50"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-white border-2 border-amber-300 text-amber-900 font-medium disabled:opacity-50 hover:bg-amber-50 transition-colors flex items-center gap-1"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
