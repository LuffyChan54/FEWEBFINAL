import { SocialButtonProperties } from ".";
import "./button.css";

export default function SocialButton({ style, icon }: SocialButtonProperties) {
    return <button className={`btn ${style}`}>
        <i className={icon}></i>
    </button>
}