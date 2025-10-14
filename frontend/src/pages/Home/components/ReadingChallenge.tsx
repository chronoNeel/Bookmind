import React from "react";
import { TrendingUp, Plus, Minus } from "lucide-react";

interface ReadingChallengeProps {
  readingGoal: number;
  setReadingGoal: React.Dispatch<React.SetStateAction<number>>;
  booksRead: number;
}

const ReadingChallenge: React.FC<ReadingChallengeProps> = ({
  readingGoal,
  setReadingGoal,
  booksRead,
}) => {
  const progressPercentage = Math.min((booksRead / readingGoal) * 100, 100);

  return (
    <>
      <style>{`
        .warm-progress {
          background: #f5f0e6;
          border: 2px solid #c9b38c;
        }

        .warm-progress-bar {
          background: #d4a574;
          transition: width 0.6s ease;
        }

        .challenge-icon {
          color: #8b6f47;
        }

        .goal-text {
          color: #5d4a2f;
          font-weight: 600;
        }

        .btn-warm {
          background: linear-gradient(135deg, #faf7f0 0%, #f5f0e6 100%);
          border: 2px solid #c9b38c;
          color: #5d4a2f;
          transition: all 0.2s ease;
        }

        .btn-warm:hover {
          background: linear-gradient(135deg, #f5f0e6 0%, #e8dcc4 100%);
          border-color: #8b6f47;
          transform: scale(1.05);
          box-shadow: 0 2px 6px rgba(139, 111, 71, 0.2);
        }

        .btn-warm:active {
          transform: scale(0.98);
        }

        .achievement-text {
          color: #8b6f47;
          font-weight: 500;
        }
      `}</style>

      <div className="card border-0 rounded-3 shadow-sm">
        <div className="card-body p-4">
          <h2 className="card-title h5 fw-bold mb-3 d-flex align-items-center">
            <TrendingUp className="me-2 challenge-icon" size={20} />
            2025 Reading Challenge
          </h2>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="goal-text">Your Goal:</span>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setReadingGoal(Math.max(1, readingGoal - 1))}
                className="btn btn-warm btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: "36px", height: "36px" }}
              >
                <Minus size={18} />
              </button>
              <span className="h4 fw-bold px-3 mb-0 goal-text">
                {readingGoal}
              </span>
              <button
                onClick={() => setReadingGoal(readingGoal + 1)}
                className="btn btn-warm btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: "36px", height: "36px" }}
              >
                <Plus size={18} />
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

            <div
              className="progress warm-progress rounded-pill"
              style={{ height: "10px" }}
            >
              <div
                className="progress-bar warm-progress-bar rounded-pill"
                role="progressbar"
                style={{
                  width: `${progressPercentage}%`,
                }}
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

          <p
            className="text-center mt-3 mb-0 achievement-text"
            style={{ fontSize: "0.875rem" }}
          >
            {readingGoal - booksRead > 0
              ? ` ${readingGoal - booksRead} ${
                  readingGoal - booksRead === 1 ? "book" : "books"
                } to go!`
              : "🎉 Goal achieved! Keep reading!"}
          </p>
        </div>
      </div>
    </>
  );
};

export default ReadingChallenge;
