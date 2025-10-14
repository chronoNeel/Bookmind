import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBoxProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const UserSearch: React.FC<SearchBoxProps> = ({
  onSearch,
  placeholder = "Search User",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch}>
        <div
          className="d-flex align-items-center bg-white rounded-pill shadow-sm overflow-hidden"
          style={{
            border: "2px solid #e5d4c1",
            height: "44px",
            transition: "all 0.3s ease",
          }}
        >
          {/* Search Icon */}
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "44px",
              height: "44px",
              color: "#d4a574",
              paddingLeft: "1rem",
            }}
          >
            <Search size={18} />
          </div>

          {/* Input Field */}
          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              fontSize: "14px",
              color: "#4a3f35",
              backgroundColor: "transparent",
              outline: "none",
              boxShadow: "none",
            }}
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-link text-decoration-none p-0 me-2"
              style={{
                color: "#a0826d",
                minWidth: "28px",
                height: "28px",
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="btn text-white me-2"
            style={{
              backgroundColor: "#d4a574",
              borderRadius: "20px",
              padding: "6px 18px",
              fontSize: "13px",
              fontWeight: "500",
              border: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#c89660";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#d4a574";
            }}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSearch;
