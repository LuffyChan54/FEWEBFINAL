import { createSlice } from "@reduxjs/toolkit";
import { ClassInfoType } from "types";

const defaultState: ClassInfoType[] = [
  {
    id: "idd",
    name: "string",
    desc: "desc",
    host_name: "host",
    code: "code",
  },
];

const classSlice = createSlice({
  name: "class",
  initialState: defaultState,
  reducers: {
    setClasses: (_, action) => {
      return [...action.payload];
    },
    addOneClass: (state, action) => {
      return [...state, action.payload];
    },
    removeOneClass: (state, action) => {
      const idClassRemoved = action.payload;
      const newClasses = state.filter((el) => el.id != idClassRemoved);
      return newClasses;
    },
    updateOneClass: (state, action) => {
      const classUpdated = action.payload;
      const newClasses = state.map((el) =>
        el.id == classUpdated.id ? classUpdated : el
      );
      return newClasses;
    },
  },
});

export const getClassReducer = (state: any): ClassInfoType[] => state.class;
export const { setClasses, addOneClass, removeOneClass, updateOneClass } =
  classSlice.actions;
export const classReducer = classSlice.reducer;
