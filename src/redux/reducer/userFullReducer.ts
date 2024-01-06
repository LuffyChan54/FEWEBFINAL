import { createSlice } from "@reduxjs/toolkit";
import { UserFullType, initUserFullType } from "types/index";

const userFullSlice = createSlice({
  name: "userfull",
  initialState: initUserFullType,
  reducers: {
    setFullUser: (state, action) => {
      const fullUserInfo = action.payload;
      return {
        ...state,
        ...fullUserInfo,
      };
    },
  },
});

export const getUserFull = (state: any): UserFullType => state.userfull;
export const { setFullUser } = userFullSlice.actions;
export const userFullReducer = userFullSlice.reducer;
