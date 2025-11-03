import React, { memo, useState } from "react";
import { Book } from "@models/Book";

interface BookCardProps {
  book: Book;
  isLoading?: boolean;
  onClick?: () => void;
}

const BookCard: React.FC<BookCardProps> = memo(
  ({ book, isLoading = false, onClick }) => {
    const [imgError, setImgError] = useState(false);

    if (isLoading) {
      return (
        <div
          className="card h-100 shadow-sm border-0"
          style={{ border: "none" }}
        >
          <div
            className="position-relative overflow-hidden bg-light"
            style={{ height: "280px" }}
          >
            <div className="w-100 h-100 bg-secondary animate-pulse" />
          </div>
          <div className="card-body p-3 d-flex flex-column">
            <div className="h-4 bg-secondary rounded mb-2 animate-pulse flex-grow-1" />
            <div className="h-3 bg-secondary rounded mb-2 animate-pulse w-75" />
            <div className="h-3 bg-secondary rounded animate-pulse w-50" />
          </div>
        </div>
      );
    }

    const coverUrl = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "";

    const handleClick = () => {
      if (onClick) onClick();
    };

    return (
      <div
        className="card h-100 shadow-sm border-0"
        style={{
          cursor: "pointer",
          border: "none",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "";
        }}
        onClick={handleClick}
      >
        <div
          className="position-relative overflow-hidden bg-light"
          style={{ height: "280px" }}
        >
          {coverUrl && !imgError ? (
            <img
              src={coverUrl}
              alt={book.title}
              className="w-100 h-100"
              loading="lazy"
              onError={() => setImgError(true)}
              style={{
                objectFit: "contain",
                objectPosition: "center",
                padding: "0.5rem",
              }}
            />
          ) : (
            <div
              className="w-100 h-100 d-flex align-items-center justify-content-center text-muted"
              style={{ fontSize: "0.9rem" }}
            >
              No Cover
            </div>
          )}
        </div>

        <div className="card-body d-flex flex-column p-3">
          <h5
            className="card-title fw-semibold mb-2 lh-sm flex-grow-1"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              fontSize: "0.95rem",
            }}
          >
            {book.title}
          </h5>

          <p
            className="card-text text-muted small mb-1"
            style={{ fontSize: "0.85rem" }}
          >
            {book.author_name?.[0] || "Unknown Author"}
          </p>
        </div>
      </div>
    );
  }
);

BookCard.displayName = "BookCard";

export default BookCard;
