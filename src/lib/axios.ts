import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { getNextExpiresTime, isTokenStillValid } from "utils/expiresTime";

export const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_CLIENT,
});
export const userClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_CLIENT,
});

const getRefreshToken = async (token: string) => {
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

userClient.interceptors.request.use(
  async (config) => {
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
  },
  (err) => {
    return Promise.reject(err);
  }
);
