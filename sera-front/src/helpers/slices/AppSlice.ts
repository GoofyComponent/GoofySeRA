import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPreviouslyLoggedIn: false,
};

export const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    registerLogin: (state) => {
      state.isPreviouslyLoggedIn = true;
    },
    reset: () => {
      return initialState;
    },
  },
});

export const { registerLogin, reset } = AppSlice.actions;

export default AppSlice.reducer;
