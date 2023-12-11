import {
  HomeOutlined,
  TeamOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { setTabActive } from "@redux/reducer";
import { Tabs, TabsProps, message } from "antd";
import ClassOverview from "components/classOverview/ClassOverview";
import ClassPeople from "components/classPeople/ClassPeople";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ClassEndpointWTID, getClassDetail } from "services/classService";
import useSWR from "swr";
import { ClassInfoType } from "types";

const ClassPage = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  let {
    isLoading,
    isValidating,
    error,
    data: classDetail,
    mutate,
  } = useSWR(ClassEndpointWTID + courseId, () => getClassDetail(courseId), {
    onSuccess: (data) => {
      return data;
    },
  });

  useEffect(() => {
    dispatch(setTabActive(courseId));
    return;
  });

  if (classDetail == undefined) {
    classDetail = {
      id: "Pending...",
      name: "Pending...",
      desc: "Pending...",
      code: "Pending...",
      background: null,
      createdAt: "Pending...",
      attendees: [],
      host: null,
    };
  }

  //TODO: IPLM OVERVIEW COMPONENT AND PEOPLE COMPONENT;

  const items: TabsProps["items"] = [
    {
      label: (
        <>
          <HomeOutlined /> Overview
        </>
      ),
      key: "overview",
      children: (
        <ClassOverview
          classDetail={classDetail as ClassInfoType}
          courseId={courseId}
        />
      ),
    },
    {
      label: (
        <>
          <TeamOutlined /> People
        </>
      ),
      key: "people",
      children: (
        <ClassPeople
          classDetail={classDetail as ClassInfoType}
          courseId={courseId}
        />
      ),
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
      {contextHolder}
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
};

export default ClassPage;
