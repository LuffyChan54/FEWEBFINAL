import { StudentInfoType } from "./StudentInfoType";

export interface UserFullType {
  userId: string;
  name?: string;
  givenName?: string;
  nickname?: string;
  email: string;
  picture?: string;
  createdAt: string;
  userMetadata?: {
    role: string;
  };
  emailVerified?: boolean;
  blocked?: boolean;
}

export const initUserFullType: UserFullType = {
  userId: "Loading...",
  name: "Loading...",
  givenName: "Loading...",
  nickname: "Loading...",
  email: "Loading...",
  picture: "Loading...",
  createdAt: "Loading...",
};

export interface UserStudentCard extends UserFullType {
  studentCard: StudentInfoType;
}
