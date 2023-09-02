import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPreviouslyLoggedIn: false,
  appError: null,
  lastSeenProjectId: null,
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
    reset: () => {
      return initialState;
    },
  },
});

export const { registerLogin, setAppError, reset, setLastSeenProjectId } =
  AppSlice.actions;
export default AppSlice.reducer;
