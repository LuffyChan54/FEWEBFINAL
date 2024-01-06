import {
  CheckCircleOutlined,
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
import { RcFile } from "antd/es/upload";
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
  updateClassOverviewInfo: Function;
  updateClassOverviewBackground: Function;
}

const ClassOverview = ({
  courseId,
  classDetail,
  updateClassOverviewInfo,
  updateClassOverviewBackground,
}: ClassOverviewProps) => {
  const { courseId: currCourseId } = useParams();

  const { user } = useSelector(getAuthReducer);

  const [messageApi, contextHolder] = message.useMessage();
  const [value, copy] = useCopyToClipboard();
  const [isStillLoading, setIsStillLoading] = useState(true);
  const [temporaryBackground, setTemporaryBackground] = useState("");
  const isFinishLoadingFirstTime = useRef(0);
  const bgFile = useRef(null);
  const bgSRC = useRef("");
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

  const updateBackgroundCourse = async (info: any) => {
    bgFile.current = info.file.originFileObj;
    bgSRC.current = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(info.file.originFileObj as RcFile);
      reader.onload = () => resolve(reader.result as string);
    });
    setTemporaryBackground(bgSRC.current);
  };

  const handleChangeBackground = () => {
    updateClassOverviewBackground(bgFile.current, bgSRC.current);
    setTemporaryBackground("");
  };

  const handleUnChangeBackground = () => {
    setTemporaryBackground("");
  };

  return (
    <>
      {isStillLoading ? (
        <Skeleton active />
      ) : (
        <>
          {contextHolder}
          <div
            style={{
              height: "200px",
              width: "100%",
              borderRadius: "5px",
              marginBottom: "20px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={
                temporaryBackground == ""
                  ? classDetail.background
                  : temporaryBackground
              }
              style={{
                height: "200px",
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
              }}
            >
              {temporaryBackground == "" ? (
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  onChange={(info) => updateBackgroundCourse(info)}
                  showUploadList={false}
                >
                  <Button
                    style={{
                      background: "#22b472",
                      color: "#fff",
                      outline: "none",
                      border: "none",
                    }}
                    icon={<UploadOutlined />}
                  ></Button>
                </Upload>
              ) : (
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    style={{
                      background: "#22b472",
                      color: "#fff",
                      outline: "none",
                      border: "none",
                    }}
                    icon={<CheckOutlined />}
                    onClick={handleChangeBackground}
                  ></Button>

                  <Button
                    style={{
                      background: "#ff7875",
                      color: "#fff",
                      outline: "none",
                      border: "none",
                    }}
                    icon={<CloseOutlined />}
                    onClick={handleUnChangeBackground}
                  ></Button>
                </div>
              )}
            </div>
          </div>
          <Descriptions title="Class Info" items={items} />
          <ChangeClassOV
            updateClassOverviewInfo={updateClassOverviewInfo}
            classDetails={classDetail}
          />
        </>
      )}
    </>
  );
};

export default ClassOverview;
