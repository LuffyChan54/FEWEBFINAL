import { LogoutOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { getAuthReducer, logout } from "@redux/reducer";
import { Badge, Dropdown, Space, Avatar, Spin } from "antd";

import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as userService from "services/userService";

const MyUser = memo(() => {
  const { user } = useSelector(getAuthReducer);
  const countVerifyEmail = user.emailVerified ? 0 : 1; //0: TRUE , 1: FALSE
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  const handleLogout = () => {
    setIsLoadingLogout(true);
    userService
      .signout()
      .then(() => {
        dispatch(logout({}));
        navigate("/auth");
        setIsLoadingLogout(true);
      })
      .then((err) => {
        console.log(err);
        setIsLoadingLogout(true);
      });
  };

  const items = [
    {
      label: "User Info",
      key: "Info",
      icon: <UserOutlined />,
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
