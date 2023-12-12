import {
  HomeOutlined,
  TeamOutlined,
  FileDoneOutlined,
  ReloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { setTabActive } from "@redux/reducer";
import { Tabs, TabsProps, message } from "antd";
import ClassOverview from "components/classOverview/ClassOverview";
import ClassPeople from "components/classPeople/ClassPeople";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ClassEndpointWTID, getClassDetail } from "services/classService";
import useSWR from "swr";
import { ClassInfoType } from "types";

const ClassPage = memo(() => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const [isReloading, setIsReloading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  let {
    isLoading,
    isValidating,
    error,
    data: classDetail,
    mutate,
  } = useSWR(ClassEndpointWTID + courseId, () => getClassDetail(courseId), {
    onSuccess: (data) => {
      console.log("loading");
      setIsReloading(false);
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

  const reloadClassInfo = () => {
    setIsReloading(true);
    mutate();
    // setTimeout(() => {
    //   setIsReloading(false);
    // }, 5000);
  };

  return (
    <>
      {contextHolder}
      {isReloading ? (
        <LoadingOutlined style={{ color: "#24b675", fontSize: "20px" }} />
      ) : (
        <ReloadOutlined
          style={{ color: "#24b675", fontSize: "20px", cursor: "pointer" }}
          onClick={() => reloadClassInfo()}
        />
      )}

      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
});

export default ClassPage;
