import { getAuthReducer } from '@redux/reducer';
import { useSelector } from 'react-redux';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

// protect route
// nếu không truyền gì vào -> tự hiểu là quyền user (tức là đăng nhập vào sẽ thấy)
function ProtectRoute({ allowRoles }: { allowRoles: any[] }) {
    const { token, user: userInfo } = useSelector(getAuthReducer);
    const location = useLocation();

    const authorized = allowRoles.some(role => role === userInfo?.role);
    const user = (!allowRoles && token?.accessToken) ? true : false;

    return (
        authorized
            ? <Outlet />
            : user
                ? <Navigate to='/unauthorized' state={{ from: location }} replace />
                : <Navigate to='/signin' state={{ from: location }} replace />
    )
}

export function NavigateFromProtectToUnProtectRoute() {
    const { token } = useSelector(getAuthReducer);
    return token?.accessToken ? <Navigate to="/classroom/home" /> : <Outlet />
}
export default ProtectRoute;