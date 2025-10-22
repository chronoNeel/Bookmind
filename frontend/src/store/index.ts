import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import journalSlice from "./slices/journalSlice";
import searchSlice from "./slices/searchSlice";
import genreBookSlice from "./slices/genreBookSlice";
import shelfSlice from "./slices/shelfSlice";
import authSlice from "./slices/authSlice";
import statSlice from "./slices/statsSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  journal: journalSlice,
  searchBooks: searchSlice,
  genreBooks: genreBookSlice,
  shelf: shelfSlice,
  stats: statSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
