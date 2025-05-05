"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();
import authReducer from "@/store/authSlice";
import teamReducer, { TeamState } from "@/store/teamSlice";
import { User } from "@/types";
import { apiSlice } from "./apiSlice";
import themeReducer from "./themeSlice";

export interface RootState {
  auth: User;
  teams: TeamState;
  theme: { theme: "dark" | "light" | "system" };
  [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>;
}

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "teams"], // Only auth and teams will be persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  teams: teamReducer,
  theme: themeReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store: ReturnType<typeof makeStore> | undefined;

function makeStore() {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }).concat(apiSlice.middleware),
  });

  const persistor = persistStore(store);

  return { store, persistor };
}

export function getStoreInstance() {
  if (typeof window === "undefined") return makeStore();

  if (!store) store = makeStore();

  return store;
}

export const { store: reduxStore, persistor } = getStoreInstance();

export type AppDispatch = typeof reduxStore.dispatch;
