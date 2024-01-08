import ImgCrop from "antd-img-crop";
import React, { useState } from "react";
import { Button, Upload, message } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useDispatch, useSelector } from "react-redux";
import { getAuthReducer, update } from "@redux/reducer";
import { UploadOutlined } from "@ant-design/icons";
import { updateAvatar } from "services/authService";
const UploadAvatar = () => {
  const { user } = useSelector(getAuthReducer);

  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "myavatar",
      name: "picture.png",
      status: "done",
      url: user.picture || "",
    },
  ]);

  const handleUploadAvatar = () => {
    setIsUpdatingAvatar(true);
    const bodyFormData = new FormData();
    bodyFormData.append("file", fileList[0].originFileObj as any);
    updateAvatar(bodyFormData)
      .then((res: any) => {
        dispatch(update({ picture: res.picture }));
      })
      .catch((err) => {
        messageApi.error("Error updating avatar");
        console.log("UploadAvatar: failed to upload avatar", err);
      })
      .finally(() => {
        setIsUpdatingAvatar(false);
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
    <div style={{ width: "50px" }}>
      {contextHolder}
      <ImgCrop rotationSlider>
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
        icon={<UploadOutlined />}
        loading={isUpdatingAvatar}
        onClick={() => handleUploadAvatar()}
        style={{ width: "102px" }}
      >
        Change
      </Button>
    </div>
  );
};

export default UploadAvatar;
