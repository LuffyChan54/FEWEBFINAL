import { getAuthReducer } from "@redux/reducer";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tabs,
  TabsProps,
  Tag,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { getAuth } from "firebase/auth";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  ClassEndpointWTID,
  changeRole,
  getClassDetail,
} from "services/classService";
import { sendInvitationEmail } from "services/inviteService";
import { preload } from "swr";
import { Attendee, ClassInfoType } from "types";

interface ClassPeopleProps {
  courseId: string | undefined;
  classDetail: ClassInfoType;
  yourRole: String;
}

interface dataTableType
  extends Omit<Attendee, "userId" | "courseId" | "invitationId" | "picture"> {
  key: any;
}

const ClassPeople = ({ courseId, classDetail, yourRole }: ClassPeopleProps) => {
  // preload(ClassEndpointWTID + courseId, () => getClassDetail(courseId));

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stateFormInvateRef = useRef("");
  const inputAntdRef: any = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [initChangeRoleValues, setInitChangeRoleValues] = useState({});
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const { Option } = Select;
  let currentRole = yourRole;
  const { user } = useSelector(getAuthReducer);

  if (classDetail.host != null) {
    if (user.userId == classDetail.host.userId) {
      currentRole = "HOST";
    } else {
      classDetail.attendees.forEach((attendee) => {
        if (attendee.userId == user.userId) {
          currentRole = attendee.role;
        }
      });
    }
  }

  const columns: ColumnsType<dataTableType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Joined At",
      dataIndex: "joinedAt",
      key: "joinedAt",
    },
  ];

  if (currentRole != "STUDENT") {
    const actionObj = {
      title: "Action",
      key: "action",
      render: (value: any) => {
        if (currentRole == "HOST") {
          return (
            <Space size="middle">
              {value.role != "HOST" && (
                <>
                  <Button onClick={() => handleChangeRole(value)}>
                    Change role
                  </Button>
                  <Button danger onClick={() => handleRemove(value)}>
                    Remove
                  </Button>
                </>
              )}
            </Space>
          );
        }

        if (currentRole == "TEACHER") {
          return (
            <Space size="middle">
              {value.role == "STUDENT" && (
                <>
                  {/* <Button onClick={() => handleChangeRole(value)}>
                    Change role
                  </Button> */}
                  <Button danger onClick={() => handleRemove(value)}>
                    Remove
                  </Button>
                </>
              )}
            </Space>
          );
        }
      },
    };
    columns.push(actionObj);
  }

  const handleChangeRole = (value: any) => {
    form.setFieldsValue({
      name: value.name,
      attendeeId: value.key,
      role: value.role,
    });
    setInitChangeRoleValues({
      name: value.name,
      attendeeId: value.key,
      role: value.role,
    });
    setIsChangeRoleOpen(true);
  };
  const handleRemove = (value: any) => {};

  let Teachers: dataTableType[] = [];
  let Students: dataTableType[] = [];
  classDetail.attendees.forEach((el) => {
    if (el.role == "HOST" || el.role == "TEACHER") {
      Teachers.push({
        key: el.userId,
        name: el.name,
        email: el.email,
        role: el.role,
        joinedAt: el.joinedAt?.split("T")[0],
      });
    }

    if (el.role == "STUDENT") {
      Students.push({
        key: el.userId,
        name: el.name,
        email: el.email,
        role: el.role,
        joinedAt: el.joinedAt?.split("T")[0],
      });
    }
  });

  if (classDetail.host != null) {
    Teachers.push({
      key: classDetail.host.userId,
      name: classDetail.host.name,
      email: classDetail.host.email,
      role: classDetail.host.role,
      joinedAt: classDetail.host.joinedAt?.split("T")[0],
    });
  }

  const typeInviteRef = useRef("Teachers");

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    const emailsStr = inputAntdRef.current.input.value;
    setIsModalOpen(false);
    messageApi.open({
      key: "inviteTeacher",
      type: "loading",
      content: "Loading...",
      duration: 0,
    });
    let dataInvite = [];
    if (stateFormInvateRef.current === "teacher") {
      dataInvite = emailsStr.split(",").map((e: any) => {
        return {
          email: e.trim(),
          role: "TEACHER",
        };
      });
    }

    if (stateFormInvateRef.current === "student") {
      dataInvite = emailsStr.split(",").map((e: any) => {
        return {
          email: e.trim(),
          role: "STUDENT",
        };
      });
    }

    sendInvitationEmail(dataInvite, courseId)
      .then(() => {
        messageApi.open({
          key: "inviteTeacher",
          type: "success",
          content: "Success! Invited! 🎉.",
          duration: 2,
        });
      })
      .catch(() => {
        messageApi.open({
          key: "inviteTeacher",
          type: "error",
          content: "Fail! Invite Failed.",
          duration: 2,
        });
      });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const TabPeople: TabsProps["items"] = [
    {
      label: "Teachers",
      key: "Teachers",
      children: (
        <>
          <Button
            type="primary"
            onClick={() => {
              stateFormInvateRef.current = "teacher";
              showModal();
            }}
          >
            Invite New Teacher
          </Button>
          <Table
            key="tableteacher"
            columns={columns}
            dataSource={Teachers}
            virtual
            scroll={{ x: 1000, y: 1000 }}
          />
        </>
      ),
    },
    {
      label: "Students",
      key: "Students",
      children: (
        <>
          <Button
            type="primary"
            onClick={() => {
              stateFormInvateRef.current = "student";
              showModal();
            }}
          >
            Invite New Student
          </Button>

          <Table
            key="tablestudent"
            columns={columns}
            dataSource={Students}
            virtual
            scroll={{ x: 1000, y: 1000 }}
          />
        </>
      ),
    },
  ];

  const handleCancelChangeRole = () => {
    setIsChangeRoleOpen(false);
  };
  const handleChangeRoleFinish = (values: any) => {
    setIsUpdatingRole(true);
    changeRole(courseId, values)
      .then((res) => {
        messageApi.success("Update role successfully");
        setIsChangeRoleOpen(false);
      })
      .catch((err) => {
        console.log("ClassPeople: Failed to update role", err);
        messageApi.error("Failed to update role");
      })
      .finally(() => {
        setIsUpdatingRole(false);
      });
  };
  return (
    <>
      {contextHolder}
      <Modal
        key="class_people_invite_student"
        title="Invite By Email"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input ref={inputAntdRef} type="email" placeholder="email" />
      </Modal>
      <Tabs
        defaultActiveKey="Teachers"
        type="card"
        size="middle"
        items={TabPeople}
        onTabClick={(v) => (typeInviteRef.current = v)}
      />

      <Modal
        title="Change Role"
        open={isChangeRoleOpen}
        onCancel={handleCancelChangeRole}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 400 }}
          initialValues={initChangeRoleValues}
          onFinish={handleChangeRoleFinish}
          onFinishFailed={() => {}}
          autoComplete="off"
          form={form}
        >
          <Form.Item label="Attendee Name" name="name">
            <Input disabled />
          </Form.Item>

          <Form.Item hidden label="Descriptions" name="attendeeId">
            <Input disabled />
          </Form.Item>

          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Attendee role">
              {currentRole == "HOST" && (
                <>
                  <Option value="HOST">HOST</Option>
                  <Option value="TEACHER">TEACHER</Option>
                  <Option value="STUDENT">STUDENT</Option>
                </>
              )}
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button loading={isUpdatingRole} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ClassPeople;
