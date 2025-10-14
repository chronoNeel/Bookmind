import React from "react";

interface SortControlsProps {
  sortBy: "recent" | "rating" | "votes";
  setSortBy: React.Dispatch<
    React.SetStateAction<"recent" | "rating" | "votes">
  >;
  totalEntries: number;
}

const SortControls: React.FC<SortControlsProps> = ({
  sortBy,
  setSortBy,
  totalEntries,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border-2 border-amber-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <label className="text-sm font-semibold text-amber-800">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-amber-50 border-2 border-amber-300 rounded-lg px-4 py-2 text-sm font-medium text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
            <option value="votes">Most Popular</option>
          </select>
        </div>
        <div className="text-sm text-amber-700 font-medium">
          {totalEntries} {totalEntries === 1 ? "entry" : "entries"}
        </div>
      </div>
    </div>
  );
};

export default SortControls;
