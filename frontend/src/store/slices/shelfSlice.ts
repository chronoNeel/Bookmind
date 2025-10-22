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
  } catch (err: any) {
    return rejectWithValue({
      message:
        err?.response?.data?.error ||
        err.message ||
        "Failed to set book status",
      code: err?.response?.status === 401 ? "AUTH_REQUIRED" : undefined,
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

        state.completed = state.completed.filter((k) => k !== bookKey);
        state.ongoing = state.ongoing.filter((k) => k !== bookKey);
        state.wantToRead = state.wantToRead.filter((k) => k !== bookKey);

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

// // src/store/shelves/shelfSlice.ts
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import api from "../../utils/api";

// // local shelf shape
// export type ShelfStatus =
//   | "wantToRead"
//   | "ongoing"
//   | "completed"
//   | "remove"
//   | null;

// export interface ShelfState {
//   completed: string[];
//   ongoing: string[];
//   wantToRead: string[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ShelfState = {
//   completed: [],
//   ongoing: [],
//   wantToRead: [],
//   loading: false,
//   error: null,
// };

// export const setBookStatus = createAsyncThunk<
//   { bookKey: string; status: ShelfStatus },
//   { bookKey: string; status: ShelfStatus },
//   { rejectValue: { message: string; code?: string } }
// >("shelf/setBookStatus", async (payload, { rejectWithValue }) => {
//   const { bookKey, status } = payload;
//   console.log(bookKey, status);
//   try {
//     await api.post("/api/shelves/set-status", {
//       bookKey,
//       status: status ?? "remove",
//     });

//     return { bookKey, status };
//   } catch (err: any) {
//     return rejectWithValue({
//       message:
//         err?.response?.data?.error ||
//         err.message ||
//         "Failed to set book status",
//       code: err?.response?.status === 401 ? "AUTH_REQUIRED" : undefined,
//     });
//   }
// });

// const shelfSlice = createSlice({
//   name: "shelf",
//   initialState,
//   reducers: {
//     // optional: local-only optimistic update (no API)
//     setBookStatusLocal: (
//       state,
//       action: PayloadAction<{ bookKey: string; status: ShelfStatus }>
//     ) => {
//       const { bookKey, status } = action.payload;

//       state.completed = state.completed.filter((k) => k !== bookKey);
//       state.ongoing = state.ongoing.filter((k) => k !== bookKey);
//       state.wantToRead = state.wantToRead.filter((k) => k !== bookKey);

//       if (status && status !== "remove") {
//         state[status].push(bookKey);
//       }
//     },
//     resetShelvesLocal: () => initialState,
//   },
//   extraReducers: (builder) => {
//     // setBookStatus
//     builder
//       .addCase(setBookStatus.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(setBookStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         const { bookKey, status } = action.payload;
//         // remove from all
//         state.completed = state.completed.filter((k) => k !== bookKey);
//         state.ongoing = state.ongoing.filter((k) => k !== bookKey);
//         state.wantToRead = state.wantToRead.filter((k) => k !== bookKey);
//         // add if not removing
//         if (status && status !== "remove") {
//           state[status].push(bookKey);
//         }
//       })
//       .addCase(setBookStatus.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message ?? "Failed to set book status";
//       });
//   },
// });

// export const { setBookStatusLocal, resetShelvesLocal } = shelfSlice.actions;
// export default shelfSlice.reducer;
