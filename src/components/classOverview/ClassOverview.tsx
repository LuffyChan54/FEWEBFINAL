import { CopyOutlined } from "@ant-design/icons";
import { getAuthReducer } from "@redux/reducer";
import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers";
import { Descriptions, DescriptionsProps, Flex, Layout, message } from "antd";
import { useCopyToClipboard } from "hooks";
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
  preload(ClassEndpointWTID + currCourseId, () => getClassDetail(currCourseId));

  console.log("class Detail:", classDetail);

  const { user } = useSelector(getAuthReducer);
  let classInfo: ClassInfoType = classDetail;
  if (classInfo) {
    classInfo = {
      id: "Pending...",
      name: "Pending...",
      desc: "Pending...",
      code: "Pending...",
      background: null,
      createdAt: "Pending...",
      attendees: [],
      host: {
        userId: "Pending...",
        courseId: "Pending...",
        email: "Pending...",
        role: "HOST",
        invitationId: "Pending...",
        joinedAt: "Pending...",
        name: "Pending...",
        picture: "Pending...",
      },
    };
  }

  const [messageApi, contextHolder] = message.useMessage();
  const [value, copy] = useCopyToClipboard();

  const handleCopyToClipboard = () => {
    copy(classInfo?.code);
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
      children: classInfo ? classInfo.name : "pending...",
    },
    {
      key: "class_desc",
      label: "Descriptions",
      children: classInfo ? classInfo.desc : "pending...",
    },
    {
      key: "joined_at",
      label: "Joined At",
      children: myProfile
        ? myProfile.joinedAt?.split("T")[0]
        : classInfo.host?.userId == user?.userId
        ? classInfo.host.joinedAt?.split("T")[0]
        : "Pending...",
    },

    {
      key: "class_code",
      label: "Class code",
      children: (
        <>
          <h6> {classInfo.code} </h6>{" "}
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
      children: classInfo ? classInfo.createdAt.split("T")[0] : "pending...", //TODO: get joined at
    },
    {
      key: "total_attendees",
      label: "Toal Attendees",
      children: classInfo ? classInfo.attendees.length : "pending...",
    },
    {
      key: "Host",
      label: "Host",
      children: classInfo.host ? classInfo.host.name : "Pending...",
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
