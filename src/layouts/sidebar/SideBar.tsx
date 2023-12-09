import { memo, useState } from "react";
import { Layout, Menu } from "antd";
import {
  BookOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getClassOVReducer,
  getSidebarReducer,
  setTabActive,
} from "@redux/reducer";
import { ClassOverviewType } from "types";
type MenuItem = Required<MenuProps>["items"][number];
const { Sider } = Layout;
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  onClick?: Function
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  } as MenuItem;
}

const SideBar = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //TODO: change title
  const classOverviews: ClassOverviewType[] = useSelector(getClassOVReducer);

  const resultClassOV = classOverviews.reduce((prev, curr) => {
    if (curr.role == "teaching") {
      if (prev.hasOwnProperty("teaching")) {
        (prev as any).teaching.push(curr);
      } else {
        (prev as any).teaching = [curr];
      }
    }

    if (curr.role == "learning") {
      if (prev.hasOwnProperty("learning")) {
        (prev as any).learning.push(curr);
      } else {
        (prev as any).learning = [curr];
      }
    }

    return prev;
  }, {});

  const { teaching, learning } = resultClassOV as {
    teaching: ClassOverviewType[];
    learning: ClassOverviewType[];
  };

  const items: MenuItem[] = [
    getItem("Main screen", "home", <PieChartOutlined />, undefined, () => {
      dispatch(setTabActive("home"));
      navigate("/home");
    }),

    getItem(
      "Teaching",
      "teaching",
      <UserOutlined />,
      teaching.map((classTeaching) =>
        getItem(
          classTeaching.name,
          classTeaching.id,
          <BookOutlined />,
          undefined,
          () => {
            dispatch(setTabActive(classTeaching.id));
            navigate(`/home/class/${classTeaching.id}`);
          }
        )
      )
    ),
    getItem(
      "Registed",
      "registed",
      <TeamOutlined />,
      learning.map((classLearning) =>
        getItem(
          classLearning.name,
          classLearning.id,
          <BookOutlined />,
          undefined,
          () => {
            dispatch(setTabActive(classLearning.id));
            navigate(`/home/class/${classLearning.id}`);
          }
        )
      )
    ),
    // getItem("Files", "9", <FileOutlined />),
  ];

  const [collapsed, setCollapsed] = useState(false);

  const idTabActive = useSelector(getSidebarReducer);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        selectedKeys={[idTabActive]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
});
export default SideBar;
