import React from "react";

interface ReadingProgressProps {
  progress?: number;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({ progress }) => {
  const getProgressColor = (progress: number | undefined) => {
    if (!progress) return "bg-amber-200 text-amber-800";
    if (progress < 25) return "bg-rose-200 text-rose-800";
    if (progress < 50) return "bg-orange-200 text-orange-800";
    if (progress < 75) return "bg-yellow-200 text-yellow-800";
    if (progress < 100) return "bg-lime-200 text-lime-800";
    return "bg-emerald-200 text-emerald-800";
  };

  const getProgressText = (progress: number | undefined) => {
    if (!progress) return "Want to Read";
    if (progress === 100) return "Completed";
    return `${progress}% Complete`;
  };

  return (
    <div className="mb-4">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getProgressColor(
          progress
        )}`}
      >
        {getProgressText(progress)}
      </span>
    </div>
  );
};

export default ReadingProgress;
