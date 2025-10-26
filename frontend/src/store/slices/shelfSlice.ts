import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export type ShelfStatus =
  | "wantToRead"
  | "ongoing"
  | "completed"
  | "remove"
  | null;
type ShelfKey = "completed" | "ongoing" | "wantToRead";

export interface ShelfState {
  completed: string[];
  ongoing: string[];
  wantToRead: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ShelfState = {
  completed: [],
  ongoing: [],
  wantToRead: [],
  loading: false,
  error: null,
};

interface ApiErrorShape {
  response?: {
    data?: {
      error?: string;
    };
    status?: number;
  };
  message?: string;
}
function isApiErrorShape(err: unknown): err is ApiErrorShape {
  return typeof err === "object" && err !== null;
}

export const setBookStatus = createAsyncThunk<
  void,
  { bookKey: string; status: ShelfStatus }, // args to dispatch
  { rejectValue: { message: string; code?: string } } // rejected payload type
>("shelf/setBookStatus", async ({ bookKey, status }, { rejectWithValue }) => {
  try {
    await api.post("/api/shelves/set-status", {
      bookKey,
      status: status ?? "remove",
    });
  } catch (err: unknown) {
    if (isApiErrorShape(err)) {
      return rejectWithValue({
        message:
          err.response?.data?.error ||
          err.message ||
          "Failed to set book status",
        code: err.response?.status === 401 ? "AUTH_REQUIRED" : undefined,
      });
    }

    return rejectWithValue({
      message: "Failed to set book status",
    });
  }
});

const shelfSlice = createSlice({
  name: "shelf",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setBookStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setBookStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { bookKey, status } = action.meta.arg;

        // remove book from all shelves first
        state.completed = state.completed.filter((k) => k !== bookKey);
        state.ongoing = state.ongoing.filter((k) => k !== bookKey);
        state.wantToRead = state.wantToRead.filter((k) => k !== bookKey);

        // figure out which shelf to add back to
        const target: ShelfKey | null =
          status && status !== "remove" ? (status as ShelfKey) : null;

        if (target) {
          (state[target] as string[]).push(bookKey);
        }
      })
      .addCase(setBookStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to set book status";
      });
  },
});

export default shelfSlice.reducer;
