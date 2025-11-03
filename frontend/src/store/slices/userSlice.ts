import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { UserData } from "@models/user";
import { loginUser, logoutUser } from "../slices/authSlice"; // 👈 import thunks

// -----------------------------
// Helpers
// -----------------------------
interface ApiErrorShape {
  response?: {
    data?: { error?: string };
    status?: number;
  };
  message?: string;
}

function isApiErrorShape(err: unknown): err is ApiErrorShape {
  return typeof err === "object" && err !== null;
}

// -----------------------------
// Thunks
// -----------------------------
export const fetchUserProfile = createAsyncThunk<
  UserData,
  string,
  { rejectValue: string }
>("user/fetchProfile", async (userName, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/users/${userName}`);
    // if API returns { user: {...} }
    return response.data.user ?? (response.data as UserData);
  } catch (error: unknown) {
    if (isApiErrorShape(error)) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.message ||
          "Failed to fetch user profile"
      );
    }
    return rejectWithValue("Failed to fetch user profile");
  }
});

export const checkUsernameAvailability = createAsyncThunk<
  { available: boolean; username: string },
  string,
  { rejectValue: string }
>("user/checkUsername", async (username, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/users/check-username/${username}`);
    return response.data;
  } catch (error: unknown) {
    if (isApiErrorShape(error)) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.message ||
          "Failed to check username"
      );
    }
    return rejectWithValue("Failed to check username");
  }
});

export const fetchNameByUid = createAsyncThunk<
  UserData,
  string,
  { rejectValue: string }
>("user/fetchNameByUid", async (uid, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/users/userId/${uid}`);
    return response.data.user as UserData;
  } catch (error: unknown) {
    if (isApiErrorShape(error)) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.message ||
          "Failed to fetch username"
      );
    }
    return rejectWithValue("Failed to fetch username");
  }
});

// -----------------------------
// State + Slice
// -----------------------------
interface UserState {
  profile: UserData | null;
  loading: boolean;
  error: string | null;
  usernameCheck: {
    checking: boolean;
    available: boolean | null;
    error: string | null;
  };
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
  usernameCheck: {
    checking: false,
    available: null,
    error: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserProfile: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    resetUsernameCheck: (state) => {
      state.usernameCheck = {
        checking: false,
        available: null,
        error: null,
      };
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // -----------------------------
      // Handle our own thunks
      // -----------------------------
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch profile";
      })

      .addCase(checkUsernameAvailability.pending, (state) => {
        state.usernameCheck.checking = true;
        state.usernameCheck.error = null;
      })
      .addCase(checkUsernameAvailability.fulfilled, (state, action) => {
        state.usernameCheck.checking = false;
        state.usernameCheck.available = action.payload.available;
      })
      .addCase(checkUsernameAvailability.rejected, (state, action) => {
        state.usernameCheck.checking = false;
        state.usernameCheck.error =
          action.payload ?? "Failed to check username";
      })

      .addCase(fetchNameByUid.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      // -----------------------------
      // React to authSlice actions 👇
      // -----------------------------
      .addCase(loginUser.fulfilled, (state, action) => {
        // Only set profile if it’s currently null or incomplete
        if (!state.profile || !state.profile.uid) {
          state.profile = action.payload;
        } else {
          // merge updated fields without removing shelves/stats
          state.profile = { ...state.profile, ...action.payload };
        }
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // When user logs out, clear profile
        state.profile = null;
        state.error = null;
      });
  },
});

export const { updateUserProfile, resetUsernameCheck, clearUserProfile } =
  userSlice.actions;

export default userSlice.reducer;
