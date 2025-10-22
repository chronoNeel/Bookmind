import React from "react";

interface ReadingProgressProps {
  progress?: number;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({ progress }) => {
  const getColor = (p: number | undefined) => {
    if (!p) return "bg-amber-200 text-amber-800";
    if (p < 25) return "bg-rose-200 text-rose-800";
    if (p < 50) return "bg-orange-200 text-orange-800";
    if (p < 75) return "bg-yellow-200 text-yellow-800";
    if (p < 100) return "bg-lime-200 text-lime-800";
    return "bg-emerald-200 text-emerald-800";
  };

  const getText = (p: number | undefined) => {
    if (!p) return "Want to Read";
    if (p === 100) return "Completed";
    return `${p}% Complete`;
  };

  return (
    <div className="mb-4">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getColor(
          progress
        )}`}
      >
        {getText(progress)}
      </span>
    </div>
  );
};

export default ReadingProgress;
