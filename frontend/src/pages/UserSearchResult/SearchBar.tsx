import React from "react";
import { Search, X } from "lucide-react";

interface Props {
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<Props> = ({
  searchInput,
  setSearchInput,
  handleSearch,
  isLoading,
}) => (
  <form onSubmit={handleSearch} className="mb-8">
    <div className="flex items-center bg-white rounded-full shadow-sm overflow-hidden border-2 border-amber-200 h-11">
      <div className="flex items-center justify-center pl-3 text-amber-600">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search users by name or username..."
        className="flex-1 border-0 outline-none bg-transparent px-2 text-sm text-gray-700"
      />
      {isLoading && (
        <div className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-amber-600 border-t-transparent" />
      )}
      {searchInput && !isLoading && (
        <button
          type="button"
          onClick={() => setSearchInput("")}
          className="mr-2 text-amber-600 hover:opacity-70"
        >
          <X size={16} />
        </button>
      )}
      <button
        type="submit"
        className="bg-amber-500 hover:bg-amber-600 text-white mr-2 ml-4 rounded-full px-4 py-1 text-sm font-medium"
      >
        Search
      </button>
    </div>
  </form>
);

export default SearchBar;
