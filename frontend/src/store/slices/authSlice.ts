import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import api from "../../utils/api";
import { AuthState, UserData } from "../../models/user";

interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

// Check username availability
export const checkUsernameAvailability = createAsyncThunk<
  { available: boolean; username: string },
  string,
  { rejectValue: string }
>("auth/checkUsername", async (username, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/users/check-username/${username}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(
        error.response.data.error || "Failed to check username"
      );
    }
    return rejectWithValue(error.message || "Failed to check username");
  }
});

// Register user
export const registerUser = createAsyncThunk<
  UserData,
  RegisterPayload,
  { rejectValue: string }
>(
  "auth/register",
  async ({ email, password, fullName }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken(true);

      const response = await api.post("/api/auth/register", {
        fullName,
        token,
      });

      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Login user
export const loginUser = createAsyncThunk<
  UserData,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Fetch complete user profile from backend
    const userProfile = await api.get(`/api/users/${user.uid}`);

    return userProfile.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Fetch user profile (for app initialization)
export const fetchUserProfile = createAsyncThunk<
  UserData,
  string,
  { rejectValue: string }
>("auth/fetchProfile", async (userName, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/users/${userName}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(
        error.response.data.error || "Failed to fetch user profile"
      );
    }
    return rejectWithValue(error.message || "Failed to fetch user profile");
  }
});

// Logout user
export const logoutUser = createAsyncThunk<void>("auth/logout", async () => {
  await signOut(auth);
});

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  usernameCheck: {
    checking: false,
    available: null,
    error: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Update user profile locally (after API updates)
    updateUserProfile: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    // Reset username check state
    resetUsernameCheck: (state) => {
      state.usernameCheck = {
        checking: false,
        available: null,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch user profile";
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // Check Username
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
      });
  },
});

export const {
  setUser,
  setLoading,
  clearError,
  updateUserProfile,
  resetUsernameCheck,
} = authSlice.actions;
export default authSlice.reducer;
