import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGenreBooks } from "../../api/bookApi";
import { GenreBook } from "../../types/GenreBook";

// State interface
interface BookState {
  genres: Record<string, GenreBook[]>;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookState = {
  genres: {},
  isLoading: false,
  error: null,
};

export const getGenreBooks = createAsyncThunk(
  "books/getGenreBooks",
  async (genre: string, { rejectWithValue, getState }) => {
    try {
      const normalizedGenre = genre.toLowerCase();
      const state = getState() as { genreBooks: BookState };

      if (state.genreBooks.genres[normalizedGenre]?.length > 0) {
        return {
          genre: normalizedGenre,
          books: state.genreBooks.genres[normalizedGenre],
          fromCache: true,
        };
      }

      const data = await fetchGenreBooks(normalizedGenre);

      return { genre: normalizedGenre, books: data, fromCache: false };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error fetching genre books";
      return rejectWithValue(message);
    }
  }
);

// Slice
const genreBookSlice = createSlice({
  name: "genreBooks",
  initialState,
  reducers: {
    clearGenreData: (state) => {
      state.genres = {};
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGenreBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGenreBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        // Store with lowercase key
        state.genres[action.payload.genre.toLowerCase()] = action.payload.books;
      })
      .addCase(getGenreBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearGenreData, clearError } = genreBookSlice.actions;
export default genreBookSlice.reducer;
