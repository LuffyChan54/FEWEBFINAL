import { createSlice } from "@reduxjs/toolkit";
import {
  initStudentInfoType,
  StudentInfoType,
} from "types/user/StudentInfoType";

const studentInfoSlice = createSlice({
  name: "studentInfo",
  initialState: initStudentInfoType,
  reducers: {
    setStudentInfo: (state, action) => {
      const studentInfo = action.payload;
      return { ...state, ...studentInfo };
    },
  },
});

export const getStudentInfo = (state: any): StudentInfoType =>
  state.studentInfo;
export const { setStudentInfo } = studentInfoSlice.actions;
export const studentInfoReducer = studentInfoSlice.reducer;
