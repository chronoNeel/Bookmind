import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

import journalSlice from "./slices/journalSlice";
import genreBookSlice from "./slices/genreBookSlice";
import shelfSlice from "./slices/shelfSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import statSlice from "./slices/statsSlice";
import searchSlice from "./slices/searchSlice";
import activitySlice from "./slices/activitySlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  journal: journalSlice,
  search: searchSlice,
  genreBooks: genreBookSlice,
  shelf: shelfSlice,
  stats: statSlice,
  activity: activitySlice,
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
