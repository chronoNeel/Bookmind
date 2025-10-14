import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore, // creates persistor object to manage the persistance of the Redux store
  persistReducer, // it ensures that the state managed by the reducer is saved and loaded from the store according to the persistConfig
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import journalSlice from "./slices/journalSlice";
import bookSlice from "./slices/bookSlice";
import genreBookSlice from "./slices/genreBookSlice";
import shelfSlice from "./slices/shelfSlice";
import authSlice from "./slices/authSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["journal", "shelf"], // Persist journal and shelf slices
  blacklist: ["auth"],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  journal: journalSlice,
  books: bookSlice,
  genreBooks: genreBookSlice,
  shelf: shelfSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "auth/setUser",
        ], // ignored because they may contain non serializable data
        // firebase user object ignored
        ignoredPaths: ["auth.user"],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
