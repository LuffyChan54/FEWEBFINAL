import { configureStore } from "@reduxjs/toolkit";
import {
  authReducer,
  classOVReducer,
  classReducer,
  sidebarReducer,
  userFullReducer,
} from "./reducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classOV: classOVReducer,
    class: classReducer,
    sidebar: sidebarReducer,
    userfull: userFullReducer,
  },
});
