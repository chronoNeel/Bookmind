import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "../../types/Book";
import { fetchBooks } from "../../api/bookApi";

interface searchState {
  searchTerm: string;
  books: Book[];
  isLoading: boolean;
  error: string | null;
  showSuggestion: boolean;
  currentPage: number;
}

const initialState: searchState = {
  searchTerm: "",
  books: [],
  isLoading: false,
  error: null,
  showSuggestion: false,
  currentPage: 1,
};

export const searchBooks = createAsyncThunk(
  "search/searchBooks",
  async (searchTerm: string, { rejectWithValue }) => {
    if (!searchTerm.trim()) {
      return [];
    }

    try {
      return await fetchBooks(searchTerm);
    } catch (err: any) {
      return rejectWithValue(err.message || "Error fetching books");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setShowSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showSuggestion = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = "";
      state.books = [];
      state.showSuggestion = false;
      state.currentPage = 1;
      state.error = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(searchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.books = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.books = [];
      });
  },
});

export const {
  setSearchTerm,
  setShowSuggestions,
  clearSearch,
  setCurrentPage,
  clearError,
} = searchSlice.actions;

export default searchSlice.reducer;
