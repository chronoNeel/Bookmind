import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserSearchProps {
  onSearch: (query: string) => void;
  onSubmit: (query: string) => void;
  placeholder?: string;
  delay?: number;
  suggestions?: string[];
  isLoadingUser?: boolean;
}

const UserSearch: React.FC<UserSearchProps> = ({
  onSearch,
  onSubmit,
  placeholder = "Search users...",
  delay = 400,
  suggestions = [],
  isLoadingUser = false,
}) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 🔸 Debounced search
  useEffect(() => {
    if (!query.trim()) {
      onSearch("");
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearch(query.trim());
    }, delay);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, onSearch, delay]);

  // 🔸 Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔸 Handlers
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;

      onSubmit(trimmed);
      navigate(`/users/${encodeURIComponent(trimmed)}`);
      setShowSuggestions(false);
    },
    [query, onSubmit, navigate]
  );

  const handleClear = () => {
    setQuery("");
    onSearch("");
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (name: string) => {
    setQuery(name);
    onSubmit(name);
    navigate(`/users/${encodeURIComponent(name)}`);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (query.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div ref={containerRef} className="mb-4 position-relative">
      <form onSubmit={handleSubmit}>
        <div
          className="d-flex align-items-center bg-white rounded-pill shadow-sm overflow-hidden"
          style={{
            border: "2px solid #e5d4c1",
            height: "44px",
            transition: "all 0.3s ease",
          }}
        >
          {/* Icon */}
          <div
            className="d-flex align-items-center justify-content-center ps-3"
            style={{
              width: "44px",
              color: "#d4a574",
            }}
          >
            <Search size={18} />
          </div>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.trim().length > 0);
            }}
            onFocus={handleFocus}
            className="form-control border-0 shadow-none bg-transparent"
            placeholder={placeholder}
            style={{
              fontSize: "14px",
              color: "#4a3f35",
            }}
          />

          {/* Loading spinner */}
          {isLoadingUser && (
            <div className="me-2">
              <div className="spinner-border spinner-border-sm text-warning" />
            </div>
          )}

          {/* Clear button */}
          {query && !isLoadingUser && (
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

          {/* Submit button */}
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

      {/* 🔸 Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="position-absolute bg-white shadow-sm rounded-3 mt-1 w-100"
          style={{
            border: "1px solid #e5d4c1",
            zIndex: 10,
            maxHeight: "220px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((name, idx) => (
            <div
              key={idx}
              onClick={() => handleSuggestionClick(name)}
              className="px-3 py-2 text-truncate"
              style={{
                fontSize: "14px",
                cursor: "pointer",
                color: "#4a3f35",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff7ec";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
