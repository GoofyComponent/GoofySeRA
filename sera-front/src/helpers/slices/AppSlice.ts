import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPreviouslyLoggedIn: false,
  appError: null,
  lastSeenProjectId: null,
  lastSeenProjectName: null,
};

export const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    registerLogin: (state) => {
      state.isPreviouslyLoggedIn = true;
    },
    setAppError: (state, action) => {
      state.appError = action.payload;
    },
    setLastSeenProjectId: (state, action) => {
      state.lastSeenProjectId = action.payload;
    },
    setLastSeenProjectName: (state, action) => {
      state.lastSeenProjectName = action.payload;
    },
    reset: () => {
      return initialState;
    },
  },
});

export const {
  registerLogin,
  setAppError,
  reset,
  setLastSeenProjectId,
  setLastSeenProjectName,
} = AppSlice.actions;

export default AppSlice.reducer;
