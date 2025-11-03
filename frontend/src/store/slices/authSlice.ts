import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import api from "../../utils/api";
import { AuthState, UserData } from "@models/user";

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

export const logoutUser = createAsyncThunk<void>(
  "auth/logout",
  async () => await signOut(auth)
);

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

const initialState: AuthState = {
  user: emptyUser,
  loading: false,
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
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload ?? "Registration failed";
      })

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
        state.error = action.payload ?? "Login failed";
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = emptyUser;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { setUser, setLoading, clearError } = authSlice.actions;
export default authSlice.reducer;
