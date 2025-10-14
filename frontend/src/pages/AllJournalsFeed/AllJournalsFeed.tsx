import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SortControls from "./components/SortControls";
import JournalCard from "./components/JournalCard";
import { entriesByBook } from "../../assets/journaldata";
import { useAppSelector } from "../../hooks/redux";
import { selectPublicJournals } from "../../store/slices/journalSlice";

const ITEMS_PER_PAGE = 9;

const AllJournalsFeed = () => {
  const navigate = useNavigate();
  // const publicJournals = Object.values(entriesByBook).flat();
  const publicJournals = useAppSelector(selectPublicJournals);
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "votes">("recent");
  const [currentPage, setCurrentPage] = useState(1);

  const sortedJournals = [...publicJournals].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "votes":
        const aVotes =
          ("upvotes" in a ? a.upvotes : 0) -
          ("downvotes" in a ? a.downvotes : 0);
        const bVotes =
          ("upvotes" in b ? b.upvotes : 0) -
          ("downvotes" in b ? b.downvotes : 0);
        return bVotes - aVotes;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedJournals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentJournals = sortedJournals.slice(startIndex, endIndex);

  // Reset to page 1 when sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis for larger totals
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // In the middle
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8">
      {/* Paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <SortControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalEntries={sortedJournals.length}
        />

        {sortedJournals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-amber-200">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              No Public Journals Yet
            </h3>
            <p className="text-amber-700">
              Be the first to share your reading journey with the community!
            </p>
          </div>
        ) : (
          <>
            {/* Journal Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentJournals.map((entry) => (
                <JournalCard key={entry.id} entry={entry} navigate={navigate} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-white border-2 border-amber-300 text-amber-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50 transition-colors flex items-center gap-1"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={20} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof page === "number" && handlePageChange(page)
                      }
                      disabled={page === "..."}
                      className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors ${
                        page === currentPage
                          ? "bg-amber-500 text-white border-2 border-amber-600"
                          : page === "..."
                          ? "bg-transparent text-amber-900 cursor-default"
                          : "bg-white border-2 border-amber-300 text-amber-900 hover:bg-amber-50"
                      }`}
                      aria-label={
                        typeof page === "number"
                          ? `Go to page ${page}`
                          : undefined
                      }
                      aria-current={page === currentPage ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-white border-2 border-amber-300 text-amber-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50 transition-colors flex items-center gap-1"
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Page Info */}
            <div className="mt-4 text-center text-sm text-amber-700">
              Showing {startIndex + 1}-
              {Math.min(endIndex, sortedJournals.length)} of{" "}
              {sortedJournals.length} entries
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllJournalsFeed;
