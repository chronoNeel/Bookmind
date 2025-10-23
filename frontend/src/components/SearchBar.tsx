import React, { useEffect, useRef, useState, useCallback } from "react";
import { Search } from "lucide-react";
import SearchSuggestion from "./SearchSuggestion";
import { useLocation, useNavigate } from "react-router-dom";
import { searchBooks } from "../store/slices/searchSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

const SearchBar: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchRef = useRef<string>(""); // Track last search to avoid duplicates

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { searchResults, isLoading } = useAppSelector(
    (state) => state.searchBooks
  );

  // Get top 5 results for suggestions - memoized
  const suggestionBooks = searchResults.slice(0, 5);

  // Persist search term across navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query && query !== searchTerm) {
      setSearchTerm(query);
      if (query !== lastSearchRef.current) {
        lastSearchRef.current = query;
        dispatch(searchBooks(query));
      }
    }
  }, [location.search, searchTerm, dispatch]);

  // Hide suggestions when navigating
  useEffect(() => {
    setShowSuggestions(false);
  }, [location.pathname]);

  // Optimized debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmedTerm = searchTerm.trim();

    if (trimmedTerm && trimmedTerm !== lastSearchRef.current) {
      debounceTimerRef.current = setTimeout(() => {
        lastSearchRef.current = trimmedTerm;
        dispatch(searchBooks(trimmedTerm));
      }, 300); // Reduced from 500ms to 300ms
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, dispatch]);

  // Click outside to hide suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      setShowSuggestions(value.trim().length > 0);
    },
    []
  );

  const handleInputFocus = useCallback(() => {
    if (searchTerm.trim()) {
      setShowSuggestions(true);
    }
  }, [searchTerm]);

  const handleInputBlur = useCallback(() => {
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setShowSuggestions(false);
      }
    }, 100);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        const trimmedTerm = searchTerm.trim();
        if (trimmedTerm) {
          // Only dispatch if different from last search
          if (trimmedTerm !== lastSearchRef.current) {
            lastSearchRef.current = trimmedTerm;
            dispatch(searchBooks(trimmedTerm));
          }
          navigate(`/search-results?q=${encodeURIComponent(trimmedTerm)}`);
        }

        setShowSuggestions(false);
        inputRef.current?.blur();
      }

      if (e.key === "Escape") {
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    },
    [searchTerm, dispatch, navigate]
  );

  const shouldShowSuggestions =
    searchTerm.trim() &&
    !isLoading &&
    showSuggestions &&
    suggestionBooks.length > 0;

  return (
    <div ref={searchContainerRef} className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-2xl lg:max-w-lg xl:max-w-xl mt-2.5 mb-1.5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2 sm:py-3 border-2 border-amber-200 rounded-full bg-white focus:outline-none focus:border-amber-400 focus:bg-white transition-all duration-200 text-amber-900 placeholder-amber-500 text-center placeholder:text-center text-sm sm:text-base placeholder:opacity-50"
            placeholder="- Search your books -"
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
              <div className="animate-spin h-4 w-4 border-2 border-amber-600 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {shouldShowSuggestions && (
        <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-2xl lg:max-w-lg xl:max-w-xl">
          <SearchSuggestion books={suggestionBooks} searchText={searchTerm} />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
