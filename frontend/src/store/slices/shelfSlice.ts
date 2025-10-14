import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShelfState {
  completed: string[];
  ongoing: string[];
  wantToRead: string[];
}

const initialState: ShelfState = {
  completed: [],
  ongoing: [],
  wantToRead: [],
};

const shelfSlice = createSlice({
  name: "shelf",
  initialState,
  reducers: {
    addBookToShelf: (
      state,
      action: PayloadAction<{
        shelf: "completed" | "ongoing" | "wantToRead";
        bookKey: string;
      }>
    ) => {
      const { shelf, bookKey } = action.payload;

      // Remove book from all shelves first
      Object.keys(state).forEach((key) => {
        state[key as keyof ShelfState] = state[key as keyof ShelfState].filter(
          (k) => k !== bookKey
        );
      });

      // Add book to the specified shelf if not already there
      if (!state[shelf].includes(bookKey)) {
        state[shelf].push(bookKey);
      }
    },

    removeBookFromShelf: (state, action: PayloadAction<string>) => {
      const bookKey = action.payload;
      Object.keys(state).forEach((key) => {
        state[key as keyof ShelfState] = state[key as keyof ShelfState].filter(
          (k) => k !== bookKey
        );
      });
    },

    clearShelves: () => initialState,
  },
});

export const { addBookToShelf, clearShelves, removeBookFromShelf } =
  shelfSlice.actions;
export default shelfSlice.reducer;
