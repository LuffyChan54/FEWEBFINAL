import axios, { InternalAxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";
import { getNextExpiresTime, isTokenStillValid } from "utils/expiresTime";

export const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_CLIENT,
});
export const userClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_CLIENT,
});
export const classOVClient = axios.create({
  baseURL: import.meta.env.VITE_COURSE_URL,
});
export const classClient = axios.create({
  baseURL: import.meta.env.VITE_COURSE_URL,
});
export const inviteClient = axios.create({
  baseURL: import.meta.env.VITE_COURSE_URL,
});
export const notificationClient = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATION_URL,
});
export const gradeClient = axios.create({
  baseURL: import.meta.env.VITE_GRADE_URL,
});

export const getRefreshToken = async (token: string) => {
  const res = await axios.post(
    `${import.meta.env.VITE_AUTH_CLIENT}/api/auth/refresh-token`,
    {
      refreshToken: token,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data?.token;
};

const configFunction = async (config: InternalAxiosRequestConfig<any>) => {
  let token = localStorage.getItem("token");
  if (!token) {
    return config;
  }
  let { accessToken, refreshToken, expiresTime } = JSON.parse(token);

  if (!isTokenStillValid(expiresTime)) {
    if (refreshToken.trim() == "") {
      //Sign in with gooogle doesn't have refresh token
      const navigate = useNavigate();
      navigate("/auth");
    }
    const newToken = await getRefreshToken(refreshToken);
    accessToken = newToken.accessToken;

    localStorage.setItem(
      "token",
      JSON.stringify({
        accessToken,
        refreshToken: newToken.accessToken,
        expiresTime: getNextExpiresTime(newToken.expiresIn),
      })
    );
  }

  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
};

gradeClient.interceptors.request.use(configFunction, (err) => {
  return Promise.reject(err);
});

userClient.interceptors.request.use(configFunction, (err) => {
  return Promise.reject(err);
});

classOVClient.interceptors.request.use(configFunction, (err) => {
  return Promise.reject(err);
});

classClient.interceptors.request.use(configFunction, (err) => {
  return Promise.reject(err);
});

inviteClient.interceptors.request.use(configFunction, (err) => {
  return Promise.reject(err);
});

notificationClient.interceptors.request.use(configFunction, (err) => {
  return Promise.reject(err);
});
