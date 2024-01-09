import { createSlice } from "@reduxjs/toolkit";
import { sortBy } from "lodash";
import { UserStudentCard } from "types";

interface InitialState {
  users: UserStudentCard[];
}

const initialState: InitialState = {
  users: [],
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    getUsersAction: (state, action) => {
      const payload = action.payload;
      return {
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
      return { users };
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

      return { users };
    },
  },
});

// Action creators are generated for each case reducer function
export const getAdminReducer = (state: any) => state.admin;
export const { getUsersAction, blockUserAction, importUserAction } =
  adminSlice.actions;
export const adminReducer = adminSlice.reducer;
