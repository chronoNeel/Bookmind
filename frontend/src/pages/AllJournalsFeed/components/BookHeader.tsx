import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface BookHeaderProps {
  bookKey: string;
}

const BookHeader: React.FC<BookHeaderProps> = ({ bookKey }) => {
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [author, setAuthor] = useState("Unknown Author");

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/book/${encodeURIComponent(bookKey)}`);
  };

  useEffect(() => {
    const getBookDetails = async () => {
      if (!bookKey) return;
      try {
        const { data: bookData } = await axios.get(
          `https://openlibrary.org${bookKey}.json`
        );
        setBook(bookData);
        if (bookData.authors?.length) {
          const { data: authorData } = await axios.get(
            `https://openlibrary.org${bookData.authors[0].author.key}.json`
          );
          setAuthor(authorData.name || "Unknown Author");
        }
      } catch {
        setBook(null);
        setAuthor("Unknown Author");
      }
    };
    getBookDetails();
  }, [bookKey]);

  if (!book)
    return (
      <div className="flex items-start gap-3 p-3 rounded-t-lg bg-[#4F200D] text-[#FFFAEA]">
        <p className="mb-0 text-sm">Loading book details...</p>
      </div>
    );

  return (
    <div className="flex items-start gap-3 p-3 rounded-t-lg bg-[#4F200D] text-[#FFFAEA]">
      {book.covers?.length > 0 && (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`}
          alt={book.title}
          className="rounded shadow border border-light cursor-pointer"
          style={{ width: 60, height: 85, objectFit: "cover" }}
          onError={(e) => (e.currentTarget.style.display = "none")}
          onClick={handleNavigate}
        />
      )}
      <div className="flex-grow text-truncate">
        <h5
          className="font-semibold mb-1 text-truncate cursor-pointer"
          style={{ fontSize: "0.95rem" }}
          onClick={handleNavigate}
        >
          {book.title || "Untitled"}
        </h5>
        <p className="mb-0 text-light opacity-75 text-truncate text-sm">
          {author}
        </p>
        <p className="mb-0 mt-1 italic text-light opacity-75 text-xs">
          Journal by <span className="font-semibold text-amber-300">User</span>
        </p>
      </div>
    </div>
  );
};

export default BookHeader;
