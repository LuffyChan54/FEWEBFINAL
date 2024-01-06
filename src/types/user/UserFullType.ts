export interface UserFullType {
  userId: string;
  name?: string;
  givenName?: string;
  nickname?: string;
  email: string;
  picture?: string;
  createdAt: string;
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
