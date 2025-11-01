import { useState } from "react";
import { ThumbsUp, ThumbsDown, Bookmark } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { upvoteJournal, downvoteJournal } from "@/store/slices/journalSlice";
import { toast } from "react-toastify";

interface JournalActionsProps {
  journalId: string;
  upvotedBy: string[];
  downvotedBy: string[];
}

const JournalActions = ({
  journalId,
  upvotedBy: initialUpvotedBy,
  downvotedBy: initialDownvotedBy,
}: JournalActionsProps) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [isVoting, setIsVoting] = useState(false);
  const [localUpvotedBy, setLocalUpvotedBy] = useState(initialUpvotedBy);
  const [localDownvotedBy, setLocalDownvotedBy] = useState(initialDownvotedBy);

  const hasUpvoted = currentUser
    ? localUpvotedBy.includes(currentUser.uid)
    : false;
  const hasDownvoted = currentUser
    ? localDownvotedBy.includes(currentUser.uid)
    : false;

  const handleVote = async (type: "up" | "down") => {
    if (!currentUser) {
      toast.warn("Please log in to vote!", { position: "top-right" });
      return;
    }

    const userId = currentUser.uid;
    let newUpvotedBy = [...localUpvotedBy];
    let newDownvotedBy = [...localDownvotedBy];

    if (type === "up") {
      if (hasUpvoted) {
        newUpvotedBy = newUpvotedBy.filter((id) => id !== userId);
      } else {
        newUpvotedBy.push(userId);
        newDownvotedBy = newDownvotedBy.filter((id) => id !== userId);
      }
    } else {
      if (hasDownvoted) {
        newDownvotedBy = newDownvotedBy.filter((id) => id !== userId);
      } else {
        newDownvotedBy.push(userId);
        newUpvotedBy = newUpvotedBy.filter((id) => id !== userId);
      }
    }

    setLocalUpvotedBy(newUpvotedBy);
    setLocalDownvotedBy(newDownvotedBy);

    setIsVoting(true);
    try {
      await dispatch(
        type === "up" ? upvoteJournal(journalId) : downvoteJournal(journalId)
      ).unwrap();

      toast.success(
        type === "up"
          ? hasUpvoted
            ? "Upvote removed!"
            : "Journal upvoted!"
          : hasDownvoted
          ? "Downvote removed!"
          : "Journal downvoted!",
        { position: "top-right" }
      );
    } catch (err) {
      console.error(err);
      setLocalUpvotedBy(initialUpvotedBy);
      setLocalDownvotedBy(initialDownvotedBy);
      toast.error("Failed to vote. Try again.", { position: "top-right" });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="mt-1 flex items-center gap-2 flex-wrap">
      <button
        onClick={() => handleVote("up")}
        disabled={isVoting}
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium shadow-sm transition-all ${
          hasUpvoted
            ? "bg-green-500 text-white"
            : "border border-slate-200 hover:bg-slate-50"
        }`}
        aria-label="Upvote"
      >
        <ThumbsUp className={`h-4 w-4 ${hasUpvoted ? "fill-white" : ""}`} />
        {localUpvotedBy.length}
      </button>

      <button
        onClick={() => handleVote("down")}
        disabled={isVoting}
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium shadow-sm transition-all ${
          hasDownvoted
            ? "bg-red-500 text-white"
            : "border border-slate-200 hover:bg-slate-50"
        }`}
        aria-label="Downvote"
      >
        <ThumbsDown className={`h-4 w-4 ${hasDownvoted ? "fill-white" : ""}`} />
        {localDownvotedBy.length}
      </button>

      <button
        className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
        aria-label="Save"
      >
        <Bookmark className="h-4 w-4" /> Save
      </button>
    </div>
  );
};

export default JournalActions;
