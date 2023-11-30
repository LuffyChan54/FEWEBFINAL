import { getAuthReducer } from "@redux/reducer";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isTokenStillValid } from "utils/expiresTime";
// protect route
// nếu không truyền gì vào -> tự hiểu là quyền user (tức là đăng nhập vào sẽ thấy)

function ProtectRoute({ allowRoles }: { allowRoles?: any[] }) {
  const { token } = useSelector(getAuthReducer);
  //   const authorized = allowRoles?.some((role) => role === userInfo?.role);
  const location = useLocation();
  return isTokenStillValid(token.expiresTime) ? (
    <Outlet />
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace />
  );
}

export function NavigateFromProtectToUnProtectRoute() {
  const { token } = useSelector(getAuthReducer);
  const location = useLocation();
  return !isTokenStillValid(token.expiresTime) ? (
    <Outlet />
  ) : (
    <Navigate to="/home" state={{ from: location }} replace />
  );
}
export default ProtectRoute;
