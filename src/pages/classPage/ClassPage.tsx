import {
  HomeOutlined,
  TeamOutlined,
  FileDoneOutlined,
  ReloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  getAuthReducer,
  getClassOVReducer,
  removeClassOV,
  setAlert,
  setTabActive,
} from "@redux/reducer";
import { Tabs, TabsProps, message } from "antd";
import ClassOverview from "components/classOverview/ClassOverview";
import ClassPeople from "components/classPeople/ClassPeople";
import { addClassOptions, removeClassOptions } from "helpers";
import {
  updateClassBackground,
  updateClassOptions,
} from "helpers/class/classOVMutation";
import { changeRoleMutation } from "helpers/remoteOptions/ChangeRoleOptions.";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ClassOVEndpoint } from "services/classOVService";
import {
  ClassEndpointWTID,
  getClassDetail,
  updateBackground,
  updateCourseInfo,
} from "services/classService";
import useSWR, { useSWRConfig } from "swr";
import { ClassInfoType } from "types";

const ClassPage = memo(() => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const [isReloading, setIsReloading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [yourRole, setYourRole] = useState("USER");
  const classOVS = useSelector(getClassOVReducer);
  const { mutate: myMutate } = useSWRConfig();
  const navigate = useNavigate();
  let {
    isLoading,
    isValidating,
    error,
    data: classDetail,
    mutate,
  } = useSWR(ClassEndpointWTID + courseId, () => getClassDetail(courseId), {
    onSuccess: (data) => {
      setIsReloading(false);
      return data;
    },
    onError: (data) => {
      if (data.response.data.message == "not found course") {
        dispatch(removeClassOV({ id: courseId }));
        myMutate(
          ClassOVEndpoint,
          removeClassOptions(courseId, classOVS).optimisticData,
          false
        );
        dispatch(setTabActive("home"));
        navigate("/home");
        dispatch(
          setAlert({
            type: "info",
            value: "This class has not been found!",
          })
        );
      }
    },
  });

  useEffect(() => {
    dispatch(setTabActive(courseId));
    return;
  });

  const { user } = useSelector(getAuthReducer);

  if (classDetail == undefined) {
    classDetail = {
      id: "Pending...",
      name: "Pending...",
      desc: "Pending...",
      code: "Pending...",
      background: "",
      createdAt: "Pending...",
      attendees: [],
      host: null,
    };
  } else {
    if (classDetail.host.userId == user.userId) {
      if (yourRole != "ADMIN") {
        setYourRole("ADMIN");
      }
    } else {
      if (yourRole != "USER") {
        setYourRole("USER");
      }
    }
  }

  const updateClassOverviewInfo = async (newClassOV: any) => {
    try {
      await mutate(
        updateCourseInfo(courseId, newClassOV, classDetail),
        updateClassOptions(newClassOV, classDetail)
      );

      messageApi.open({
        key: "updatingCourse",
        type: "success",
        content: "Success! Update course info 🎉.",
        duration: 2,
      });
    } catch (err) {
      messageApi.open({
        key: "updatingCourse",
        type: "error",
        content: "Failed to update course info.",
        duration: 2,
      });
    }
  };

  const updateClassOverviewBackground = async (bgFile: any, bgFileSRC: any) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("file", bgFile);
      await mutate(
        updateBackground(courseId, bodyFormData, classDetail),
        updateClassBackground(bgFileSRC, classDetail)
      );

      messageApi.open({
        key: "updatingBackground",
        type: "success",
        content: "Success! Update background 🎉.",
        duration: 2,
      });
    } catch (err) {
      messageApi.open({
        key: "updatingBackground",
        type: "error",
        content: "Failed to update background.",
        duration: 2,
      });
    }
  };

  const updateRoleAttendeeDirectly = (values: any) => {
    mutate(changeRoleMutation(classDetail, values));
  };

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
          updateClassOverviewInfo={updateClassOverviewInfo}
          updateClassOverviewBackground={updateClassOverviewBackground}
          yourRole={yourRole}
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
          yourRole={yourRole}
          updateRoleAttendeeDirectly={updateRoleAttendeeDirectly}
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
