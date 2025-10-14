import React from "react";
import { Book } from "../../../types/Book";
import { useNavigate } from "react-router-dom";

interface BookHeaderProps {
  headerBook: Book;
}

const BookHeader: React.FC<BookHeaderProps> = ({ headerBook }) => {
  const navigate = useNavigate();

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/book/${encodeURIComponent(headerBook.key)}`, {
      state: { headerBook },
    });
    console.log(headerBook.key);
  };

  return (
    <div
      className="d-flex align-items-start gap-3 p-3 rounded-top"
      style={{ backgroundColor: "#4F200D", color: "#FFFAEA" }}
    >
      {headerBook.cover_i && (
        <img
          src={`https://covers.openlibrary.org/b/id/${headerBook.cover_i}-S.jpg`}
          alt={headerBook.title}
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
          {headerBook.title}
        </h5>

        <p
          className="mb-0 text-light opacity-75 text-truncate"
          style={{ fontSize: "0.8rem" }}
        >
          {headerBook.author_name?.[0] || "Unknown Author"}
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
