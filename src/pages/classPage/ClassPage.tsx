import {
  HomeOutlined,
  TeamOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { setTabActive } from "@redux/reducer";
import { Tabs, TabsProps } from "antd";
import ClassOverview from "components/classOverview/ClassOverview";
import ClassPeople from "components/classPeople/ClassPeople";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const ClassPage = () => {
  const { classID } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTabActive(classID));
    return;
  });

  //TODO: IPLM OVERVIEW COMPONENT AND PEOPLE COMPONENT;

  const items: TabsProps["items"] = [
    {
      label: (
        <>
          <HomeOutlined /> Overview
        </>
      ),
      key: "overview",
      children: <ClassOverview classID={classID} />,
    },
    {
      label: (
        <>
          <TeamOutlined /> People
        </>
      ),
      key: "people",
      children: <ClassPeople classID={classID} />,
    },
    {
      label: (
        <>
          <FileDoneOutlined /> Points
        </>
      ),
      key: "points",
      children: "",
    },
  ];

  const onChange = (key: string) => {
    // console.log(key);
  };

  return (
    <>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
};

export default ClassPage;
