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

export const updateAvatar = async (newImg: any) => {
  const res = await userClient.post("/api/user/avatar", newImg);
  return res.data;
};

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
      userId: user.userId,
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

export const signinGG = async () => {
  const redirectUri = import.meta.env.VITE_AUTH_REDIRECT_URL;
  const res = await authClient.get(
    "/api/auth/social?connection=google-oauth2&redirectUri=" + redirectUri
  );
  const connectGGURL = res.data;
  window.location = connectGGURL;
};

export const signinFB = async () => {
  const redirectUri = import.meta.env.VITE_AUTH_REDIRECT_URL;
  const res = await authClient.get(
    "/api/auth/social?connection=facebook&redirectUri=" + redirectUri
  );
  const connectFBURL = res.data;
  window.location = connectFBURL;
};

export const getTokenSocialLogin = async (code: string) => {
  const res = await authClient.post(
    "api/auth/social",
    {
      code,
      redirectUri: import.meta.env.VITE_AUTH_REDIRECT_URL,
    },
    {}
  );
  const { accessToken, refreshToken, expiresIn } = res.data as ResponseData;

  const resUser = await userClient.get("/api/user", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  const user = resUser.data;

  // console.log(user);

  return {
    userInfo: {
      userId: user.userId,
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
