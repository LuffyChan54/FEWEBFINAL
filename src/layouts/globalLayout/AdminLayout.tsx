import React, { ReactNode, useState } from "react";
import { Breadcrumb, Layout, Menu, MenuProps, theme } from "antd";
import TopNav from "layouts/topnav/TopNav";
import Sider from "antd/es/layout/Sider";
import { Outlet, useNavigate } from "react-router-dom";
const { Header, Content, Footer } = Layout;

const breakcrumbItems = [
  { label: "User", key: "User" }, // remember to pass the key prop
  { label: "Bill", key: "Bill" },
];

const AdminLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      key: "/admin",
      label: "User",
    },
    {
      key: "/admin/course",
      label: "Classes",
    },
  ];
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["/admin"]}
          mode="inline"
          items={items}
          onClick={(item) => navigate(item.key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            position: "sticky",
            top: "0px",
            zIndex: "10",
          }}
        >
          <TopNav />
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            items={breakcrumbItems}
            style={{ margin: "16px 0" }}
          ></Breadcrumb>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center", backgroundColor: "#fbffff" }}>
          HP CLASS @COPYRIGHT
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
