import { Button } from "components/button"
import { Input } from "components/input"
import { useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { Tooltip } from "components/tooltip";
import "../landingPage.css";
import { useDispatch } from "react-redux";
import { signup } from "@redux/reducer";
import * as authService from "services/authService";
import { ToastContainer, toast } from "react-toastify";
import { Spin } from "antd";

const emailTooltips = (
    <div style={{ fontStyle: "italic" }}>
        <p>This field is required</p>
        <p>This field have no space</p>
        <p>This field is an email</p>
    </div>
);


const fullnameToolTips = (
    <div style={{ fontStyle: "italic" }}>
        <p>This field is required</p>
    </div>
);

const passwordToolTips = (
    <div style={{ fontStyle: "italic" }}>
        <p>This field is required</p>
        <p>This field have no space</p>
        <p>This field must have at least 8 characters</p>
        <p>This field must have at least 1 special character</p>
        <p>This field must have at least 1 number</p>
        <p>This field must have at least 1 uppercase</p>
    </div>
);

export default function Signup() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [email, setEmail] = useState({
        isValid: true,
        value: ""
    });
    const [password, setPassword] = useState({
        isValid: true,
        value: ""
    });
    const [fullname, setFullname] = useState({
        isValid: true,
        value: ""
    });
    const [isSubmit, setIsSubmit] = useState(false);
    const buttonContent = () => {
        return <>
            {isLoading ? <Spin style={{ marginRight: "1rem" }} /> : <></>}
            {isLoading ? "Loading..." : "Sign Up"}
        </>
    }
    const handleSubmit = async () => {
        setIsSubmit(true);
        if (fullname.isValid && email.isValid && password.isValid &&
            fullname.value && email.value && password.value) {
            const payload = {
                email: email.value,
                password: password.value,
                fullname: fullname.value
            }
            setIsLoading(true);
            return authService.signup(payload)
                .then(data => {
                    dispatch(signup({
                        data
                    }))

                    toast("Sign Up Successfully", { type: "success" });
                    navigate("/signin");
                })
                .catch(err => {
                    console.log(err);
                    toast(err?.response?.data.message, { type: "error" });
                })
                .finally(() => {
                    setIsLoading(false);
                })
        }
    }
    return <div id="signin">
        <div className="side">
            <div className="side-description">
                <div className="side-description__header">
                    Sign Up to <br />Recharge Direct
                </div>
                <div className="side-description__description">
                    If you have an account <br />you can <Link to="/signin" className="primary" >Login here!</Link>
                </div>
            </div>
            <div className="side-image">
                <img src="https://bizzi.vn/wp-content/themes/bizzziii/img/register-img-2.svg" alt="" />
            </div>
        </div>
        <div className="form">
            <Form >
                <div className="form-note">
                    <Tooltip content={emailTooltips} placement="left" title="Email Tooltips">
                        <>Email <i className="uil uil-notes"></i></>
                    </Tooltip>
                </div>
                <Input input={{
                    type: "text",
                    label: "Email",
                    name: "email"
                }} isSubmit={
                    isSubmit
                } event={{
                    value: email,
                    handle: (data) => setEmail({ ...data })
                }} validation={{
                    isEmail: true,
                    isRequire: true,
                    noSpace: true
                }} />

                <div className="form-note">
                    <Tooltip content={fullnameToolTips} placement="left" title="Fullname Tooltips">
                        <>Fullname <i className="uil uil-notes"></i></>
                    </Tooltip>
                </div>
                <Input input={{
                    type: "text",
                    label: "Fullname",
                    name: "name"
                }} isSubmit={
                    isSubmit
                } event={{
                    value: fullname,
                    handle: (data) => setFullname({ ...data })
                }} validation={{
                    isRequire: true
                }} />

                <div className="form-note">
                    <Tooltip content={passwordToolTips} placement="left" title="Password Tooltips">
                        <>Password <i className="uil uil-notes"></i></>
                    </Tooltip>
                </div>
                <Input input={{
                    type: "password",
                    label: "Password",
                    name: "password"
                }}
                    isSubmit={isSubmit}
                    event={{
                        value: password,
                        handle: (data) => setPassword({ ...data })
                    }} validation={{
                        isRequire: true,
                        noSpace: true,
                        atLeast: 8,
                        contain: {
                            specialChar: true,
                            number: true,
                            uppercase: true,
                        }
                    }} />
                <Button
                    clickEvent={() => handleSubmit()}
                    disable={isLoading}
                    content={buttonContent()} style="form-button" color="white" />
            </Form>
        </div>
        <ToastContainer />
    </div>
}