import Header from "components/header/header";
import { Outlet } from "react-router-dom";
import "./layout.css";

export default function AnonymousLayout() {
    return <div className="anonymous-layout">
        <Header />
        <Outlet />
    </div>
}