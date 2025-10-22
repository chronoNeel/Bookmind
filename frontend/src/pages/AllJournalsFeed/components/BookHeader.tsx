import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface BookHeaderProps {
  bookKey: string;
}

const BookHeader: React.FC<BookHeaderProps> = ({ bookKey }) => {
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [author, setAuthor] = useState<string>("Unknown Author");

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/book/${encodeURIComponent(bookKey)}`);
  };

  useEffect(() => {
    const getBookDetails = async () => {
      if (!bookKey) return;
      try {
        const bookResponse = await axios.get(
          `https://openlibrary.org${bookKey}.json`
        );
        const bookData = bookResponse.data;
        setBook(bookData);

        if (bookData.authors?.length) {
          const authorKey = bookData.authors[0].author.key;
          try {
            const authorResponse = await axios.get(
              `https://openlibrary.org${authorKey}.json`
            );
            setAuthor(authorResponse.data.name || "Unknown Author");
          } catch {
            setAuthor("Unknown Author");
          }
        } else {
          setAuthor("Unknown Author");
        }
      } catch {
        setBook(null);
        setAuthor("Unknown Author");
      }
    };

    getBookDetails();
  }, [bookKey]);

  if (!book) {
    return (
      <div
        className="d-flex align-items-start gap-3 p-3 rounded-top"
        style={{ backgroundColor: "#4F200D", color: "#FFFAEA" }}
      >
        <p className="mb-0">Loading book details...</p>
      </div>
    );
  }

  return (
    <div
      className="d-flex align-items-start gap-3 p-3 rounded-top"
      style={{ backgroundColor: "#4F200D", color: "#FFFAEA" }}
    >
      {book.covers && book.covers.length > 0 && (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`}
          alt={book.title}
          className="rounded shadow border border-light cursor-pointer"
          style={{ width: "60px", height: "85px", objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          onClick={handleNavigate}
        />
      )}

      <div className="flex-grow-1 text-truncate">
        <h5
          className="fw-bold mb-1 text-truncate cursor-pointer"
          onClick={handleNavigate}
          style={{ fontSize: "0.95rem" }}
        >
          {book.title || "Untitled"}
        </h5>

        <p
          className="mb-0 text-light opacity-75 text-truncate"
          style={{ fontSize: "0.8rem" }}
        >
          {author}
        </p>

        <p
          className="mb-0 mt-1 fst-italic text-light opacity-75"
          style={{ fontSize: "0.75rem" }}
        >
          Journal by <span className="fw-semibold text-warning">User</span>
        </p>
      </div>
    </div>
  );
};

export default BookHeader;
