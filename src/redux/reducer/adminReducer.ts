import { createSlice } from "@reduxjs/toolkit";
import { sortBy } from "lodash";
import { ClassInfoType, UserStudentCard } from "types";

interface InitialState {
  users: UserStudentCard[];
  classes: ClassInfoType[];
}

const initialState: InitialState = {
  users: [],
  classes: [],
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    getUsersAction: (state, action) => {
      const payload = action.payload;
      return {
        ...state,
        users: payload,
      };
    },
    blockUserAction: (state, action) => {
      const payload = action.payload;
      const users = state.users.map((user) => {
        if (user.userId === payload.userId) {
          return payload;
        }
        return user;
      });
      return { ...state, users };
    },
    importUserAction: (state, action) => {
      const payload = action.payload;
      const map = new Map(payload.map((user: any) => [user.userId, user]));
      const users = state.users.map((user) => {
        const student = map.get(user.userId) as { studentId: string };
        if (!student) {
          return user;
        }

        return {
          ...user,
          studentCard: {
            studentId: student.studentId,
          },
        };
      }) as UserStudentCard[];

      return {
        ...state,
        users,
      };
    },
    getClassesAction: (state, action) => {
      return {
        ...state,
        classes: action.payload,
      };
    },
    toggleActiveClassAction: (state, action) => {
      const payload = action.payload;
      console.log(payload);
      const classes = state.classes.map((_class) => {
        if (_class.id === payload.id) {
          return {
            ..._class,
            ...payload,
          };
        }
        return _class;
      });
      return { ...state, classes };
    },
    createClassAction: (state, action) => {
      const payload = action.payload;
      const classes = [payload, ...state.classes];
      return {
        ...state,
        classes,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const getAdminReducer = (state: any) => state.admin;
export const {
  getUsersAction,
  blockUserAction,
  importUserAction,
  getClassesAction,
  toggleActiveClassAction,
  createClassAction,
} = adminSlice.actions;
export const adminReducer = adminSlice.reducer;
