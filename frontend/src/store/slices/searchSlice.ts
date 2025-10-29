import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Book } from "@models/Book";
import { fetchBooks } from "../../api/bookApi";
import api from "../../utils/api";
import { UserData } from "@models/user";

interface SearchState {
  searchResults: Book[];
  userSearchResults: UserData[];
  isLoading: boolean;
  isLoadingUsers: boolean;
  error: string | null;
  userError: string | null;
}

const initialState: SearchState = {
  searchResults: [],
  userSearchResults: [],
  isLoading: false,
  isLoadingUsers: false,
  error: null,
  userError: null,
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

export const searchUsers = createAsyncThunk(
  "books/searchUsers",
  async (searchQuery: string, { rejectWithValue }) => {
    if (!searchQuery.trim()) {
      return [];
    }

    try {
      const result = await api.get(`/api/users/search`, {
        params: { q: searchQuery },
      });

      return result.data.users;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error searching users";
      return rejectWithValue(message);
    }
  }
);

const searchSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.error = null;
    },
    clearUserSearchResults: (state) => {
      state.userSearchResults = [];
      state.userError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUserError: (state) => {
      state.userError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // searchBooks cases
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
      })
      // searchUsers cases
      .addCase(searchUsers.pending, (state) => {
        state.isLoadingUsers = true;
        state.userError = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoadingUsers = false;
        state.userError = null;
        state.userSearchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.userError = action.payload as string;
        state.userSearchResults = [];
      });
  },
});

export const {
  clearSearchResults,
  clearUserSearchResults,
  clearError,
  clearUserError,
} = searchSlice.actions;

export default searchSlice.reducer;
