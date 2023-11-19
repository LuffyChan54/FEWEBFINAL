import { useDispatch } from 'react-redux';
import * as userService from "services/userService";
import { logout, loadingLogout } from '@redux/reducer';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(loadingLogout());
        userService.signout()
            .then(() => {
                dispatch(logout({}));
                navigate("/signin");
            })
            .then((err) => {
                console.log(err);
            })
    }
    return <div
        onClick={() => handleLogout()}
        style={{ minWidth: "200px" }}>Logout</div>
}

export default Logout;