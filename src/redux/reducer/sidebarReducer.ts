import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  idTabActive: "home",
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: defaultState,
  reducers: {
    setTabActive: (_, action) => {
      const idTabActive = action.payload;
      return {
        idTabActive,
      };
    },
  },
});

export const getSidebarReducer = (state: any) => state.sidebar.idTabActive;
export const { setTabActive } = sidebarSlice.actions;

export const sidebarReducer = sidebarSlice.reducer;
