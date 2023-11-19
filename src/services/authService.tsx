import { authClient } from "lib/axios"

export type SiginupOptions = {
    email: string,
    password: string,
    fullname: string
}

export type SigninOptions = Omit<SiginupOptions, "fullname">;

export const signup = async (payload: SiginupOptions) => {
    const res = await authClient.post("/auth/signup", { ...payload });
    return res.data;
}

export const signin = async (payload: SigninOptions) => {
    const res = await authClient.post("/auth/signin", { ...payload });
    return res.data;
}
