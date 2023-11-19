import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const authClient = axios.create({
    baseURL: import.meta.env.VITE_AUTH_CLIENT
})
export const userClient = axios.create({
    baseURL: import.meta.env.VITE_AUTH_CLIENT
})

const getRefreshToken = async (token: string) => {
    const res = await axios.post(`${import.meta.env.VITE_AUTH_CLIENT}/auth/refresh`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data?.token;
}

userClient.interceptors.request.use(async (config) => {
    let token = localStorage.getItem("token");
    if (!token) {
        return config;
    }
    let { accessToken, refreshToken } = JSON.parse(token);

    const { exp = new Date().getTime() } = jwtDecode(accessToken);
    if (exp * 1000 < new Date().getTime()) {
        const token = await getRefreshToken(refreshToken);
        accessToken = token.accessToken;
        localStorage.setItem("token", JSON.stringify(token));
    }

    config.headers.Authorization = `Bearer ${accessToken}`
    return config;
}, (err) => {
    return Promise.reject(err);
})