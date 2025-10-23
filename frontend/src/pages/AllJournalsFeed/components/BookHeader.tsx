import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// OpenLibrary API Types
interface AuthorReference {
  author: {
    key: string;
  };
}

interface BookData {
  title?: string;
  covers?: number[];
  authors?: AuthorReference[];
}

interface AuthorData {
  name?: string;
}

interface BookHeaderProps {
  bookKey: string;
}

const BookHeader: React.FC<BookHeaderProps> = ({ bookKey }) => {
  const navigate = useNavigate();
  const [book, setBook] = useState<BookData | null>(null);
  const [author, setAuthor] = useState<string>("Unknown Author");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const handleNavigate = (e: React.MouseEvent): void => {
    e.stopPropagation();
    navigate(`/book/${encodeURIComponent(bookKey)}`);
  };

  useEffect(() => {
    const getBookDetails = async (): Promise<void> => {
      if (!bookKey) return;
      try {
        setLoading(true);
        setError(false);
        const { data: bookData } = await axios.get<BookData>(
          `https://openlibrary.org${bookKey}.json`
        );
        setBook(bookData);

        if (bookData.authors?.length && bookData.authors[0]?.author?.key) {
          const { data: authorData } = await axios.get<AuthorData>(
            `https://openlibrary.org${bookData.authors[0].author.key}.json`
          );
          setAuthor(authorData.name || "Unknown Author");
        }
      } catch (err) {
        console.error("Error fetching book details:", err);
        setBook(null);
        setAuthor("Unknown Author");
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getBookDetails();
  }, [bookKey]);

  // Loading State
  if (loading) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-t-lg bg-[#4F200D] text-[#FFFAEA]">
        <div
          className="rounded shadow border border-amber-900/30 bg-gradient-to-br from-amber-900/20 to-amber-800/20 animate-pulse flex-shrink-0"
          style={{ width: 60, height: 85 }}
        />
        <div className="flex-grow space-y-2 min-w-0">
          <div className="h-5 bg-amber-900/30 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-amber-900/20 rounded animate-pulse w-1/2" />
          <div className="h-3 bg-amber-900/20 rounded animate-pulse w-2/3 mt-2" />
        </div>
      </div>
    );
  }

  // Error State
  if (error || !book) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-t-lg bg-[#4F200D] text-[#FFFAEA]">
        <div
          className="rounded shadow border border-red-900/30 bg-gradient-to-br from-red-900/20 to-red-800/20 flex items-center justify-center flex-shrink-0"
          style={{ width: 60, height: 85 }}
        >
          <svg
            className="w-6 h-6 text-red-300/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-grow min-w-0">
          <h5
            className="font-semibold mb-1 text-red-200"
            style={{ fontSize: "0.95rem" }}
          >
            Failed to load book details
          </h5>
          <p className="mb-0 text-red-300/75 text-sm">
            Unable to fetch information
          </p>
          <p className="mb-0 mt-1 italic text-red-300/60 text-xs">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  // Success State
  const bookTitle = book.title || "Untitled";
  const hasCover = book.covers && book.covers.length > 0;

  return (
    <div className="flex items-start gap-3 p-3 rounded-t-lg bg-[#4F200D] text-[#FFFAEA]">
      {hasCover && (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.covers![0]}-M.jpg`}
          alt={bookTitle}
          className="rounded shadow border border-amber-900/30 cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg flex-shrink-0"
          style={{ width: 60, height: 85, objectFit: "cover" }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>): void => {
            e.currentTarget.style.display = "none";
          }}
          onClick={handleNavigate}
        />
      )}
      <div className="flex-grow min-w-0">
        <h5
          className="font-semibold mb-1 cursor-pointer hover:text-amber-200 transition-colors duration-200 truncate"
          style={{ fontSize: "0.95rem" }}
          onClick={handleNavigate}
          title={bookTitle}
        >
          {bookTitle}
        </h5>
        <p className="mb-0 opacity-75 truncate text-sm" title={author}>
          {author}
        </p>
        <p className="mb-0 mt-1 italic opacity-75 text-xs">
          Journal by <span className="font-semibold text-amber-300">User</span>
        </p>
      </div>
    </div>
  );
};

export default BookHeader;
