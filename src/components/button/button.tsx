import { ButtonProperties } from ".";
import "./button.css";

export default function Button({ color, content, style, clickEvent, disable }: ButtonProperties) {
    return <button
        disabled={disable}
        onClick={() => clickEvent()}
        style={{ color: color }} className={`btn ${style}`}>
        {content}
    </button>
}