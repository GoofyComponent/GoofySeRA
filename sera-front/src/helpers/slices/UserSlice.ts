import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  infos: {},
};

export const UserSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateInfos: (state, action) => {
      state.infos = action.payload;
    },
    reset: () => {
      return initialState;
    },
  },
});

export const { updateInfos, reset } = UserSlice.actions;

export default UserSlice.reducer;
