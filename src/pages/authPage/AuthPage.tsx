import "./AuthPage.css";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  FacebookOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { ConfigProvider, Space, Tabs, TabsProps, theme } from "antd";
import type { CSSProperties } from "react";
import { useState } from "react";
import { Spin } from "antd";
import * as authService from "services/authService";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { signin, signup } from "@redux/reducer";
import { authClient } from "lib/axios";
type LoginType = "login" | "signup" | "forgot";

const authItems: TabsProps["items"] = [
  {
    key: "login",
    label: "LOG IN",
    style: {},
  },
  {
    key: "signup",
    label: "SIGN UP",
  },
  {
    key: "forgot",
    label: "",
  },
];

const iconStyles: CSSProperties = {
  marginInlineStart: "16px",
  // color: setAlpha(token.colorTextBase, 0.2),
  fontSize: "34px",
  verticalAlign: "middle",
  cursor: "pointer",
  color: "#fff",
  padding: "4px",
  borderRadius: "4px",
  background: "#4267b2",
};

const AuthPage = () => {
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const { token } = theme.useToken();
  const [loginType, setLoginType] = useState<LoginType>("login");
  const dispatch = useDispatch();

  //Handle submit function:
  const handleSubmit = async (value: any): Promise<boolean> => {
    setIsSendingRequest(true);

    //signup:
    if (loginType == "signup") {
      authService
        .signup(value)
        .then((data) => {
          dispatch(
            signup({
              data,
            })
          );
          toast.success("Sign Up Successfully", { theme: "colored" });
          setLoginType("login");
        })
        .catch((err) => {
          console.log(err);
          toast.warning(err?.response?.data.message, {
            theme: "colored",
          });
        })
        .finally(() => {
          setIsSendingRequest(false);
        });
    } else {
      if (loginType == "login") {
        authService
          .signin(value)
          .then(({ userInfo, token }) => {
            dispatch(
              signin({
                user: userInfo,
                token,
              })
            );
            toast.success("Log In Successfully", { theme: "colored" });
          })
          .catch((err) => {
            console.log(err);
            toast.warning(err?.response?.data.message, {
              theme: "colored",
            });
          })
          .finally(() => {
            setIsSendingRequest(false);
          });
      }

      if (loginType == "forgot") {
        authClient
          .post("/api/auth/change-password", value)
          .then(() => {
            toast.success("Reset password successfully", { theme: "colored" });
          })
          .catch((err) => {
            toast.warning(err?.response?.data.message, {
              theme: "colored",
            });
          })
          .finally(() => {
            setIsSendingRequest(false);
          });
      }
    }
    return true;
  };

  //Hanle google click:
  const handleGoogleClick = async () => {
    setIsSendingRequest(true);
    await authService.signinGG();
    setIsSendingRequest(false);
  };

  const handleFBClick = async () => {
    setIsSendingRequest(true);
    await authService.signinFB();
    setIsSendingRequest(false);
  };
  return (
    // ProConfigProvider
    <>
      <ToastContainer pauseOnHover />
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              itemColor: "#fbffff",
              inkBarColor: "#23b574",
              itemActiveColor: "#23b574",
              itemHoverColor: "#23b574",
              itemSelectedColor: "#23b574",
              titleFontSize: 16,
            },
            Spin: {
              colorPrimary: "#fbffff",
            },
          },
        }}
      >
        <div
          style={{
            background:
              "rgba(16, 71, 92, 0.4) url(/imgs/bglading.jpg) no-repeat right top",
            backgroundSize: "cover",
            backgroundBlendMode: "darken",
            height: "100vh",
            color: "#fbffff",
          }}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.4)",
              height: "100vh",
              width: "100%",
            }}
          >
            {isSendingRequest && (
              <div id="AP_WrapSpin_CTN">
                <Spin size="large" />
              </div>
            )}

            <div
              style={{
                paddingTop: "100px",
              }}
              id="WrapForm_AntD_Custom"
            >
              <LoginForm
                // logo="/imgs/logo.png"
                onFinish={(value) => handleSubmit(value)}
                title="HP CLASS"
                containerStyle={{
                  color: "#23b574",
                }}
                subTitle={
                  <p
                    style={{
                      color: "#fbffff",
                      letterSpacing: "0.9px",
                      opacity: "0.7",
                    }}
                  >
                    Innovate in learning, with HPClass everything is possible
                  </p>
                }
                actions={
                  <Space>
                    OR
                    <FacebookOutlined
                      onClick={() => handleFBClick()}
                      style={iconStyles}
                    />
                    <GoogleOutlined
                      onClick={() => handleGoogleClick()}
                      style={{
                        ...iconStyles,
                        color: "#23ae5f",
                        background: "#fff",
                      }}
                    />
                  </Space>
                }
              >
                <Tabs
                  defaultActiveKey="login"
                  activeKey={loginType}
                  centered
                  // activeKey={loginType}
                  onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                  items={authItems}
                />
                {loginType === "login" && (
                  <>
                    <ProFormText
                      name="email"
                      fieldProps={{
                        size: "large",
                        prefix: <MailOutlined className={"prefixIcon"} />,
                      }}
                      placeholder={"Email: "}
                      rules={[
                        {
                          required: true,
                          message: "Email is Empty!",
                        },
                        {
                          pattern:
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Invalid Email!",
                        },
                      ]}
                    />
                    <ProFormText.Password
                      name="password"
                      fieldProps={{
                        size: "large",
                        prefix: <LockOutlined className={"prefixIcon"} />,
                        strengthText:
                          "Password should contain numbers, letters and special characters, at least 8 characters long.",

                        statusRender: (value) => {
                          const getStatus = () => {
                            if (value && value.length > 12) {
                              return "ok";
                            }
                            if (value && value.length > 6) {
                              return "pass";
                            }
                            return "poor";
                          };
                          const status = getStatus();
                          if (status === "pass") {
                            return (
                              <div style={{ color: token.colorWarning }}>
                                STRONG
                              </div>
                            );
                          }
                          if (status === "ok") {
                            return (
                              <div style={{ color: token.colorSuccess }}>
                                VERY STRONG
                              </div>
                            );
                          }
                          return (
                            <div style={{ color: token.colorError }}>WEAK</div>
                          );
                        },
                      }}
                      placeholder={"Password:"}
                      rules={[
                        {
                          required: true,
                          message: "Password is Empty!",
                        },
                      ]}
                    />
                  </>
                )}
                {loginType === "signup" && (
                  <>
                    <ProFormText
                      fieldProps={{
                        size: "large",
                        prefix: <UserOutlined className={"prefixIcon"} />,
                      }}
                      name="name"
                      placeholder={"Full Name:"}
                      rules={[
                        {
                          required: true,
                          message: "Full Name is empty！",
                        },
                      ]}
                    />
                    <ProFormText
                      name="email"
                      fieldProps={{
                        size: "large",
                        prefix: <MailOutlined className={"prefixIcon"} />,
                      }}
                      placeholder={"Email: "}
                      rules={[
                        {
                          required: true,
                          message: "Email is Empty!",
                        },
                        {
                          pattern:
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Invalid Email!",
                        },
                      ]}
                    />
                    <ProFormText.Password
                      name="password"
                      fieldProps={{
                        size: "large",
                        prefix: <LockOutlined className={"prefixIcon"} />,
                        strengthText:
                          "Password should contain numbers, letters(at least 1 UPPERCASE) and special characters, at least 8 characters long.",

                        statusRender: (value) => {
                          const getStatus = () => {
                            if (value && value.length > 12) {
                              return "ok";
                            }
                            if (value && value.length > 6) {
                              return "pass";
                            }
                            return "poor";
                          };
                          const status = getStatus();
                          if (status === "pass") {
                            return (
                              <div style={{ color: token.colorWarning }}>
                                STRONG
                              </div>
                            );
                          }
                          if (status === "ok") {
                            return (
                              <div style={{ color: token.colorSuccess }}>
                                VERY STRONG
                              </div>
                            );
                          }
                          return (
                            <div style={{ color: token.colorError }}>WEAK</div>
                          );
                        },
                      }}
                      placeholder={"Password:"}
                      rules={[
                        {
                          required: true,
                          message: "Password is Empty!",
                        },
                        {
                          pattern:
                            /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/,
                          message: "Password is too weak!",
                        },
                      ]}
                    />
                  </>
                )}
                {loginType === "forgot" && (
                  <>
                    <ProFormText
                      name="email"
                      fieldProps={{
                        size: "large",
                        prefix: <MailOutlined className={"prefixIcon"} />,
                      }}
                      placeholder={"Your Email: "}
                      rules={[
                        {
                          required: true,
                          message: "Email is Empty!",
                        },
                        {
                          pattern:
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Invalid Email!",
                        },
                      ]}
                    />
                  </>
                )}
                {loginType != "forgot" && loginType != "signup" && (
                  <div
                    style={{
                      marginBlockEnd: 24,
                    }}
                  >
                    <ProFormCheckbox noStyle name="autoLogin">
                      <h6
                        style={{
                          color: "#fbffff",
                          fontWeight: "400",
                          marginBottom: "0px",
                        }}
                      >
                        Auto Login
                      </h6>
                    </ProFormCheckbox>
                    <a
                      style={{
                        float: "right",
                      }}
                      onClick={() => setLoginType("forgot" as LoginType)}
                    >
                      <h6
                        style={{
                          color: "#fbffff",
                          fontWeight: "300",
                          opacity: "0.8",
                        }}
                      >
                        Forgot Password?
                      </h6>
                    </a>
                  </div>
                )}
              </LoginForm>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
};

export default AuthPage;
