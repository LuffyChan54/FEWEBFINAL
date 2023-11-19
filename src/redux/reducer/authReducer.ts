import { createSlice } from '@reduxjs/toolkit'

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState = {
    token: token ? JSON.parse(token) : {
        accessToken: "",
        refreshToken: ""
    },
    user: user ? JSON.parse(user) : {},
    isLoadingLogout: false
}
const defaultState = {
    token: {
        accessToken: "",
        refreshToken: ""
    },
    user: {},
    isLoadingLogout: false
}
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signup: (state, _) => {
            return { ...state }
        },
        signin: (state, action) => {
            const { user, token } = action.payload;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", JSON.stringify(token));
            return {
                ...state,
                user,
                token
            }
        },
        update: (state, action) => {
            const payload = action.payload;
            localStorage.setItem("user", JSON.stringify({ ...state.user, ...payload }));
            return {
                ...state,
                user: {
                    ...state.user,
                    ...payload
                }
            }
        },
        loadingLogout: (state) => {
            return { ...state, isLoadingLogout: true };
        },
        logout: (_, __) => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return { ...defaultState }
        }
    }
})

// Action creators are generated for each case reducer function
export const getAuthReducer = (state: any) => state.auth;
export const { signin, signup, logout, loadingLogout, update } = authSlice.actions
export const authReducer = authSlice.reducer;