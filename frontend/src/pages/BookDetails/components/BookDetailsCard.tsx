import React, { useState } from "react";
import { Heart, ChevronDown } from "lucide-react";
import { getStatusColor, getStatusLabel } from "@utils/statusHelpers";
import { BookDetails } from "@models/Book";
import { StatusValue } from "@models/StatusModal";

interface BookDetailsCardProps {
  book: BookDetails;
  authors: string;
  coverUrl: string | null;
  description: string;
  genres: string[];
  isFavorite: boolean;
  status: StatusValue;
  onFavoriteToggle: () => void;
  onStatusClick: () => void;
  onAddJournal: () => void;
}

const BookDetailsCard: React.FC<BookDetailsCardProps> = ({
  book,
  authors,
  coverUrl,
  description,
  genres,
  isFavorite,
  status,
  onFavoriteToggle,
  onStatusClick,
  onAddJournal,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-md p-8 mb-12">
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        {/* Cover */}
        <div className="flex justify-center md:justify-start shrink-0">
          <div className="w-72">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={book.title}
                className="w-full rounded-2xl shadow-md transition-transform hover:scale-105 object-cover aspect-[2/3]"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-100 flex items-center justify-center rounded-2xl shadow-inner text-gray-400">
                No cover available
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-4xl font-bold text-gray-900 break-words">
              {book.title}
            </h1>
            <button
              onClick={onFavoriteToggle}
              className={`shrink-0 p-3 rounded-full transition-all duration-300 ${
                isFavorite
                  ? "text-red-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart
                className={`w-6 h-6 transition-all ${
                  isFavorite ? "fill-current" : ""
                }`}
              />
            </button>
          </div>

          <p className="text-lg text-amber-800 font-medium">{authors}</p>

          <div className="flex flex-wrap gap-2">
            {genres.map((genre, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 rounded-full text-sm font-medium shadow-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          <p
            className={`text-gray-700 leading-relaxed ${
              !showFullDescription ? "line-clamp-3" : ""
            }`}
          >
            {description}
          </p>

          {description.length > 150 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-amber-600 hover:text-amber-800 mt-2 font-medium transition-colors"
            >
              {showFullDescription ? "Show Less" : "Read More →"}
            </button>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-4">
            {/* Status Button */}
            <button
              onClick={onStatusClick}
              className={`flex items-center gap-2 px-4 py-2.5 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${getStatusColor(
                status
              )}`}
            >
              <span>{getStatusLabel(status)}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <button
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              onClick={onAddJournal}
            >
              Add Journal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsCard;
