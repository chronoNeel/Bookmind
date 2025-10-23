import React, { useState, useMemo, KeyboardEvent } from "react";
import { TrendingUp, Plus, Minus, Edit2, Check, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { toast } from "react-toastify";
import { updateYearlyGoal } from "../../../store/slices/statsSlice";
import { updateUserProfile } from "../../../store/slices/authSlice";

const ReadingChallenge: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  // Derive number of books completed this year
  const booksThisYear = useMemo(() => {
    if (!currentUser?.shelves?.completed) return 0;

    const currentYear = new Date().getFullYear();

    return currentUser.shelves.completed.filter(
      (book: { updatedAt: string }) => {
        const bookYear = new Date(book.updatedAt).getFullYear();
        return bookYear === currentYear;
      }
    ).length;
  }, [currentUser?.shelves?.completed]);

  const readingGoal = currentUser?.stats?.yearlyGoal ?? 0;

  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempGoal, setTempGoal] = useState<string>("");

  // Unified function to update goal (handles manual entry + +/-)
  const updateGoal = async (newGoal: number) => {
    if (!currentUser) {
      toast.warn("Please log in to set a goal", { position: "top-center" });
      return;
    }
    if (isUpdatingGoal) return;

    try {
      setIsUpdatingGoal(true);

      await dispatch(updateYearlyGoal({ yearlyGoal: newGoal })).unwrap();

      dispatch(
        updateUserProfile({
          stats: {
            ...currentUser.stats,
            yearlyGoal: newGoal,
          },
        })
      );

      toast.success(`Reading goal updated to ${newGoal} books!`, {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error: unknown) {
      console.error("Failed to update yearly goal:", error);

      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: string }).code === "AUTH_REQUIRED"
      ) {
        toast.error("Please log in again to continue", {
          position: "top-center",
        });
      } else if (error && typeof error === "object" && "message" in error) {
        toast.error(
          (error as { message?: string }).message ||
            "Failed to update reading goal",
          { position: "top-center" }
        );
      } else {
        toast.error("Failed to update reading goal", {
          position: "top-center",
        });
      }
    } finally {
      setIsUpdatingGoal(false);
    }
  };

  // Handlers for + and -
  const handleIncrease = () => updateGoal(readingGoal + 1);
  const handleDecrease = () => updateGoal(Math.max(0, readingGoal - 1));

  // Manual editing
  const handleEditClick = () => {
    setTempGoal(readingGoal.toString());
    setIsEditMode(true);
  };

  const handleSaveManual = () => {
    const newGoal = parseInt(tempGoal, 10);
    if (!isNaN(newGoal) && newGoal >= 0) {
      updateGoal(newGoal);
      setIsEditMode(false);
    } else {
      toast.error("Please enter a valid number", { position: "top-center" });
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setTempGoal("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSaveManual();
    else if (e.key === "Escape") handleCancelEdit();
  };

  // Computed values
  const safeGoal = Math.max(0, readingGoal);
  const progressPercentage =
    safeGoal > 0 ? Math.min((booksThisYear / safeGoal) * 100, 100) : 0;
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        .warm-progress {
          background: #f5f0e6;
          border: 2px solid #c9b38c;
          height: 10px;
        }
        .warm-progress-bar {
          background: #d4a574;
          transition: width 0.6s ease;
        }
        .challenge-icon { color: #8b6f47; }
        .goal-text {
          color: #5d4a2f;
          font-weight: 600;
        }
        .btn-warm, .btn-edit, .btn-save, .btn-cancel {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          min-width: 28px;
          flex-shrink: 0;
          border: 2px solid #c9b38c;
          background: linear-gradient(135deg, #faf7f0 0%, #f5f0e6 100%);
          color: #5d4a2f;
          transition: all 0.2s ease;
        }
        .btn-warm:hover:not(:disabled), .btn-edit:hover:not(:disabled) {
          background: linear-gradient(135deg, #f5f0e6 0%, #e8dcc4 100%);
          border-color: #8b6f47;
          transform: scale(1.05);
          box-shadow: 0 2px 6px rgba(139, 111, 71, 0.2);
        }
        .btn-save {
          background: linear-gradient(135deg, #d4f4dd 0%, #c8efd4 100%);
          border-color: #8bc99f;
          color: #2d5a3d;
        }
        .btn-cancel {
          background: linear-gradient(135deg, #ffd4d4 0%, #ffcaca 100%);
          border-color: #d99999;
          color: #8b4545;
        }
        .goal-input {
          width: 70px;
          height: 32px;
          text-align: center;
          border: 2px solid #c9b38c;
          border-radius: 8px;
          background: #faf7f0;
          color: #5d4a2f;
          font-weight: 600;
          font-size: 1.25rem;
        }
        .goal-input:focus {
          outline: none;
          border-color: #8b6f47;
          box-shadow: 0 0 0 3px rgba(139, 111, 71, 0.1);
        }
      `}</style>

      <div className="card border-0 rounded-3 shadow-sm">
        <div className="card-body p-3 p-sm-4">
          <h2 className="card-title h5 fw-bold mb-3 d-flex align-items-center">
            <TrendingUp className="me-2 challenge-icon" size={20} />
            <span>{year} Reading Challenge</span>
          </h2>

          <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
            <span className="goal-text flex-shrink-0">Your Goal:</span>

            {!isEditMode ? (
              <div className="d-flex align-items-center gap-2">
                <button
                  onClick={handleDecrease}
                  disabled={isUpdatingGoal}
                  className="btn-warm"
                  aria-label="Decrease goal"
                >
                  <Minus size={14} />
                </button>
                <span className="h4 fw-bold mb-0 goal-text">{safeGoal}</span>
                <button
                  onClick={handleIncrease}
                  disabled={isUpdatingGoal}
                  className="btn-warm"
                  aria-label="Increase goal"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={handleEditClick}
                  className="btn-edit"
                  aria-label="Edit goal manually"
                  title="Enter custom goal"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  className="goal-input"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(e.target.value)}
                  onKeyDown={handleKeyPress}
                  min={0}
                  autoFocus
                  aria-label="Enter goal"
                />
                <button
                  onClick={handleSaveManual}
                  className="btn-save"
                  aria-label="Save goal"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn-cancel"
                  aria-label="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-3">
            <div className="d-flex justify-content-between small mb-2 goal-text">
              <span className="fw-semibold">Progress</span>
              <span className="fw-semibold">
                {Math.round(progressPercentage)}%
              </span>
            </div>

            <div className="progress warm-progress rounded-pill">
              <div
                className="progress-bar warm-progress-bar rounded-pill"
                role="progressbar"
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          <p className="text-center mt-3 mb-0 goal-text">
            {safeGoal - booksThisYear > 0
              ? `${safeGoal - booksThisYear} ${
                  safeGoal - booksThisYear === 1 ? "book" : "books"
                } to go!`
              : "🎉 Goal achieved! Keep reading!"}
          </p>
        </div>
      </div>
    </>
  );
};

export default ReadingChallenge;
