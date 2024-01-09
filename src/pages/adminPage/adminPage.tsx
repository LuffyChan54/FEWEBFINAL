import {
  blockUserAction,
  getAdminReducer,
  getUsersAction,
  importUserAction,
} from "@redux/reducer";
import UserList from "components/user/userList";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStudentCardMappingTemplate,
  getUserStudentCard,
  getUsers,
  mappingStudentCard,
  toggleActiveUser,
} from "services/adminService";
import BPromise from "bluebird";
import { UserFullType } from "types";
import { Button, Flex, Space, Upload, message } from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";

const AdminPage = () => {
  const { users } = useSelector(getAdminReducer);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isTableLoading, setTableLoading] = useState(true);

  const handleActive = async (userId: string, isActive: boolean) => {
    toggleActiveUser(userId, isActive).then((user) => {
      dispatch(blockUserAction(user));
      messageApi.open({
        key: `${isActive ? "Blocked" : "Active"} user successfully!`,
        type: "success",
        content: `${isActive ? "Blocked" : "Active"} user successfully!`,
        duration: 1.5,
      });
    });
  };

  const handleDownloadStudentTemplate = () => {
    getStudentCardMappingTemplate().then((data) => {
      messageApi.open({
        key: `download successfully!`,
        type: "success",
        content: `download successfully!`,
        duration: 1.5,
      });
    });
  };

  const handleMappingStudent = (data: any) => {
    const bodyFormData = new FormData();
    bodyFormData.append("file", data.file.originFileObj);
    setTableLoading(true);
    mappingStudentCard(bodyFormData).then((users) => {
      dispatch(importUserAction(users));
      setTableLoading(false);
      messageApi.open({
        key: `Mapping student id successfully!`,
        type: "success",
        content: `Mapping student id successfully!`,
        duration: 1.5,
      });
    });
  };

  useEffect(() => {
    const getUserStudent = async () => {
      setTableLoading(true);
      const users = await getUsers();
      const res = await BPromise.map(
        users,
        async (user: UserFullType) => {
          try {
            const studentCard = await getUserStudentCard(user.userId);
            return {
              ...user,
              studentCard,
            };
          } catch (err) {
            return {
              ...user,
              studentCard: null,
            };
          }
        },
        { concurrency: 4 }
      );
      return res.filter(Boolean);
    };

    getUserStudent().then((users) => {
      dispatch(getUsersAction(users));
      setTableLoading(false);
    });
  }, []);

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      {contextHolder}
      <Flex gap={"small"} align="flex-start" justify="flex-end">
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => handleDownloadStudentTemplate()}
        >
          Download Template
        </Button>
        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          onChange={(info) => handleMappingStudent(info)}
          showUploadList={false}
        >
          <Button type="primary" icon={<UploadOutlined />}>
            Upload Template
          </Button>
        </Upload>
      </Flex>
      <UserList
        isTableLoading={isTableLoading}
        users={users}
        handleActive={handleActive}
      />
    </Space>
  );
};

export default AdminPage;
