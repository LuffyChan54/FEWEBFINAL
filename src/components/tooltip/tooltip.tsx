import { Popover } from "antd";
import { TooltipOptions } from ".";

export default function Tooltip({ content, title, children, placement }: TooltipOptions) {
    return <Popover placement={placement} content={content} title={title}>
        {children}
    </Popover>
}