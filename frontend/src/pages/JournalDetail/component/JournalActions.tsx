import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

interface Props {
  isPrivate: boolean;
  upvotedBy: string[];
  downvotedBy: string[];
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  isVoting: boolean;
  handleVote: (type: "up" | "down") => void;
  isOwner: boolean;
  navigate: NavigateFunction;
  journalId: string;
}

export const JournalActions: React.FC<Props> = ({
  isPrivate,
  upvotedBy,
  downvotedBy,
  hasUpvoted,
  hasDownvoted,
  isVoting,
  handleVote,
  isOwner,
  navigate,
  journalId,
}) => (
  <div className="flex justify-between items-center mt-10 flex-wrap gap-4">
    {!isPrivate && (
      <div className="flex space-x-4">
        <button
          onClick={() => handleVote("up")}
          disabled={isVoting}
          className={`flex items-center px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 ${
            hasUpvoted
              ? "bg-green-500 text-white"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          <ThumbsUp
            size={18}
            className={`mr-1 ${hasUpvoted ? "fill-white" : ""}`}
          />
          {upvotedBy.length}
        </button>
        <button
          onClick={() => handleVote("down")}
          disabled={isVoting}
          className={`flex items-center px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 ${
            hasDownvoted
              ? "bg-red-500 text-white"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          <ThumbsDown
            size={18}
            className={`mr-1 ${hasDownvoted ? "fill-white" : ""}`}
          />
          {downvotedBy.length}
        </button>
      </div>
    )}

    {isOwner && (
      <div className="flex space-x-4 ml-auto">
        <button
          onClick={() => navigate(`/journal-edit/${journalId}`)}
          className="px-6 py-3 bg-amber-200 text-gray-800 rounded-xl hover:bg-amber-300 font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
        >
          Edit
        </button>
        <button className="px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105">
          Delete
        </button>
      </div>
    )}
  </div>
);
