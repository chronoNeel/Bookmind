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
import searchSlice from "./slices/searchSlice";
import genreBookSlice from "./slices/genreBookSlice";
import shelfSlice from "./slices/shelfSlice";
import authSlice from "./slices/authSlice";
import statSlice from "./slices/statsSlice";

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
  searchBooks: searchSlice,
  genreBooks: genreBookSlice,
  shelf: shelfSlice,
  stats: statSlice,
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
