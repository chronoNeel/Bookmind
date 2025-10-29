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
    bookAuthor: "",
    bookCoverUrl: "",
    bookPublishYear: "",
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

export const createJournalEntry = createAsyncThunk<
  Journal,
  JournalEntry,
  { rejectValue: string }
>("journal/createJournalEntry", async (journalData, { rejectWithValue }) => {
  try {
    const res = await api.post<{
      status: string;
      journalId: string;
      journal: Journal;
    }>("/api/journals/", journalData);

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

// Fetch journal by ID
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

// Upvote journal
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

// Downvote journal
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

// updating journal
export const updateJournalEntry = createAsyncThunk<
  Journal,
  { id: string; data: Partial<JournalEntry> },
  { rejectValue: string }
>("journal/updateJournalEntry", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put<{
      status: string;
      journal: Journal;
    }>(`/api/journals/update/${id}`, data);

    return res.data.journal;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update journal entry";
    return rejectWithValue(message);
  }
});

export const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    clearJournalError: (state) => {
      state.error = null;
    },
    clearCurrentJournal: (state) => {
      state.currentJournal = {
        id: "",
        userId: "",
        bookKey: "",
        bookTitle: "",
        bookAuthor: "",
        bookCoverUrl: "",
        bookPublishYear: "",
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
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create journal
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
          action.payload ??
          action.error.message ??
          "Failed to create journal entry";
      })

      // Fetch public journals
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
          action.payload ??
          action.error.message ??
          "Failed to fetch public journals";
      })

      // Fetch single journal
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

      // Upvote journal
      .addCase(upvoteJournal.fulfilled, (state, action) => {
        const { journalId } = action.payload;
        const updateVote = (journal: Journal) => {
          const userId = localStorage.getItem("uid"); // current logged user id
          if (!userId) return;

          const hasUpvoted = journal.upvotedBy.includes(userId);
          const hasDownvoted = journal.downvotedBy.includes(userId);

          if (hasUpvoted) {
            // remove upvote
            journal.upvotedBy = journal.upvotedBy.filter((id) => id !== userId);
          } else {
            // add upvote, remove downvote if present
            journal.upvotedBy.push(userId);
            if (hasDownvoted) {
              journal.downvotedBy = journal.downvotedBy.filter(
                (id) => id !== userId
              );
            }
          }
        };

        [state.publicJournals, state.userJournals, state.entries].forEach(
          (list) => {
            const j = list.find((x) => x.id === journalId);
            if (j) updateVote(j);
          }
        );

        if (state.currentJournal?.id === journalId) {
          updateVote(state.currentJournal);
        }
      })
      .addCase(upvoteJournal.rejected, (state, action) => {
        state.error =
          action.payload ?? action.error.message ?? "Failed to upvote journal";
      })

      // Downvote journal
      .addCase(downvoteJournal.fulfilled, (state, action) => {
        const { journalId } = action.payload;
        const updateVote = (journal: Journal) => {
          const userId = localStorage.getItem("uid");
          if (!userId) return;

          const hasDownvoted = journal.downvotedBy.includes(userId);
          const hasUpvoted = journal.upvotedBy.includes(userId);

          if (hasDownvoted) {
            // remove downvote
            journal.downvotedBy = journal.downvotedBy.filter(
              (id) => id !== userId
            );
          } else {
            // add downvote, remove upvote if present
            journal.downvotedBy.push(userId);
            if (hasUpvoted) {
              journal.upvotedBy = journal.upvotedBy.filter(
                (id) => id !== userId
              );
            }
          }
        };

        [state.publicJournals, state.userJournals, state.entries].forEach(
          (list) => {
            const j = list.find((x) => x.id === journalId);
            if (j) updateVote(j);
          }
        );

        if (state.currentJournal?.id === journalId) {
          updateVote(state.currentJournal);
        }
      })
      .addCase(downvoteJournal.rejected, (state, action) => {
        state.error =
          action.payload ??
          action.error.message ??
          "Failed to downvote journal";
      })

      // update journal

      .addCase(updateJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateJournalEntry.fulfilled,
        (state, action: PayloadAction<Journal>) => {
          state.loading = false;
          const updatedJournal = action.payload;

          // Update in all lists
          [state.entries, state.userJournals, state.publicJournals].forEach(
            (list) => {
              const index = list.findIndex((j) => j.id === updatedJournal.id);
              if (index !== -1) {
                list[index] = updatedJournal;
              }
            }
          );

          // Update current journal if it's the same
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
      });
  },
});

export const { clearJournalError, clearCurrentJournal } = journalSlice.actions;
export default journalSlice.reducer;
