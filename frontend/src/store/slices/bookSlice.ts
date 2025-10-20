// store/slices/booksSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookData {
  title: string;
  author: string;
  coverUrl: string;
  bookKey: string;
  fetchedAt: number;
}

interface BooksState {
  cache: Record<string, BookData>;
}

const initialState: BooksState = {
  cache: {},
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    cacheBook: (state, action: PayloadAction<BookData>) => {
      state.cache[action.payload.bookKey] = action.payload;
    },
    clearCache: (state) => {
      state.cache = {};
    },
    removeStaleBooks: (state, action: PayloadAction<number>) => {
      const maxAge = action.payload; // in milliseconds
      const now = Date.now();

      Object.keys(state.cache).forEach((key) => {
        if (now - state.cache[key].fetchedAt > maxAge) {
          delete state.cache[key];
        }
      });
    },
  },
});

export const { cacheBook, clearCache, removeStaleBooks } = booksSlice.actions;
export default booksSlice.reducer;
