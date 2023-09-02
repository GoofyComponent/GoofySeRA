import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPreviouslyLoggedIn: false,
  appError: null,
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
    reset: () => {
      return initialState;
    },
  },
});

export const { registerLogin, setAppError, reset } = AppSlice.actions;

export default AppSlice.reducer;
