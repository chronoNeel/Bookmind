import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, BookOpen, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { getGenreBooks } from "../../store/slices/genreBookSlice";

const GenreBooks: React.FC = () => {
  const { genreName } = useParams<{ genreName: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState<number>(1);

  // Get data from Redux store
  const { genres, isLoading, error } = useAppSelector(
    (state) => state.genreBooks
  );

  // Normalize genre name to lowercase for consistency
  const normalizedGenreName = genreName?.toLowerCase();
  const books = normalizedGenreName ? genres[normalizedGenreName] || [] : [];

  const booksPerPage = 32;

  useEffect(() => {
    if (!genreName) return;

    const normalized = genreName.toLowerCase();
    // Check if data doesn't exist or is empty
    if (!genres[normalized] || genres[normalized].length === 0) {
      dispatch(getGenreBooks(normalized));
    }
  }, [genreName, dispatch, genres]);

  useEffect(() => {
    setCurrentPage(1);
  }, [genreName]);

  const totalPages = Math.ceil(books.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = books.slice(startIndex, endIndex);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCoverUrl = (coverId?: number): string => {
    if (!coverId) return "";
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  const formatGenreName = (name: string): string => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="relative p-4 md:p-8">
        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {formatGenreName(genreName || "")} books
            </h1>
          </div>

          {/* Books Grid */}
          {currentBooks.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No books found
              </h3>
              <p className="text-gray-600">Try another genre</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4 mb-8">
                {currentBooks.map((book) => (
                  <div
                    key={book.key}
                    onClick={() =>
                      navigate(`/book/${encodeURIComponent(book.key)}`, {
                        state: { book },
                      })
                    }
                    className="group cursor-pointer"
                  >
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full">
                      {/* Book Cover */}
                      <div className="aspect-[2/3] bg-gray-100 relative overflow-hidden flex-shrink-0">
                        {book.cover_id ? (
                          <img
                            src={getCoverUrl(book.cover_id)}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Book Info */}
                      <div className="p-2 flex flex-col flex-grow">
                        <h6 className="font-medium text-[0.8rem] text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-3">
                          {book.title}
                        </h6>

                        <div className="flex flex-col justify-between flex-grow">
                          <p className="text-[0.7rem] text-gray-600 line-clamp-1 mb-1">
                            {book.authors?.[0]?.name || "Unknown Author"}
                          </p>

                          {book.first_publish_year && (
                            <p className="text-[0.65rem] text-gray-400">
                              {book.first_publish_year}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md transition-colors ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-white hover:shadow-sm"
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-1">
                    {[...Array(Math.min(totalPages, 7))].map((_, index) => {
                      let page: number;

                      if (totalPages <= 7) {
                        page = index + 1;
                      } else if (currentPage <= 4) {
                        page = index + 1;
                      } else if (currentPage >= totalPages - 3) {
                        page = totalPages - 6 + index;
                      } else {
                        page = currentPage - 3 + index;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-gray-700 hover:bg-white hover:shadow-sm"
                          }`}
                          aria-label={`Go to page ${page}`}
                          aria-current={
                            currentPage === page ? "page" : undefined
                          }
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md transition-colors ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-white hover:shadow-sm"
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenreBooks;
