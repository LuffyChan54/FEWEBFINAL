import React, { ReactNode, useState } from "react";
import { Breadcrumb, Layout, theme } from "antd";
import TopNav from "layouts/topnav/TopNav";
import SideBar from "layouts/sidebar/SideBar";
const { Header, Content, Footer } = Layout;

const breakcrumbItems = [
  { label: "User", key: "User" }, // remember to pass the key prop
  { label: "Bill", key: "Bill" },
];

interface GlobalLayoutProps {
  children: ReactNode;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideBar />
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
          {children}
          {/* <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            Bill is a cat.
          </div> */}
        </Content>
        <Footer style={{ textAlign: "center", backgroundColor: "#fbffff" }}>
          HP CLASS @COPYRIGHT
        </Footer>
      </Layout>
    </Layout>
  );
};

export default GlobalLayout;
