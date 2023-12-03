import { memo, useState } from "react";
import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
type MenuItem = Required<MenuProps>["items"][number];
const { Sider } = Layout;
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("MENU 1", "1", <PieChartOutlined />),
  getItem("MENU 2", "2", <DesktopOutlined />),
  getItem("MENU", "sub1", <UserOutlined />, [
    getItem("SUBMENU", "3"),
    getItem("SUBMENU", "4"),
    getItem("SUBMENU", "5"),
  ]),
  getItem("MENU", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];
const SideBar = memo(() => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
});
export default SideBar;
