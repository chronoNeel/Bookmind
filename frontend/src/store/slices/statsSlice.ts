// src/store/stats/statsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";

export interface StatsState {
  avgRating: number;
  booksReadThisYear: string[];
  completedCount: number;
  ongoingCount: number;
  totalJournals: number;
  wantToReadCount: number;
  yearlyGoal: number;
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  avgRating: 0,
  booksReadThisYear: [],
  completedCount: 0,
  ongoingCount: 0,
  totalJournals: 0,
  wantToReadCount: 0,
  yearlyGoal: 0,
  loading: false,
  error: null,
};

// Helper types for safe error narrowing
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

export const updateYearlyGoal = createAsyncThunk<
  { yearlyGoal: number },
  { yearlyGoal: number },
  { rejectValue: { message: string; code?: string } }
>("stats/updateYearlyGoal", async ({ yearlyGoal }, { rejectWithValue }) => {
  try {
    console.log(yearlyGoal);
    await api.put("/api/users/yearly-goal", { yearlyGoal });
    return { yearlyGoal };
  } catch (err: unknown) {
    if (isApiErrorShape(err)) {
      return rejectWithValue({
        message:
          err.response?.data?.error || err.message || "Failed to set goal",
        code: err.response?.status === 401 ? "AUTH_REQUIRED" : undefined,
      });
    }

    return rejectWithValue({
      message: "Failed to set goal",
    });
  }
});

export const updateFavoriteBooks = createAsyncThunk<
  { bookKey: string; favorites: string[] },
  { bookKey: string },
  { rejectValue: { message: string; code?: string } }
>("profile/updateFavoriteBooks", async ({ bookKey }, { rejectWithValue }) => {
  try {
    const response = await api.put("/api/users/favorite-books", { bookKey });
    return {
      bookKey,
      favorites: response.data.favorites as string[],
    };
  } catch (err: unknown) {
    if (isApiErrorShape(err)) {
      return rejectWithValue({
        message:
          err.response?.data?.error ||
          err.message ||
          "Failed to update favorite books",
        code: err.response?.status === 401 ? "AUTH_REQUIRED" : undefined,
      });
    }

    return rejectWithValue({
      message: "Failed to update favorite books",
    });
  }
});

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<Partial<StatsState>>) => {
      Object.assign(state, action.payload);
    },
    resetStats: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateYearlyGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateYearlyGoal.fulfilled, (state, action) => {
        state.yearlyGoal = action.payload.yearlyGoal;
        state.loading = false;
      })
      .addCase(updateYearlyGoal.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ??
          action.error.message ??
          "Failed to update goal";
      });
  },
});

export const { setStats, resetStats } = statsSlice.actions;
export default statsSlice.reducer;
