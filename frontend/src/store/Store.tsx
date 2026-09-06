import { configureStore, combineReducers } from "@reduxjs/toolkit";
import  userapi  from "./Userapi";
import   projectApi   from "./Projectapi";
import Userreducer from "./Userslice";
import ideslice from"./Projectslice"

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorageImport from "redux-persist/lib/storage/createWebStorage";

const createWebStorage =
  (createWebStorageImport as unknown as { default?: typeof createWebStorageImport })
    .default ?? createWebStorageImport;

const storage = createWebStorage("local");

const userPersistConfig = {
  key: "user",
  version: 1,
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, Userreducer);

const rootReducer = combineReducers({
  [userapi.reducerPath]: userapi.reducer,
  [projectApi.reducerPath]: projectApi.reducer,
  user: persistedUserReducer,
  ide:ideslice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(userapi.middleware,projectApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
