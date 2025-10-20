import React, { useMemo, useState } from "react";
import { TrendingUp, Plus, Minus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { toast } from "react-toastify";
import { updateYearlyGoal } from "../../../store/slices/statsSlice";
import { updateUserProfile } from "../../../store/slices/authSlice";
import { booksReadThisYear, getCurrentUser } from "../../../utils/getUserData";

const ReadingChallenge: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = getCurrentUser();

  const booksThisYear = booksReadThisYear();

  const readingGoal = currentUser?.stats?.yearlyGoal ?? 0;

  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);

  const setReadingGoal = async (goal: "increase" | "decrease") => {
    if (!currentUser) {
      toast.warn("Please log in to set a goal", { position: "top-center" });
      return;
    }
    if (isUpdatingGoal) return;

    try {
      setIsUpdatingGoal(true);

      const currentGoal = currentUser?.stats?.yearlyGoal ?? 0;
      const newGoal =
        goal === "increase" ? currentGoal + 1 : Math.max(0, currentGoal - 1);

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
    } catch (error: any) {
      console.error("Failed to update yearly goal:", error);
      if (error?.code === "AUTH_REQUIRED") {
        toast.error("Please log in again to continue", {
          position: "top-center",
        });
      } else {
        toast.error(error?.message || "Failed to update reading goal", {
          position: "top-center",
        });
      }
    } finally {
      setIsUpdatingGoal(false);
    }
  };

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
        .btn-warm {
          background: linear-gradient(135deg, #faf7f0 0%, #f5f0e6 100%);
          border: 2px solid #c9b38c;
          color: #5d4a2f;
          transition: all 0.2s ease;
          width: 32px;
          height: 32px;
          min-width: 32px;
          flex-shrink: 0;
        }
        .btn-warm:hover:not(:disabled) {
          background: linear-gradient(135deg, #f5f0e6 0%, #e8dcc4 100%);
          border-color: #8b6f47;
          transform: scale(1.05);
          box-shadow: 0 2px 6px rgba(139, 111, 71, 0.2);
        }
        .btn-warm:active:not(:disabled) {
          transform: scale(0.98);
        }
        .achievement-text {
          color: #8b6f47;
          font-weight: 500;
          font-size: 0.875rem;
        }
        .goal-number {
          min-width: 48px;
          text-align: center;
        }
        @media (max-width: 576px) {
          .btn-warm {
            width: 28px;
            height: 28px;
            min-width: 28px;
          }
          .goal-number {
            font-size: 1.25rem;
            min-width: 40px;
          }
        }
      `}</style>

      <div className="card border-0 rounded-3 shadow-sm">
        <div className="card-body p-3 p-sm-4">
          <h2 className="card-title h5 fw-bold mb-3 d-flex align-items-center">
            <TrendingUp className="me-2 challenge-icon" size={20} />
            <span className="d-none d-sm-inline">{year} Reading Challenge</span>
            <span className="d-inline d-sm-none">Reading Challenge</span>
          </h2>

          <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
            <span className="goal-text flex-shrink-0">Your Goal:</span>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setReadingGoal("decrease")}
                disabled={isUpdatingGoal}
                className="btn btn-warm btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                aria-label="Decrease goal"
              >
                <Minus size={16} />
              </button>
              <span className="h4 fw-bold mb-0 goal-text goal-number">
                {safeGoal}
              </span>
              <button
                onClick={() => setReadingGoal("increase")}
                disabled={isUpdatingGoal}
                className="btn btn-warm btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                aria-label="Increase goal"
              >
                <Plus size={16} />
              </button>
            </div>
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
              >
                <span className="visually-hidden">
                  {Math.round(progressPercentage)}% complete
                </span>
              </div>
            </div>
          </div>

          <p className="text-center mt-3 mb-0 achievement-text">
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
