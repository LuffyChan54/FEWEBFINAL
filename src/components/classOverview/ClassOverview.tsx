import { CopyOutlined } from "@ant-design/icons";
import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers";
import { Descriptions, DescriptionsProps, Flex, Layout, message } from "antd";
import { Input } from "antd/lib";
import { useCopyToClipboard } from "hooks";
import { ClassInfoType } from "types";
interface ClassOverviewProps {
  classID: string | undefined;
}

const virtualData: ClassInfoType = {
  id: "class_1",
  name: "class_1",
  host_name: "host_1",
  desc: "desc_1",
  code: "HUDYSA823167",
};

const ClassOverview = ({ classID }: ClassOverviewProps) => {
  const classInfo = virtualData;

  const [messageApi, contextHolder] = message.useMessage();
  const [value, copy] = useCopyToClipboard();

  const handleCopyToClipboard = () => {
    copy(classInfo.code);
    messageApi.open({
      key: "copy_success",
      type: "success",
      content: "Copied!",
      duration: 1.5,
    });
  };

  const items: DescriptionsProps["items"] = [
    {
      key: "class_name",
      label: "Class name",
      children: classInfo.name,
    },
    {
      key: "class_desc",
      label: "Descriptions",
      children: classInfo.desc,
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
      key: "4",
      label: "Remark",
      children: "empty",
    },
    {
      key: "5",
      label: "Address",
      children:
        "No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China",
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
