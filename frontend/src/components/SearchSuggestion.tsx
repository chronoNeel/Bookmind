import React from "react";
import { useNavigate } from "react-router-dom";
import { Book } from "../types/Book";

interface SearchSuggestionProps {
  books: Book[];
  searchText: string;
}

const SearchSuggestion: React.FC<SearchSuggestionProps> = ({
  books,
  searchText,
}) => {
  const navigate = useNavigate();
  const previewBooks = books.slice(0, 5);

  const getCoverUrl = (coverId: number): string => {
    return `https://covers.openlibrary.org/b/id/${coverId}-S.jpg`;
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      <div className="absolute w-full bg-white shadow-xl rounded-xl border border-gray-200 z-20 overflow-hidden">
        {previewBooks.map((book, index) => {
          const coverUrl = getCoverUrl(book.cover_i!);

          return (
            <div
              key={`${book.key}-${index}`}
              onMouseDown={() =>
                navigate(`/book/${encodeURIComponent(book.key)}`, {
                  state: { book },
                })
              }
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <img
                src={coverUrl}
                alt={book.title}
                className="w-10 h-14 object-cover rounded-md border"
              />
              <div className="flex flex-col">
                <span className="font-medium text-gray-800 truncate">
                  {book.title}
                </span>
                <span className="text-gray-500 text-sm">
                  {book.author_name?.[0] || "Unknown"}
                </span>
              </div>
            </div>
          );
        })}

        <button
          onMouseDown={() => {
            navigate("/search-results");
          }}
          className="w-full text-center text-amber-600 font-medium py-2 hover:bg-amber-50 border-t border-gray-100"
        >
          See all results for &quot;{searchText}&quot;
        </button>
      </div>
    </div>
  );
};

export default SearchSuggestion;
