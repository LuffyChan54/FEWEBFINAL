import { createSlice } from "@reduxjs/toolkit";
import { ClassOverviewType } from "types";
const defaultState: ClassOverviewType[] = [];

const classOverviewSlice = createSlice({
  name: "classOverview",
  initialState: defaultState,
  reducers: {
    setClassOverview: (_, action) => {
      return [...action.payload];
    },
    removeClassOV: (state, action) => {
      const id = action.payload.id;
      const newState = state.filter((classOV) => classOV.id != id);
      return [...newState];
    },
  },
});

export const getClassOVReducer = (state: any): ClassOverviewType[] =>
  state.classOV;
export const { setClassOverview, removeClassOV } = classOverviewSlice.actions;
export const classOVReducer = classOverviewSlice.reducer;
