import React from "react";
import { useNavigate } from "react-router-dom";
import BookHeader from "./BookHeader";
import MoodRating from "./MoodRating";
import ReadingProgress from "./ReadingProgress";
import JournalPreview from "./JournalPreview";
import EntryFooter from "./EntryFooter";
import { Journal } from "../../../models/journal";

interface JournalCardProps {
  entry: Journal;
}

const JournalCard: React.FC<JournalCardProps> = ({ entry }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/journal-preview/${entry.id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-2 border-amber-200 overflow-hidden transform hover:-translate-y-1 cursor-pointer"
    >
      <BookHeader journal={entry} />
      <div className="p-5">
        <MoodRating mood={entry.mood} rating={entry.rating} />
        <ReadingProgress progress={entry.readingProgress} />
        <JournalPreview entry={entry} />
        <EntryFooter
          createdAt={entry.createdAt}
          upvotes={entry.upvotedBy.length}
          downvotes={entry.downvotedBy.length}
        />
      </div>
    </div>
  );
};

export default JournalCard;
