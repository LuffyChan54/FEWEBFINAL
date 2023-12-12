import { CopyOutlined } from "@ant-design/icons";
import { getAuthReducer } from "@redux/reducer";
import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers";
import { Descriptions, DescriptionsProps, Flex, Layout, message } from "antd";
import { useCopyToClipboard } from "hooks";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ClassEndpointWTID, getClassDetail } from "services/classService";
import { preload } from "swr";
import { Attendee, ClassInfoType } from "types";
interface ClassOverviewProps {
  courseId: string | undefined;
  classDetail: ClassInfoType;
}

const ClassOverview = ({ courseId, classDetail }: ClassOverviewProps) => {
  const { courseId: currCourseId } = useParams();

  const { user } = useSelector(getAuthReducer);

  const [messageApi, contextHolder] = message.useMessage();
  const [value, copy] = useCopyToClipboard();

  const isFinishLoadingFirstTime = useRef(0);

  useEffect(() => {
    if (classDetail.code === "Pending...") {
      messageApi.open({
        key: "getCourseOV",
        type: "loading",
        content: "Loading...",
        duration: 0,
      });
    } else {
      isFinishLoadingFirstTime.current++;
      if (isFinishLoadingFirstTime.current == 1) {
        messageApi.open({
          key: "getCourseOV",
          type: "success",
          content: "Success! Loaded course Info 🎉.",
          duration: 2,
        });
      }
    }
    return;
  });

  const handleCopyToClipboard = () => {
    copy(classDetail?.code);
    messageApi.open({
      key: "copy_success",
      type: "success",
      content: "Copied!",
      duration: 1.5,
    });
  };

  const getProfileFromAttendees = (userId: any, attendees: any[]): Attendee => {
    let result = undefined;
    for (let i = 0; i < attendees.length; i++) {
      if (attendees[i]?.userId == userId) {
        result = attendees[i];
        break;
      }
    }

    return result;
  };

  let myProfile = undefined;
  myProfile = getProfileFromAttendees(user?.userId, classDetail.attendees);

  const items: DescriptionsProps["items"] = [
    {
      key: "class_name",
      label: "Class name",
      children: classDetail ? classDetail.name : "pending...",
    },
    {
      key: "class_desc",
      label: "Descriptions",
      children: classDetail ? classDetail.desc : "pending...",
    },
    {
      key: "joined_at",
      label: "Joined At",
      children: myProfile
        ? myProfile.joinedAt?.split("T")[0]
        : classDetail.host?.userId == user?.userId
        ? classDetail.host.joinedAt?.split("T")[0]
        : "Pending...",
    },

    {
      key: "class_code",
      label: "Class code",
      children: (
        <>
          <h6> {classDetail.code} </h6>{" "}
          <CopyOutlined
            style={{ marginLeft: "10px", marginTop: "2px", cursor: "pointer" }}
            onClick={handleCopyToClipboard}
          />
        </>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      children: classDetail
        ? classDetail.createdAt.split("T")[0]
        : "pending...", //TODO: get joined at
    },
    {
      key: "total_attendees",
      label: "Toal Attendees",
      children: classDetail ? classDetail.attendees.length + 1 : "pending...",
    },
    {
      key: "Host",
      label: "Host",
      children: classDetail.host ? classDetail.host.name : "Pending...",
    },
  ];
  return (
    <>
      {contextHolder}
      <Descriptions title="Class Info" items={items} />
    </>
  );
};

export default ClassOverview;
