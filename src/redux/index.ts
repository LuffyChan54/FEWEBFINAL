import { configureStore } from "@reduxjs/toolkit";
import {
  authReducer,
  classOVReducer,
  classReducer,
  sidebarReducer,
  userFullReducer,
  studentInfoReducer,
  flagsForSWRReducer,
  alertHomeReducer,
  hashInfoReducer,
  adminReducer,
} from "./reducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classOV: classOVReducer,
    class: classReducer,
    sidebar: sidebarReducer,
    userfull: userFullReducer,
    studentInfo: studentInfoReducer,
    flags: flagsForSWRReducer,
    alerthome: alertHomeReducer,
    hashinfo: hashInfoReducer,
    admin: adminReducer
  },
});
