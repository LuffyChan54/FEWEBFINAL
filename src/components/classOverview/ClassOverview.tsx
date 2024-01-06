import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { getAuthReducer } from "@redux/reducer";
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Flex,
  Layout,
  Skeleton,
  Upload,
  UploadProps,
  message,
} from "antd";
import ChangeClassOV from "components/changeClassOV/ChangeClassOV";
import { useCopyToClipboard } from "hooks";
import { useEffect, useRef, useState } from "react";
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
  const [isStillLoading, setIsStillLoading] = useState(true);

  const isFinishLoadingFirstTime = useRef(0);
  if (classDetail.code != "Pending...") {
    isFinishLoadingFirstTime.current++;
    if (isFinishLoadingFirstTime.current == 1) {
      setIsStillLoading(false);
    }
  }

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

  // const props: UploadProps = {
  //   name: "file",
  //   action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
  //   onChange(info) {
  //     if (info.file.status !== "uploading") {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (info.file.status === "done") {
  //       console.log(info);
  //       message.success(`${info.file.name} file uploaded successfully`);
  //     } else if (info.file.status === "error") {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };

  return (
    <>
      {isStillLoading ? (
        <Skeleton active />
      ) : (
        <>
          {contextHolder}
          <div
            style={{
              background: `url("https://th.bing.com/th/id/R.0d9b24189f42fb3f2563ef854b41ab0f?rik=QROqPZ61pRQ2IQ&pid=ImgRaw&r=0")`,
              height: "200px",
              width: "100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              borderRadius: "5px",
              marginBottom: "20px",
              position: "relative",
              padding: "10px",
            }}
          ></div>
          <Descriptions title="Class Info" items={items} />
          <ChangeClassOV classDetails={classDetail} />
        </>
      )}
    </>
  );
};

export default ClassOverview;
