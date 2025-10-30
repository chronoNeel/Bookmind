import React, { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import { useAppDispatch } from "@hooks/redux";
import { deleteJournalById } from "@/store/slices/journalSlice";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

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
}) => {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const resultAction = await dispatch(deleteJournalById(journalId));
      if (deleteJournalById.fulfilled.match(resultAction)) {
        setShowModal(false);
        navigate("/journals");
      } else {
        alert(resultAction.payload || "Failed to delete journal");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the journal.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mt-5 flex-wrap gap-3">
        {!isPrivate && (
          <div className="d-flex gap-3">
            <button
              onClick={() => handleVote("up")}
              disabled={isVoting}
              className={`btn d-flex align-items-center px-4 py-2 rounded-pill fw-medium shadow-sm ${
                hasUpvoted ? "btn-success text-white" : "btn-outline-success"
              }`}
              style={{ transition: "all 0.2s" }}
            >
              <ThumbsUp
                size={18}
                className="me-2"
                fill={hasUpvoted ? "white" : "none"}
              />
              {upvotedBy.length}
            </button>
            <button
              onClick={() => handleVote("down")}
              disabled={isVoting}
              className={`btn d-flex align-items-center px-4 py-2 rounded-pill fw-medium shadow-sm ${
                hasDownvoted ? "btn-danger text-white" : "btn-outline-danger"
              }`}
              style={{ transition: "all 0.2s" }}
            >
              <ThumbsDown
                size={18}
                className="me-2"
                fill={hasDownvoted ? "white" : "none"}
              />
              {downvotedBy.length}
            </button>
          </div>
        )}
        {isOwner && (
          <div className="d-flex gap-3 ms-auto">
            <button
              onClick={() => navigate(`/journal-edit/${journalId}`)}
              className="btn btn-warning px-4 py-2 rounded-pill fw-medium shadow-sm"
              style={{ transition: "all 0.2s" }}
            >
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className={`btn px-4 py-2 rounded-pill fw-medium shadow-sm ${
                isDeleting ? "btn-danger opacity-50" : "btn-outline-danger"
              }`}
              style={{
                transition: "all 0.2s",
                cursor: isDeleting ? "not-allowed" : "pointer",
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};
