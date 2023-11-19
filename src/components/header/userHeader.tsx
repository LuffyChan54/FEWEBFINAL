import { useSelector } from "react-redux";
import "./userHeader.css";
import { getAuthReducer } from "@redux/reducer";
import { Notification, UserSetting } from "components/dropdown";

export default function UserHeader() {
    const { user } = useSelector(getAuthReducer);
    return <div className="header">
        <div className="header-greet">
            <h2>Good Morning, {user.fullname}</h2>
            <p>Today {new Date().toLocaleDateString()}</p>
        </div>
        <div className="header-interaction">
            <div className="header-interfaction__notification">
                <Notification />
            </div>
            <div className="header-interaction__userSetting">
                <UserSetting />
            </div>
        </div>
    </div>
}