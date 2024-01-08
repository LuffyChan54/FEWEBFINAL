import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import {
  getStudentInfo,
  getUserFull,
  setFullUser,
  setStudentInfo,
  studentInfoReducer,
  update,
} from "@redux/reducer";
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
import {
  updateStudentInfoCard,
  removeStudentInfoCard,
} from "services/studentInfoService";
import { UserFullType } from "types";
import {
  StudentInfoType,
  initStudentInfoType,
} from "types/user/StudentInfoType";
const UserDetails = memo(
  ({
    isFetchingUserInfo,
    isFetchingStudentInfo,
  }: {
    isFetchingUserInfo: any;
    isFetchingStudentInfo: any;
  }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalStudentOpen, setIsModalStudentOpen] = useState(false);
    const [openRemoveMapping, setOpenRemoveMapping] = useState(false);
    const [isUpdatingUser, setIsUpdatingUser] = useState(false);
    const [isUpdatingStudentInfo, setIsUpdatingStudentInfo] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const userFullInfo: UserFullType = useSelector(getUserFull);
    const studentInfo: StudentInfoType = useSelector(getStudentInfo);

    const dispatch = useDispatch();
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const showModalStudent = () => {
      if (studentInfo.id == "") {
        return;
      }
      setIsModalStudentOpen(true);
    };
    const handleStudentCancel = () => {
      setIsModalStudentOpen(false);
    };

    const handleOKRemoveMapping = () => {
      setConfirmLoading(true);
      removeStudentInfoCard(studentInfo.id)
        .then((res) => {
          dispatch(setStudentInfo(initStudentInfoType));
          setOpenRemoveMapping(false);
        })
        .catch((err) => {
          messageApi.error("Remove mapping failed!");
          console.log("UserDetails: fail remove mapping ", err);
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    };

    const handleCancelRemoveMapping = () => {
      setOpenRemoveMapping(false);
    };

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

    const updatingStudentInfo = (values: any) => {
      setIsUpdatingStudentInfo(true);
      updateStudentInfoCard(studentInfo.id, values)
        .then((res) => {
          messageApi.success("Successfully updated");
          dispatch(setStudentInfo(res));
          setIsModalStudentOpen(false);
        })
        .catch((err) => {
          messageApi.error("Failed to update student info");
          console.log("UserDetails: error update student info ", err);
        })
        .finally(() => {
          setIsUpdatingStudentInfo(false);
        });
    };

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
        key: "studentId",
        label: "Student ID",
        children: studentInfo.studentId || "",
      },
      {
        key: "name",
        label: "Name",
        children: studentInfo.name || "",
      },
      {
        key: "birthday",
        label: "Day of birth",
        children: studentInfo.birthday || "",
      },
      {
        key: "cardExpiration",
        label: "Expiration",
        children: studentInfo.cardExpiration || "",
      },
      {
        key: "degree",
        label: "Degree",
        children: studentInfo.degree || "",
      },
      {
        key: "department",
        label: "Faculty",
        children: studentInfo.department || "",
      },
      {
        key: "universityName",
        label: "University name",
        children: studentInfo.universityName || "",
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
          </>
        )}

        {isFetchingStudentInfo ? (
          <Skeleton active />
        ) : (
          <>
            <Descriptions
              column={2}
              title={
                <div style={{ display: "flex", gap: "10px" }}>
                  <h6 style={{ marginBottom: "-2px" }}>Student info</h6>
                  <Tooltip
                    title={
                      studentInfo.id == ""
                        ? "Mapping your student card first!"
                        : "Change student info"
                    }
                  >
                    <ToolOutlined
                      style={{
                        cursor: "pointer",
                        color: studentInfo.id == "" ? "#fa541c" : "#146842",
                      }}
                      onClick={() => showModalStudent()}
                    />
                  </Tooltip>

                  {studentInfo.id != "" && (
                    <Tooltip title="Remove mapping">
                      <DeleteOutlined
                        style={{ cursor: "pointer", color: "#ff7875" }}
                        onClick={() => setOpenRemoveMapping(true)}
                      />
                    </Tooltip>
                  )}
                </div>
              }
              style={{ maxWidth: "600px", marginTop: "10px" }}
              items={studentMappingItems}
            />
          </>
        )}

        <Modal
          key="modal-user-info"
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
              rules={[
                { required: true, message: "Please input your Nickname!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Given Name"
              name="givenName"
              rules={[
                { required: true, message: "Please input your Nickname!" },
              ]}
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

        <Modal
          key="modal-student-info"
          title="Student info"
          open={isModalStudentOpen}
          footer={null}
          onCancel={handleStudentCancel}
        >
          <Form
            name="student"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 400 }}
            initialValues={{
              studentId: studentInfo.studentId,
              name: studentInfo.name,
              birthday: studentInfo.birthday,
              cardExpiration: studentInfo.cardExpiration,
              degree: studentInfo.degree,
              department: studentInfo.department,
              universityName: studentInfo.universityName,
            }}
            onFinish={(values) => updatingStudentInfo(values)}
            onFinishFailed={() => {}}
            autoComplete="off"
          >
            <Form.Item
              name="studentId"
              label="Student ID"
              rules={[
                { required: true, message: "Please input your student ID!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input your Name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="birthday"
              label="Day of birth"
              rules={[
                { required: true, message: "Please input your Day of birth!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="cardExpiration"
              label="Expiration"
              rules={[
                { required: true, message: "Please input your Expiration!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="degree"
              label="Degree"
              rules={[{ required: true, message: "Please input your Degree!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="department"
              label="Faculty"
              rules={[
                { required: true, message: "Please input your Faculty!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="universityName"
              label="University name"
              rules={[
                {
                  required: true,
                  message: "Please input your University name!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                loading={isUpdatingStudentInfo}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={
            <>
              {" "}
              <ExclamationCircleOutlined style={{ color: "#ffc069" }} /> Remove
              Mapping{" "}
            </>
          }
          open={openRemoveMapping}
          onOk={handleOKRemoveMapping}
          confirmLoading={confirmLoading}
          onCancel={handleCancelRemoveMapping}
          okButtonProps={{ danger: true }}
        >
          <p>
            When remove mapping all your student info will be removed. <br /> Do
            you want to remove mapping?
          </p>
        </Modal>

        {contextHolder}
      </div>
    );
  }
);

export default UserDetails;
