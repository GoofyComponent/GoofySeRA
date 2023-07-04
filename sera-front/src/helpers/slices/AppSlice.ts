import { createSlice } from "@reduxjs/toolkit";

export const AppSlice = createSlice({
  name: "app",
  initialState: {},
  reducers: {
    custom: (state, action) => {
      return { state, action };
    },
  },
});

export const { custom } = AppSlice.actions;

export default AppSlice.reducer;
