import {
  LogoutOutlined,
  MailOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { getAuthReducer, logout } from "@redux/reducer";
import { Badge, Dropdown, Space, Avatar, Spin } from "antd";

import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import * as userService from "services/userService";

const MyUser = memo(() => {
  const { user } = useSelector(getAuthReducer);
  const countVerifyEmail = user.emailVerified ? 0 : 1; //0: TRUE , 1: FALSE
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  const handleLogout = () => {
    setIsLoadingLogout(true);
    userService
      .signout()
      .then(() => {
        dispatch(logout({}));
        navigate("/auth");
        setIsLoadingLogout(false);
      })
      .then((err) => {
        console.log(err);
        setIsLoadingLogout(false);
      })
      .finally(() => {
        setIsLoadingLogout(false);
      });
  };

  const items = [
    {
      label: "User Info",
      key: "Info",
      icon: <UserOutlined />,
      onClick: () => {
        navigate("/home/user_info");
      },
    },
    {
      label: "Verify Email",
      key: "Verify",
      icon: (
        <Badge count={countVerifyEmail} size="small">
          <MailOutlined />
        </Badge>
      ),
      disabled: countVerifyEmail == 0,
      onClick: () => {
        navigate("/home/verify_email");
      },
    },
    {
      label: location.pathname.includes("admin") ? "User Mode" : "Admin Mode",
      key: "admin",
      icon: <UserSwitchOutlined />,
      onClick: () =>
        location.pathname.includes("admin")
          ? navigate("/home")
          : navigate("/admin"),
    },
    {
      label: "Log out",
      key: "logout",
      icon: <LogoutOutlined />,
      onClick: () => handleLogout(),
    },
  ];

  return (
    <>
      {isLoadingLogout && (
        <Spin fullscreen={true} size="large">
          <div></div>
        </Spin>
      )}
      <Dropdown menu={{ items }}>
        <Space size={24}>
          <Badge count={countVerifyEmail}>
            <Avatar
              src={user.picture || ""}
              shape="square"
              icon={<UserOutlined />}
              style={{ cursor: "pointer" }}
            />
          </Badge>
        </Space>
      </Dropdown>
    </>
  );
});

export default MyUser;
