import { ToolOutlined } from "@ant-design/icons";
import { getUserFull, setFullUser, update } from "@redux/reducer";
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Form,
  Input,
  Modal,
  Skeleton,
  Tooltip,
  message,
} from "antd";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as userService from "services/userService";
import { UserFullType } from "types";
const UserDetails = memo(() => {
  const [isFetchingUserInfo, setIsFetchingUserInfo] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const userFullInfo: UserFullType = useSelector(getUserFull);
  const dispatch = useDispatch();

  const updatingUserFull = (values: any) => {
    setIsUpdatingUser(true);
    userService
      .updateUser(values)
      .then((res) => {
        messageApi.success("Successfully updated");
        dispatch(setFullUser(res));
        dispatch(update({ name: res.name }));
        setIsModalOpen(false);
      })
      .catch((err) => {
        messageApi.error("Failed to update user");
        console.log("error: ", err);
      })
      .finally(() => {
        setIsUpdatingUser(false);
      });
  };

  useEffect(() => {
    userService
      .getUser()
      .then((res: any) => {
        dispatch(setFullUser(res));
      })
      .catch((err: any) => {
        console.log("fail:", err);
      })
      .finally(() => setIsFetchingUserInfo(false));
    return;
  }, []);

  const items: DescriptionsProps["items"] = [
    {
      key: "name",
      label: "Name",
      children: userFullInfo.name || "",
    },
    {
      key: "nickname",
      label: "Nickname",
      children: userFullInfo.nickname || "",
    },
    {
      key: "givenName",
      label: "Given name",
      children: userFullInfo.givenName || "",
    },
    {
      key: "email",
      label: "Email",
      children: userFullInfo.email || "",
    },
    {
      key: "createdAt",
      label: "Created at",
      children: userFullInfo.createdAt
        ? userFullInfo.createdAt.split("T")[0]
        : "",
    },
  ];

  const studentMappingItems: DescriptionsProps["items"] = [
    {
      key: "dateOfBirth",
      label: "Date of birth",
      children: "07/11/2005",
    },
    {
      key: "studentId",
      label: "Student ID",
      children: "20120500",
    },
    {
      key: "facultyOf",
      label: "Faculty of",
      children: "Toán - Tin học",
    },
    {
      key: "degree",
      label: "Degree",
      children: "Đại học",
    },
  ];
  return (
    <div style={{ width: "600px" }}>
      {isFetchingUserInfo ? (
        <Skeleton active />
      ) : (
        <>
          <Descriptions
            column={2}
            title={
              <div style={{ display: "flex", gap: "10px" }}>
                <h6 style={{ marginBottom: "-2px" }}>User info</h6>

                <Tooltip title="Change user info">
                  <ToolOutlined
                    style={{ cursor: "pointer", color: "#146842" }}
                    onClick={() => showModal()}
                  />
                </Tooltip>
              </div>
            }
            style={{ maxWidth: "600px" }}
            items={items}
          />
          <Descriptions
            column={2}
            title={<h6 style={{ marginBottom: "-2px" }}>Student info</h6>}
            style={{ maxWidth: "600px", marginTop: "10px" }}
            items={studentMappingItems}
          />
        </>
      )}

      <Modal
        title="User info"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 400 }}
          initialValues={{
            name: userFullInfo.name,
            nickname: userFullInfo.nickname,
            givenName: userFullInfo.givenName,
          }}
          onFinish={(values) => updatingUserFull(values)}
          onFinishFailed={() => {}}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nickname"
            name="nickname"
            rules={[{ required: true, message: "Please input your Nickname!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Given Name"
            name="givenName"
            rules={[{ required: true, message: "Please input your Nickname!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button loading={isUpdatingUser} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </div>
  );
});

export default UserDetails;
