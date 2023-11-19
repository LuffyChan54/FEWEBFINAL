import { useSelector } from "react-redux"
import { getAuthReducer } from "@redux/reducer";
import { ReactNode } from "react";

// nếu không truyền gì vào -> tự hiểu là quyền user (tức là đăng nhập vào sẽ thấy)
export default function ProtectComponent({ children, allowRoles }:
    { allowRoles: any[], children: ReactNode }) {
    const auth = useSelector(getAuthReducer);
    console.log(auth);
    const { token, user: userInfo } = auth;
    const authorized = allowRoles.some(role => role === userInfo?.role);
    const user = (!allowRoles && token?.accessToken) ? true : false;
    return (
        authorized || user
            ? <>
                {children}
            </>
            : <>
                {/* render nothing */}
            </>
    )
}