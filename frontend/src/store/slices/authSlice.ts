import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import api from "../../utils/api";
import { AuthState, UserData } from "@models/user";

// ---------------------------
// Types
// ---------------------------
interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

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

// thunks

// check username availability

export const checkUsernameAvailability = createAsyncThunk<
  { available: boolean; username: string },
  string,
  { rejectValue: string }
>("auth/checkUsername", async (username, { rejectWithValue }) => {
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

// register user

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
      return response.data.user as UserData;
    } catch (error: unknown) {
      if (isApiErrorShape(error)) {
        return rejectWithValue(error.message || "Failed to register user");
      }
      return rejectWithValue("Failed to register user");
    }
  }
);

// login user

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

    const userProfile = await api.get(`/api/users/${user.uid}`);
    return userProfile.data as UserData;
  } catch (error: unknown) {
    if (isApiErrorShape(error)) {
      return rejectWithValue(error.message || "Failed to login");
    }
    return rejectWithValue("Failed to login");
  }
});

// fetch user profile using username

export const fetchUserProfile = createAsyncThunk<
  UserData,
  string,
  { rejectValue: string }
>("auth/fetchProfile", async (userName, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/users/${userName}`);
    return response.data as UserData;
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

// log out user

export const logoutUser = createAsyncThunk<void>("auth/logout", async () => {
  await signOut(auth);
});

// fetchh name by id
export const fetchNameByUid = createAsyncThunk<
  UserData,
  string,
  { rejectValue: string }
>("user/fetchUsernameByUid", async (uid, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/users/userId/${uid}`);
    const user = response.data.user as UserData;

    return user;
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

export const emptyUser: UserData = {
  uid: "",
  email: "",
  fullName: "",
  userName: "",
  bio: "",
  profilePic: "",
  followers: [],
  following: [],
  favorites: [],
  shelves: {
    completed: [],
    ongoing: [],
    wantToRead: [],
  },
  stats: {
    completedCount: 0,
    ongoingCount: 0,
    wantToReadCount: 0,
    yearlyGoal: 0,
    booksReadThisYear: [],
    avgRating: 0,
    totalJournals: 0,
  },
  journals: [],
  createdAt: "",
};

// ---------------------------
// Initial state
// ---------------------------

const initialState: AuthState = {
  user: emptyUser,
  loading: true,
  error: null,
  isAuthenticated: false,
  usernameCheck: {
    checking: false,
    available: null,
    error: null,
  },
};

// ---------------------------
// Slice
// ---------------------------

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.user = action.payload ?? emptyUser;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserData>>) => {
      state.user = { ...state.user, ...action.payload };
    },
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
      // --- Register ---
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

      // --- Login ---
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

      // --- Fetch profile ---
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

      // --- Logout ---
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = emptyUser;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // --- Username check ---
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

// ---------------------------
// Exports
// ---------------------------

export const {
  setUser,
  setLoading,
  clearError,
  updateUserProfile,
  resetUsernameCheck,
} = authSlice.actions;

export default authSlice.reducer;
