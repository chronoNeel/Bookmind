import { Search, Filter as FilterIcon } from "lucide-react";

interface SortControlsProps {
  sortBy: "recent" | "rating" | "votes";
  setSortBy: (sort: "recent" | "rating" | "votes") => void;
}

const SortControls = ({ sortBy, setSortBy }: SortControlsProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-serif text-slate-900">Journal Feed</h1>
      </div>

      <div className="flex w-full items-center gap-2 md:w-auto">
        <div className="relative flex-1 md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by book or user…"
            className="w-full rounded-full border border-amber-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
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

          <button className="inline-flex items-center gap-2 rounded-full border border-amber-200 px-3 py-2 text-sm hover:bg-slate-50">
            <FilterIcon className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortControls;
