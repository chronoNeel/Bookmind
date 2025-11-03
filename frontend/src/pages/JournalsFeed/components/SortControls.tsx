interface SortControlProps {
  sortBy: "recent" | "rating" | "votes";
  setSortBy: (sort: "recent" | "rating" | "votes") => void;
}

const SortControl = ({ sortBy, setSortBy }: SortControlProps) => {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sortBy"
        className="text-sm text-slate-600 whitespace-nowrap shrink-0"
      >
        Sort by
      </label>

      <select
        id="sortBy"
        value={sortBy}
        onChange={(e) =>
          setSortBy(e.target.value as "recent" | "rating" | "votes")
        }
        className="rounded-full border border-amber-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
      >
        <option value="recent">Recent</option>
        <option value="rating">Rating</option>
        <option value="votes">Votes</option>
      </select>
    </div>
  );
};

export default SortControl;
