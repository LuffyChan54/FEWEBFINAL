import { ReactComponentElement } from "react";

export { default as Button } from "./button";
export { default as SocialButton } from "./socialButton";

export type ButtonProperties = {
    color?: string,
    content: ReactComponentElement<any>,
    style: string,
    disable: boolean,
    clickEvent: () => void
}

export type SocialButtonProperties = {
    icon: string,
    style: string
}