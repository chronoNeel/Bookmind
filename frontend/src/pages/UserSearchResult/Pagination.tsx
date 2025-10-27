import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => (
  <div className="flex justify-center items-center gap-2">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`p-2 rounded-md ${
        currentPage === 1
          ? "text-gray-300 cursor-not-allowed"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <ChevronLeft className="w-5 h-5" />
    </button>

    <div className="flex gap-1">
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-md text-sm font-medium ${
              currentPage === page
                ? "text-white bg-amber-500"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>

    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`p-2 rounded-md ${
        currentPage === totalPages
          ? "text-gray-300 cursor-not-allowed"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>
);

export default Pagination;
