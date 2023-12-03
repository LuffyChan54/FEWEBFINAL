import { getAuthReducer } from "@redux/reducer";
import { Form, Input } from "antd";
import SubmitButton from "components/submitButton/SubmitButton";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as userService from "services/userService";
const VerifyEmailPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(getAuthReducer);
  const location = useLocation();

  const onFinish = async () => {
    setIsLoading(true);
    userService
      .verifyEmail()
      .then((res) => {
        console.log(res);
        toast.success("Email was sent!");
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.warning(err?.response?.data.message[0]);
        setIsLoading(false);
      });
  };

  // const onFinishFailed = (errorInfo: any) => {
  //   console.log("Failed:", errorInfo);
  // };

  type FieldType = {
    email?: string;
  };

  return user.emailVerified ? (
    <Navigate to="/home/overview" state={{ from: location }} replace />
  ) : (
    <>
      <ToastContainer pauseOnHover></ToastContainer>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={{
          ["email"]: user.email,
        }}
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <p>
            You will receive a verification email after submitting the form.
          </p>
          <i style={{ opacity: 0.8 }}>
            Once verified, remember to reload the page to ensure that your
            updates take effect.
          </i>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <SubmitButton isLoading={isLoading} />
        </Form.Item>
      </Form>
    </>
  );
};

export default VerifyEmailPage;
