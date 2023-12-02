import React, { useState } from "react";
import {
  BellOutlined,
  DesktopOutlined,
  DownOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Badge,
  Breadcrumb,
  Dropdown,
  message,
  Button,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
  Avatar,
} from "antd";
import MyAlert from "components/myAlert/MyAlert";
// import "assets/customTheme/color/colors.js";
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

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
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const breakcrumbItems = [
  { label: "User", key: "User" }, // remember to pass the key prop
  { label: "Bill", key: "Bill" },
];

const handleMenuClick: MenuProps["onClick"] = (e) => {
  message.info("Click on menu item.");
  console.log("click", e);
};

const userDropdownItems: MenuProps["items"] = [
  {
    label: "1st menu item",
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "2nd menu item",
    key: "2",
    icon: <UserOutlined />,
  },
  {
    label: "3rd menu item",
    key: "3",
    icon: <UserOutlined />,
    danger: true,
  },
  {
    label: "4rd menu item",
    key: "4",
    icon: <UserOutlined />,
    danger: true,
    disabled: true,
  },
];

const menuProps = {
  userDropdownItems,
  onClick: handleMenuClick,
};

const GlobalLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
      <Layout>
        <Header style={{ padding: "0 16px", background: colorBgContainer }}>
          <Flex gap="large" justify="flex-end" align="center">
            <MyAlert />
            <Dropdown menu={{ items }}>
              <Space size={24}>
                <Badge count={1}>
                  <Avatar
                    src=""
                    shape="square"
                    icon={<UserOutlined />}
                    style={{ cursor: "pointer" }}
                  />
                </Badge>
              </Space>
            </Dropdown>
          </Flex>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            items={breakcrumbItems}
            style={{ margin: "16px 0" }}
          ></Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            Bill is a cat.
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default GlobalLayout;
