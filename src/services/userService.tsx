import { userClient } from "lib/axios";

export type UpdateUserOptions = {
  avatar?: string;
  birthday?: string;
  notes?: string;
  fullname?: string;
};
export const getUser = async () => {
  const res = await userClient.get("/api/user");
  return res.data;
};

export const updateUser = async (payload: UpdateUserOptions) => {
  const res = await userClient.put("/users", { ...payload });
  return res.data;
};

export const verifyEmail = async () => {
  const res = await userClient.post("/api/user/verify-email");
  return res.data;
};

export const signout = async () => {
  const res = await userClient.post("/api/user/logout", {
    federated: true,
  });
  return res.data;
};
