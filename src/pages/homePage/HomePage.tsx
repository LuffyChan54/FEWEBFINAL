import { update } from "@redux/reducer";
import GlobalLayout from "layouts/globalLayout/GlobalLayout";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import * as userService from "services/userService";
const HomePage = () => {
  const dispatch = useDispatch();

  userService
    .getUser()
    .then((res) => {
      const payload = {
        email: res.email,
        emailVerified: res.emailVerified,
        name: res.name,
        picture: res.picture,
      };
      dispatch(update(payload));
      // console.log(payload);
    })
    .catch((err) => {
      console.log("fetch error:", err);
    });

  return (
    <GlobalLayout>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: "#fff",
        }}
      >
        <Outlet />
      </div>
    </GlobalLayout>
  );
};

export default HomePage;
