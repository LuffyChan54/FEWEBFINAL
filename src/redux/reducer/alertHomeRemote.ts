import { createSlice } from "@reduxjs/toolkit";

const alertHomeRemoteSlice = createSlice({
  name: "alerthome",
  initialState: {},
  reducers: {
    setAlert: (state, action) => {
      const newVal = action.payload;
      return newVal;
    },
  },
});

export const getAlertHome = (state: any) => state.alerthome;
export const { setAlert } = alertHomeRemoteSlice.actions;
export const alertHomeReducer = alertHomeRemoteSlice.reducer;
