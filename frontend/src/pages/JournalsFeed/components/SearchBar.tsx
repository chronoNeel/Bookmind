import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-xs">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={16}
      />
      <input
        type="text"
        placeholder="Search by book title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-amber-200 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
      />
    </div>
  );
};

export default SearchBar;
