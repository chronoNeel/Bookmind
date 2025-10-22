// ReadingAnalytics.tsx
import React from "react";
import { FileText, Target } from "lucide-react";

interface ReadingAnalyticsProps {
  stats: {
    wantToReadCount: number;
    ongoingCount: number;
    completedCount: number;
    journalCount: number;
  };
  yearlyGoal: number;
  booksReadThisYear: number;
  avgRating: number;
  onJournalEntriesClick: () => void;
}

const ReadingAnalytics: React.FC<ReadingAnalyticsProps> = ({
  stats,
  yearlyGoal,
  booksReadThisYear,
  avgRating,
  onJournalEntriesClick,
}) => {
  const total =
    stats.wantToReadCount + stats.ongoingCount + stats.completedCount;
  const wantPercent = total > 0 ? (stats.wantToReadCount / total) * 100 : 0;
  const readingPercent = total > 0 ? (stats.ongoingCount / total) * 100 : 0;
  const readPercent = total > 0 ? (stats.completedCount / total) * 100 : 0;

  const goalProgress =
    yearlyGoal > 0 ? (booksReadThisYear / yearlyGoal) * 100 : 0;
  const booksAheadOrBehind = booksReadThisYear - yearlyGoal;
  const isAhead = booksAheadOrBehind >= 0;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Reading Statistics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie chart side */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="280" height="280" viewBox="0 0 280 280">
              <circle cx="140" cy="140" r="110" fill="#e5e7eb" />
              {total > 0 ? (
                <React.Fragment>
                  <circle
                    cx="140"
                    cy="140"
                    r="110"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="20"
                    strokeDasharray={`${(wantPercent / 100) * 690} 690`}
                    transform="rotate(-90 140 140)"
                  />
                  <circle
                    cx="140"
                    cy="140"
                    r="110"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="20"
                    strokeDasharray={`${(readingPercent / 100) * 690} 690`}
                    strokeDashoffset={`-${(wantPercent / 100) * 690}`}
                    transform="rotate(-90 140 140)"
                  />
                  <circle
                    cx="140"
                    cy="140"
                    r="110"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray={`${(readPercent / 100) * 690} 690`}
                    strokeDashoffset={`-${
                      ((wantPercent + readingPercent) / 100) * 690
                    }`}
                    transform="rotate(-90 140 140)"
                  />
                </React.Fragment>
              ) : null}
              <circle cx="140" cy="140" r="60" fill="white" />
              <text
                x="140"
                y="135"
                textAnchor="middle"
                fontSize="32"
                fontWeight="bold"
                fill="#374151"
              >
                {total}
              </text>
              <text
                x="140"
                y="155"
                textAnchor="middle"
                fontSize="14"
                fill="#6b7280"
              >
                Total Books
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm text-gray-600">
                Want to Read ({stats.wantToReadCount})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500"></div>
              <span className="text-sm text-gray-600">
                Currently Reading ({stats.ongoingCount})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm text-gray-600">
                Read ({stats.completedCount})
              </span>
            </div>
          </div>
        </div>

        {/* Right side cards */}
        <div className="flex flex-col gap-4">
          {/* Yearly Goal Card */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200/50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-4xl font-bold text-amber-600">
                  {booksReadThisYear} / {yearlyGoal}
                </div>
                <p className="text-sm text-gray-600 mt-1">Books this year</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Target size={24} className="text-white" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
              <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                  style={{ width: `${Math.min(goalProgress, 100)}%` }}
                />
              </div>
            </div>

            <p className="text-sm font-medium text-amber-700">
              {isAhead
                ? `${Math.abs(booksAheadOrBehind)} ${
                    Math.abs(booksAheadOrBehind) === 1 ? "book" : "books"
                  } ahead of your goal! 🎉`
                : yearlyGoal === 0
                ? "Set a yearly goal to track progress"
                : `${Math.abs(booksAheadOrBehind)} ${
                    Math.abs(booksAheadOrBehind) === 1 ? "book" : "books"
                  } to reach your goal`}
            </p>
          </div>

          {/* Average Rating Card */}
          {avgRating > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Average Rating
                  </div>
                  <div className="text-4xl font-bold text-blue-600">
                    {avgRating.toFixed(1)} ⭐
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Journal Entries Card */}
          <button
            onClick={onJournalEntriesClick}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 hover:shadow-lg transition-all group text-left"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-600">Journal Entries</span>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <FileText size={24} className="text-white" />
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {stats.journalCount}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingAnalytics;
