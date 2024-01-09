import { createSlice } from "@reduxjs/toolkit";

const hashInfoSlice = createSlice({
  name: "hashinfo",
  initialState: "overview",
  reducers: {
    setHashInfo: (state, action) => {
      return action.payload;
    },
  },
});

export const getHashInfo = (state: any) => state.hashinfo;
export const { setHashInfo } = hashInfoSlice.actions;
export const hashInfoReducer = hashInfoSlice.reducer;
