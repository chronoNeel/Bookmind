import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Book } from "../../types/Book";
import { fetchBooks } from "../../api/bookApi";

interface BookState {
  searchResults: Book[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookState = {
  searchResults: [],
  isLoading: false,
  error: null,
};

export const searchBooks = createAsyncThunk(
  "books/searchBooks",
  async (searchTerm: string, { rejectWithValue }) => {
    if (!searchTerm.trim()) {
      return [];
    }

    try {
      return await fetchBooks(searchTerm);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error fetching books";
      return rejectWithValue(message);
    }
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.error = null;
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
        state.searchResults = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.searchResults = [];
      });
  },
});

export const { clearSearchResults, clearError } = bookSlice.actions;

export default bookSlice.reducer;
