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
  },
});

export const getClassOVReducer = (state: any): ClassOverviewType[] =>
  state.classOV;
export const { setClassOverview } = classOverviewSlice.actions;
export const classOVReducer = classOverviewSlice.reducer;
