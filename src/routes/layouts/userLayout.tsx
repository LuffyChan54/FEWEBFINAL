import { Outlet } from "react-router-dom";
import "./layout.css";
import { Sidebar } from "components/sidebar";
import { UserHeader } from "components/header";
import { useSelector } from "react-redux";
import { getAuthReducer } from "@redux/reducer";
import { Spin } from "antd";

export default function AnonymousLayout() {
    const auth = useSelector(getAuthReducer);
    console.log(auth);
    const layout = <div className="user-layout">
        <Sidebar />
        <div className="user-layout__content">
            <UserHeader />
            <Outlet />
        </div>
    </div>;

    return auth.isLoadingLogout
        ? <Spin tip="Loading..." size="large">
            {layout}
        </Spin> : layout
}