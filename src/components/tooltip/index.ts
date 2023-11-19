import { Popover } from "antd";
import { ReactComponentElement } from "react";

export { default as Tooltip } from "./tooltip";
export type TooltipOptions = Parameters<typeof Popover>[0] & { children: ReactComponentElement<any> }