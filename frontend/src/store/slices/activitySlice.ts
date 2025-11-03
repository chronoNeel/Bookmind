import { activity } from "@/models/activity";
import api from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ActivityState {
  activities: activity[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  activities: [],
  loading: false,
  error: null,
};

export const getAllActivites = createAsyncThunk<
  activity[],
  void,
  { rejectValue: string }
>("activity/getAllActivites", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<{ status: string; activities: activity[] }>(
      "/api/users/getAllActivities"
    );

    return res.data.activities;
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to fetch all users activities";
    return rejectWithValue(message);
  }
});

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearActivities: (state) => {
      state.activities = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllActivites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllActivites.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(getAllActivites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { clearError, clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
