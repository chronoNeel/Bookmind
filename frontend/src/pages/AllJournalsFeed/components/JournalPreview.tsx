import React from "react";
import { useNavigate } from "react-router-dom";
import { Journal } from "../../../models/journal";

interface JournalPreviewProps {
  entry: Journal;
}

const JournalPreview: React.FC<JournalPreviewProps> = ({ entry }) => {
  const navigate = useNavigate();
  return (
    <div className="mb-4">
      <p className="text-amber-800 text-sm leading-relaxed line-clamp-3">
        {entry.entry}
      </p>
      {entry.entry.length > 150 && (
        <button
          className="text-amber-600 text-sm font-semibold mt-2 hover:text-amber-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/journal-preview/${entry.id}`);
          }}
        >
          Read more →
        </button>
      )}
    </div>
  );
};

export default JournalPreview;
