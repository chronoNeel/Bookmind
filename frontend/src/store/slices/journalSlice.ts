import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import JournalEntry from "@models/JournalEntry";
import { Journal } from "@models/journal";

type JournalState = {
  loading: boolean;
  error: string | null;
  entries: Journal[];
  publicJournals: Journal[];
  userJournals: Journal[];
  currentJournal: Journal;
};

const initialState: JournalState = {
  loading: false,
  error: null,
  entries: [],
  publicJournals: [],
  userJournals: [],
  currentJournal: {
    id: "",
    userId: "",
    bookKey: "",
    bookTitle: "",
    bookAuthorList: [],
    bookCoverUrl: "",
    rating: 0,
    readingProgress: 0,
    isPrivate: false,
    mood: "",
    promptResponses: {},
    entry: "",
    upvotedBy: [],
    downvotedBy: [],
    createdAt: "",
    updatedAt: "",
  },
};

// ---------------------- ASYNC THUNKS ----------------------

// Create journal entry
export const createJournalEntry = createAsyncThunk<
  Journal,
  JournalEntry,
  { rejectValue: string }
>("journal/createJournalEntry", async (journalData, { rejectWithValue }) => {
  try {
    const res = await api.post<{ status: string; journal: Journal }>(
      "/api/journals/",
      journalData
    );
    return res.data.journal;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create journal entry";
    return rejectWithValue(message);
  }
});

// Fetch all public journals
export const fetchPublicJournals = createAsyncThunk<
  Journal[],
  void,
  { rejectValue: string }
>("journal/fetchPublicJournals", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<{ status: string; journals: Journal[] }>(
      "/api/journals/public"
    );
    return res.data.journals;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch public journals";
    return rejectWithValue(message);
  }
});

// Fetch single journal by ID
export const fetchJournalById = createAsyncThunk<
  Journal,
  string,
  { rejectValue: string }
>("journal/fetchJournalById", async (journalId, { rejectWithValue }) => {
  try {
    const res = await api.get<{ status: string; journal: Journal }>(
      `/api/journals/${journalId}`
    );
    return res.data.journal;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch journal";
    return rejectWithValue(message);
  }
});

// Upvote journal - simplified to just call the API
export const upvoteJournal = createAsyncThunk<
  { journalId: string; message: string },
  string,
  { rejectValue: string }
>("journal/upvoteJournal", async (journalId, { rejectWithValue }) => {
  try {
    const res = await api.get<{ status: string; message: string }>(
      `/api/journals/upvote/${journalId}`
    );
    return { journalId, message: res.data.message };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to upvote journal";
    return rejectWithValue(message);
  }
});

// Downvote journal - simplified to just call the API
export const downvoteJournal = createAsyncThunk<
  { journalId: string; message: string },
  string,
  { rejectValue: string }
>("journal/downvoteJournal", async (journalId, { rejectWithValue }) => {
  try {
    const res = await api.get<{ status: string; message: string }>(
      `/api/journals/downvote/${journalId}`
    );
    return { journalId, message: res.data.message };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to downvote journal";
    return rejectWithValue(message);
  }
});

// Update journal
export const updateJournalEntry = createAsyncThunk<
  Journal,
  { id: string; data: Partial<JournalEntry> },
  { rejectValue: string }
>("journal/updateJournalEntry", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put<{ status: string; journal: Journal }>(
      `/api/journals/update/${id}`,
      data
    );
    return res.data.journal;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update journal entry";
    return rejectWithValue(message);
  }
});

// Delete journal by ID
export const deleteJournalById = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("journal/deleteJournalById", async (journalId, { rejectWithValue }) => {
  try {
    await api.delete<{ status: string; message: string }>(
      `/api/journals/${journalId}`
    );
    return journalId;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete journal";
    return rejectWithValue(message);
  }
});

// ---------------------- SLICE ----------------------

export const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    clearJournalError: (state) => {
      state.error = null;
    },
    clearCurrentJournal: (state) => {
      state.currentJournal = initialState.currentJournal;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createJournalEntry.fulfilled,
        (state, action: PayloadAction<Journal>) => {
          state.loading = false;
          state.entries.unshift(action.payload);
          state.userJournals.unshift(action.payload);
        }
      )
      .addCase(createJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to create journal";
      })

      // Fetch public
      .addCase(fetchPublicJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPublicJournals.fulfilled,
        (state, action: PayloadAction<Journal[]>) => {
          state.loading = false;
          state.publicJournals = action.payload;
        }
      )
      .addCase(fetchPublicJournals.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch journals";
      })

      // Fetch single
      .addCase(fetchJournalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchJournalById.fulfilled,
        (state, action: PayloadAction<Journal>) => {
          state.loading = false;
          state.currentJournal = action.payload;
        }
      )
      .addCase(fetchJournalById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch journal";
      })

      // Upvote - no state updates, handled by optimistic UI
      .addCase(upvoteJournal.rejected, (state, action) => {
        state.error =
          action.payload ?? action.error.message ?? "Failed to upvote journal";
      })

      // Downvote - no state updates, handled by optimistic UI
      .addCase(downvoteJournal.rejected, (state, action) => {
        state.error =
          action.payload ??
          action.error.message ??
          "Failed to downvote journal";
      })

      // Update
      .addCase(updateJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateJournalEntry.fulfilled,
        (state, action: PayloadAction<Journal>) => {
          state.loading = false;
          const updatedJournal = action.payload;

          [state.entries, state.userJournals, state.publicJournals].forEach(
            (list) => {
              const index = list.findIndex((j) => j.id === updatedJournal.id);
              if (index !== -1) list[index] = updatedJournal;
            }
          );

          if (state.currentJournal?.id === updatedJournal.id) {
            state.currentJournal = updatedJournal;
          }
        }
      )
      .addCase(updateJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ??
          action.error.message ??
          "Failed to update journal entry";
      })

      // Delete
      .addCase(deleteJournalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJournalById.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;

        [state.entries, state.userJournals, state.publicJournals].forEach(
          (list) => {
            const index = list.findIndex((j) => j.id === deletedId);
            if (index !== -1) list.splice(index, 1);
          }
        );

        if (state.currentJournal?.id === deletedId) {
          state.currentJournal = initialState.currentJournal;
        }
      })
      .addCase(deleteJournalById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to delete journal";
      });
  },
});

export const { clearJournalError, clearCurrentJournal } = journalSlice.actions;

export default journalSlice.reducer;
