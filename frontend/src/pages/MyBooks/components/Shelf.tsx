import React from "react";
import { TrendingUp } from "lucide-react";
import { ShelfProps } from "./types";
import { BookCard } from "./BookCard";
import { EmptyShelf } from "./EmptyShelft";

export const Shelf: React.FC<ShelfProps> = ({
  title,
  bookKeys,
  icon: Icon,
  color,
  isExpanded,
  onToggle,
}) => {
  const displayBooks = isExpanded ? bookKeys : bookKeys.slice(0, 4);
  const hasMore = bookKeys.length > 4;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-500">
                {bookKeys.length} {bookKeys.length === 1 ? "book" : "bookKeys"}
              </p>
            </div>
          </div>
          {hasMore && (
            <button
              onClick={onToggle}
              className="flex items-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span>
                {isExpanded ? "Show less" : `Show all (${bookKeys.length})`}
              </span>
              <TrendingUp
                size={16}
                className={`transform transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        {bookKeys.length === 0 ? (
          <EmptyShelf message={`No bookKeys in ${title.toLowerCase()}`} />
        ) : (
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {displayBooks.map((bookKey, index) => (
              <BookCard key={index} bookKey={bookKey} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
