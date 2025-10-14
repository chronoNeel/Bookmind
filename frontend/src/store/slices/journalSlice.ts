import {
  createSlice,
  current,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import { Book } from "../../types/Book";
import JournalEntry from "../../types/JournalEntry";

interface JournalState {
  entriesByBook: {
    [bookKey: string]: JournalEntry[];
  };
}

const initialState: JournalState = {
  entriesByBook: {},
};

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    addJournal(
      state,
      action: PayloadAction<{
        book: Book;
        rating?: number;
        readingProgress?: number;
        isPrivate: boolean;
        mood: string;
        promptResponses: { [key: string]: string };
        entry: string;
      }>
    ) {
      const {
        book,
        rating,
        isPrivate,
        readingProgress,
        mood,
        promptResponses,
        entry,
      } = action.payload;

      const newEntry: JournalEntry = {
        id: `${book.key}-${Date.now()}`,
        book,
        rating,
        isPrivate,
        mood,
        readingProgress,
        promptResponses: promptResponses || {},
        entry,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
      };

      if (!state.entriesByBook[book.key]) {
        state.entriesByBook[book.key] = [];
      }

      state.entriesByBook[book.key].push(newEntry);

      console.log(current(state));
    },

    updateJournal(
      state,
      action: PayloadAction<{
        bookKey: string;
        entryId: string;
        updates: Partial<Omit<JournalEntry, "id" | "book" | "createdAt">>;
      }>
    ) {
      const { bookKey, entryId, updates } = action.payload;

      if (state.entriesByBook[bookKey]) {
        const entryIndex = state.entriesByBook[bookKey].findIndex(
          (entry) => entry.id === entryId
        );

        if (entryIndex !== -1) {
          state.entriesByBook[bookKey][entryIndex] = {
            ...state.entriesByBook[bookKey][entryIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
      }
    },

    removeJournal(
      state,
      action: PayloadAction<{ bookKey: string; entryId: string }>
    ) {
      const { bookKey, entryId } = action.payload;

      if (state.entriesByBook[bookKey]) {
        state.entriesByBook[bookKey] = state.entriesByBook[bookKey].filter(
          (entry) => entry.id !== entryId
        );

        // If no journals left for this book, optionally clean up
        if (state.entriesByBook[bookKey].length === 0) {
          delete state.entriesByBook[bookKey];
        }
      }
    },

    toggleJournalPrivacy(
      state,
      action: PayloadAction<{ bookKey: string; entryId: string }>
    ) {
      const { bookKey, entryId } = action.payload;

      if (state.entriesByBook[bookKey]) {
        const entry = state.entriesByBook[bookKey].find(
          (entry) => entry.id === entryId
        );

        if (entry) {
          entry.isPrivate = !entry.isPrivate;
          entry.updatedAt = new Date().toISOString();
        }
      }
    },
  },
});

// Base selector
const selectJournalState = (state: { journal: JournalState }) => state.journal;

// Memoized selectors using createSelector
export const selectJournalsByBook = createSelector(
  [selectJournalState, (_, bookKey: string) => bookKey],
  (journalState, bookKey) => journalState.entriesByBook[bookKey] || []
);

export const selectAllJournals = createSelector(
  [selectJournalState],
  (journalState) => Object.values(journalState.entriesByBook).flat()
);

export const selectPublicJournals = createSelector(
  [selectAllJournals],
  (allJournals) => allJournals.filter((entry) => !entry.isPrivate)
);

export const selectJournalsByMood = createSelector(
  [selectAllJournals, (_, mood: string) => mood],
  (allJournals, mood) => allJournals.filter((entry) => entry.mood === mood)
);

export const selectJournalById = createSelector(
  [
    selectJournalState,
    (_, bookKey: string) => bookKey,
    (_, __, entryId: string) => entryId,
  ],
  (journalState, bookKey, entryId) => {
    const bookJournals = journalState.entriesByBook[bookKey];
    return bookJournals?.find((entry) => entry.id === entryId);
  }
);

export const selectJournalCountByBook = createSelector(
  [selectJournalsByBook],
  (journals) => journals.length
);

export const {
  addJournal,
  updateJournal,
  removeJournal,
  toggleJournalPrivacy,
} = journalSlice.actions;

export default journalSlice.reducer;
