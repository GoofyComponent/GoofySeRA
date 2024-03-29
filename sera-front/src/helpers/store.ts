import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import appReducer from "./slices/AppSlice";
import userReducer from "./slices/UserSlice";
import videoReviewReducer from "./slices/VideoReviewSlice";

const persistConfig = {
  key: "root",
  storage,
};

const reducers = combineReducers({
  app: appReducer,
  user: userReducer,
  videoReview: videoReviewReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
