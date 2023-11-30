import { authClient } from "lib/axios";
import { userClient } from "lib/axios";
import { getNextExpiresTime } from "utils/expiresTime";
export type SiginupOptions = {
  email: string;
  password: string;
  name: string;
};

interface ResponseData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type SigninOptions = Omit<SiginupOptions, "name">;

export const signup = async (payload: SiginupOptions) => {
  const res = await authClient.post("/api/auth/signup", { ...payload });
  return res.data;
};

export const signin = async (payload: SigninOptions) => {
  const res = await authClient.post("/api/auth/login", { ...payload });
  const { accessToken, refreshToken, expiresIn } = res.data as ResponseData;
  const resUser = await userClient.get("/api/user", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  const user = resUser.data;

  return {
    userInfo: {
      email: user.email,
      emailVerified: user.emailVerified,
      name: user.name,
      picture: user.picture,
    },
    token: {
      accessToken,
      refreshToken,
      expiresTime: getNextExpiresTime(expiresIn),
    },
  };
};
