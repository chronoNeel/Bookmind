import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../../components/SearchBar";
import BookList from "./components/BookList";
import Pagination from "./components/Pagination";
import { useAppSelector } from "../../hooks/redux";

const ITEMS_PER_PAGE = 10;

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
        >
          <div className="flex gap-6">
            {/* Book Cover Skeleton */}
            <div className="flex-shrink-0 w-24 h-36 bg-gray-200 rounded" />

            {/* Content Skeleton */}
            <div className="flex-1 space-y-3">
              {/* Title */}
              <div className="h-6 bg-gray-200 rounded w-3/4" />

              {/* Author */}
              <div className="h-4 bg-gray-200 rounded w-1/2" />

              {/* Description Lines */}
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-4/6" />
              </div>

              {/* Meta Info */}
              <div className="flex gap-4 pt-2">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SearchResults: React.FC = () => {
  const { searchResults, isLoading } = useAppSelector((state) => state.books);

  const [currentPage, setCurrentPage] = useState(1);
  const hasLoadedBooksRef = useRef(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchResults]);

  // Track if we've ever loaded books to prevent skeleton on navigation back
  useEffect(() => {
    if (searchResults.length > 0) {
      hasLoadedBooksRef.current = true;
    }
  }, [searchResults]);

  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBooks = searchResults.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Only show loading skeleton if we're loading AND we haven't loaded books before
  const shouldShowLoading = isLoading && !hasLoadedBooksRef.current;

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar />

      <div className="p-6 sm:p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          {shouldShowLoading ? (
            <LoadingSkeleton />
          ) : searchResults.length > 0 ? (
            <>
              <BookList books={currentBooks} />

              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No books found. Try searching for something!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
