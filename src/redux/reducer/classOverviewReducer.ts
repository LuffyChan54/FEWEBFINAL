import { createSlice } from "@reduxjs/toolkit";
import { ClassOverviewType } from "types";
const defaultState: ClassOverviewType[] = [
  {
    id: "teaching_1",
    name: "class 1",
    host_name: "host 1",
    desc: "desc1",
    role: "teaching",
  },
  {
    id: "teaching_3",
    name: "class 3",
    host_name: "host 3",
    desc: "desc3",
    role: "teaching",
  },
  {
    id: "teaching_2",
    name: "class 2",
    host_name: "host 2",
    desc: "desc2",
    role: "learning",
  },
];

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
