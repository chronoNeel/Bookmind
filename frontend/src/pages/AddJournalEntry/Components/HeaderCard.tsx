import { Calendar, User } from "lucide-react";
import { BookDetails } from "@models/Book";

interface HeaderCardProps {
  book: BookDetails;
  coverUrl: string | null;
  author: string;
  readingProgress: number;
  getStatusText: () => string;
}

const HeaderCard: React.FC<HeaderCardProps> = ({
  book,
  coverUrl,
  author,
  readingProgress,
  getStatusText,
}) => {
  return (
    <div className="bg-white border-amber-100 rounded-xl shadow-md p-6 border transition-all duration-300 mb-3">
      <div className="flex items-start gap-4">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title || "Book cover"}
            className="w-20 h-28 object-cover rounded-lg shadow-md transition-transform hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/api/placeholder/80/112";
            }}
          />
        ) : (
          <div
            className="w-20 h-28 rounded-lg shadow-md flex items-center justify-center text-xs text-gray-500 bg-gray-100"
            style={{ fontStyle: "italic" }}
          >
            No cover
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {book.title}
          </h1>

          <p className="text-gray-900 opacity-80 flex items-center mb-2">
            <User className="w-4 h-4 mr-1" />
            {author || "Unknown Author"}
          </p>

          <div className="flex items-center gap-4 text-sm opacity-60">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {book.first_publish_date || "—"}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                readingProgress === 100
                  ? "bg-green-100 text-green-700"
                  : readingProgress > 0
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderCard;
