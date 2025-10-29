import React from "react";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { JournalEntry } from "@models/Book";

interface JournalEntryCardProps {
  entry: JournalEntry;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry }) => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < Math.floor(rating)
            ? "fill-amber-400 text-amber-400"
            : "text-gray-300"
        }
      />
    ));
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow">
      <div className="flex gap-4">
        <img
          src={entry.user.avatar}
          alt={entry.user.name}
          className="w-12 h-12 rounded-full border-2 border-white shadow-md"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{entry.user.name}</h3>
              <p className="text-sm text-gray-600">{entry.date}</p>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(entry.rating)}
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">{entry.text}</p>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors">
              <ThumbsUp size={18} />
              <span className="font-medium">{entry.upvotes}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
              <ThumbsDown size={18} />
              <span className="font-medium">{entry.downvotes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryCard;
