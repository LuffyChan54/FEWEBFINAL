import { Input } from "components/input";
import { Form, Link, useNavigate } from "react-router-dom";
import "../landingPage.css";
import { Button, SocialButton, SocialButtonProperties } from "components/button";
import { useDispatch } from "react-redux";
import { signin } from "@redux/reducer";
import { useState } from "react";
import * as authService from "services/authService";
import { Spin } from "antd";
import { ToastContainer, toast } from "react-toastify";

const socialButtons: SocialButtonProperties[] = [
    {
        icon: "uil uil-facebook",
        style: "btn-group__social facebook"
    },
    {
        icon: "uil uil-google",
        style: "btn-group__social google"
    },
    {
        icon: "uil uil-github",
        style: "btn-group__social github"
    }
]

export default function Signin() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState({
        isValid: true,
        value: ""
    });
    const [password, setPassword] = useState({
        isValid: true,
        value: ""
    });
    const buttonContent = () => {
        return <>
            {isLoading ? <Spin style={{ marginRight: "1rem" }} /> : <></>}
            {isLoading ? "Loading..." : "Sign Up"}
        </>
    }
    const buttonElements = socialButtons.map((btn, index) => <SocialButton key={index} {...btn} />)
    const handleLogin = async () => {
        const payload = {
            email: email.value,
            password: password.value
        }
        setIsLoading(true);
        authService.signin(payload)
            .then(({ userInfo, token }) => {
                dispatch(signin({
                    user: userInfo,
                    token
                }))
                toast("Login successfully", { type: "success" });
                navigate("/classroom/home");
            })
            .catch(err => {
                console.log(err);
                toast(err?.response?.data.message, { type: "error" });
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    return <div id="signin">
        <div className="side">
            <div className="side-description">
                <div className="side-description__header">
                    Sign In to <br />Recharge Direct
                </div>
                <div className="side-description__description">
                    If you don't have an account <br />you can <Link to="/signup" className="primary" >Register here!</Link>
                </div>
            </div>
            <div className="side-image">
                <img src="https://bizzi.vn/wp-content/themes/bizzziii/img/register-img-2.svg" alt="" />
            </div>
        </div>
        <div className="form">
            <Form >
                <Input input={{
                    type: "text",
                    label: "Email",
                    name: "email"
                }} event={{
                    value: email,
                    handle: (data) => setEmail({ ...data })
                }} />
                <Input input={{
                    type: "password",
                    label: "Password",
                    name: "password"
                }}
                    event={{
                        value: password,
                        handle: (data) => setPassword({ ...data })
                    }} />
                <div className="form-recover-password">
                    <Link to="/recover" >Recover Password?</Link>
                </div>
                <Button
                    clickEvent={() => handleLogin()}
                    disable={isLoading}
                    content={buttonContent()} style="form-button" color="white" />
            </Form>
            <div className="form-footer">
                <div className="line"></div>
                <div className="btn-group">
                    {buttonElements}
                </div>
            </div>
        </div>

        <ToastContainer />
    </div>
}