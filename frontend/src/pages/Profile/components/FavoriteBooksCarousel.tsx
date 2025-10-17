// FavoriteBooksCarousel.tsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Book {
  title: string;
  author: string;
  bookKey: string;
  coverUrl: string;
  subject?: string;
}

interface FavoriteBooksCarouselProps {
  favoriteBookKeys: string[];
}

const FavoriteBooksCarousel: React.FC<FavoriteBooksCarouselProps> = ({
  favoriteBookKeys,
}) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const itemsPerPage = 5;
  const maxIndex = Math.max(0, books.length - itemsPerPage);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Fetch book details for each favorite
        const bookPromises = favoriteBookKeys
          .slice(0, 10)
          .map(async (bookKey) => {
            try {
              const response = await fetch(
                `https://openlibrary.org/works/${bookKey}.json`
              );
              const data = await response.json();

              // Get cover ID
              const coverId = data.covers?.[0];

              return {
                title: data.title || "Unknown Title",
                author: data.authors?.[0]?.author?.name || "Unknown Author",
                bookKey: bookKey,
                coverUrl: coverId
                  ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
                  : "https://via.placeholder.com/150x225?text=No+Cover",
                subject: data.subjects?.[0] || "General",
              };
            } catch (error) {
              console.error(`Failed to fetch book ${bookKey}:`, error);
              return {
                title: "Unknown Title",
                author: "Unknown Author",
                bookKey: bookKey,
                coverUrl: "https://via.placeholder.com/150x225?text=No+Cover",
                subject: "General",
              };
            }
          });

        const fetchedBooks = await Promise.all(bookPromises);
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Failed to fetch favorite books:", error);
      } finally {
        setLoading(false);
      }
    };

    if (favoriteBookKeys.length > 0) {
      fetchBooks();
    } else {
      setLoading(false);
    }
  }, [favoriteBookKeys]);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border p-6 sm:p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Favorite Books
        </h2>
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border p-6 sm:p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Favorite Books
        </h2>
        <div className="text-center py-12 text-gray-500">
          No favorite books yet. Start adding your favorites!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border p-6 sm:p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Favorite Books</h2>
        {books.length > itemsPerPage && (
          <div className="flex gap-2">
            <button
              onClick={() => setIndex(Math.max(index - 1, 0))}
              disabled={index === 0}
              className="w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setIndex(Math.min(index + 1, maxIndex))}
              disabled={index >= maxIndex}
              className="w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.slice(index, index + itemsPerPage).map((book) => (
          <button
            key={book.bookKey}
            onClick={() => navigate(`/book/${book.bookKey}`)}
            className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200/50 hover:shadow-lg transition-all group text-left"
          >
            <div className="relative overflow-hidden rounded-lg mb-3">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/150x225?text=No+Cover";
                }}
              />
            </div>
            <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-amber-600 transition-colors">
              {book.title}
            </h3>
            <p className="text-xs text-gray-600 mb-2 line-clamp-1">
              {book.author}
            </p>
            {book.subject && (
              <span className="inline-block bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                {book.subject}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FavoriteBooksCarousel;
