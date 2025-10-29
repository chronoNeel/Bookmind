import React from "react";
import { useNavigate } from "react-router-dom";
import { Journal } from "@models/journal";

interface BookHeaderProps {
  journal: Journal;
  loading?: boolean;
}

const BookHeader: React.FC<BookHeaderProps> = ({
  journal,
  loading = false,
}) => {
  const navigate = useNavigate();

  const handleBookNavigate = (e: React.MouseEvent): void => {
    e.stopPropagation();
    navigate(`/book/${encodeURIComponent(journal.bookKey)}`);
  };

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

  // Success State
  const bookTitle = journal.bookTitle || "Untitled";
  const bookAuthor = journal.bookAuthor || "Unknown Author";
  const hasCover = journal.bookCoverUrl;

  return (
    <div className="flex items-start gap-3 p-3 rounded-t-lg bg-[#4F200D] text-[#FFFAEA]">
      {hasCover && (
        <img
          src={journal.bookCoverUrl}
          alt={bookTitle}
          className="rounded shadow border border-amber-900/30 cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg flex-shrink-0"
          style={{ width: 60, height: 85, objectFit: "cover" }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>): void => {
            e.currentTarget.style.display = "none";
          }}
          onClick={handleBookNavigate}
        />
      )}
      <div className="flex-grow min-w-0">
        <h5
          className="font-semibold mb-1 cursor-pointer hover:text-amber-200 transition-colors duration-200 truncate"
          style={{ fontSize: "0.95rem" }}
          onClick={handleBookNavigate}
          title={bookTitle}
        >
          {bookTitle}
        </h5>
        <p className="mb-0 opacity-75 truncate text-sm" title={bookAuthor}>
          {bookAuthor}
        </p>
        <p className="mb-0 mt-1 italic opacity-75 text-xs">
          Journal by <span className="font-semibold text-amber-300">User</span>
        </p>
      </div>
    </div>
  );
};

export default BookHeader;
