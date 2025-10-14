import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface EntryFooterProps {
  createdAt: string;
  upvotes?: number;
  downvotes?: number;
}

const EntryFooter: React.FC<EntryFooterProps> = ({
  createdAt,
  upvotes,
  downvotes,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t-2 border-amber-100">
      <div className="text-xs text-amber-600 font-medium">
        {formatDate(createdAt)}
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded">
          <ThumbsUp className="w-3.5 h-3.5 text-green-700" />
          <span className="text-xs text-green-800 font-bold">
            {upvotes || 0}
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-red-100 px-2 py-1 rounded">
          <ThumbsDown className="w-3.5 h-3.5 text-red-700" />
          <span className="text-xs text-red-800 font-bold">
            {downvotes || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EntryFooter;
