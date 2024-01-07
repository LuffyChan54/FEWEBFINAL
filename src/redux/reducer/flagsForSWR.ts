import { createSlice } from "@reduxjs/toolkit";

const initValue = {
  isLeaveCourseDirectly: {
    flag: false,
    values: {
      idCourse: "",
    },
  },
};

const flagsForSWRSlice = createSlice({
  name: "flags",
  initialState: initValue,
  reducers: {
    setFlags: (state, action) => {
      const newData = action.payload;
      return { ...state, ...newData };
    },
  },
});

export const getFlags = (state: any) => state.flags;
export const { setFlags } = flagsForSWRSlice.actions;
export const flagsForSWRReducer = flagsForSWRSlice.reducer;
