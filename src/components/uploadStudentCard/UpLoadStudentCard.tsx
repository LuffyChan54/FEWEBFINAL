import ImgCrop from "antd-img-crop";
import { useState } from "react";
import { Button, Flex, Upload, message } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import "./UpLoadStudentCard.css";
import { bindingImage } from "services/bindingCardService";
const UpLoadStudentCard = () => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const bindingStudentCard = () => {
    setUploading(true);
    const bodyFormData = new FormData();
    console.log("ORIGINAL FILE: ", fileList[0].originFileObj);
    bodyFormData.append("file", fileList[0].originFileObj as any);
    bindingImage(bodyFormData)
      .then((res) => {
        messageApi.success("Success");
      })
      .catch((err) => {
        messageApi.error("Failed! Something went wrong!");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <Flex>
      {contextHolder}
      <div>
        <p>Your Student Card:</p>
        <ImgCrop rotationSlider aspect={1.55}>
          <Upload
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
          >
            {fileList.length < 1 && "+ Upload"}
          </Upload>
        </ImgCrop>
        <Button
          type="primary"
          loading={uploading}
          onClick={() => bindingStudentCard()}
        >
          Mapping your student card.
        </Button>
      </div>
    </Flex>
  );
};

export default UpLoadStudentCard;
