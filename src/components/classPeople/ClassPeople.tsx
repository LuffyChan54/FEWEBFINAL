import {
  DownloadOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
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
  Upload,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { getAuth } from "firebase/auth";
import { changeRoleMutation } from "helpers/remoteOptions/ChangeRoleOptions.";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ClassOVEndpoint } from "services/classOVService";
import {
  ClassEndpointWTID,
  changeRole,
  downloadTemplate,
  getClassDetail,
  removeAttendee,
  uploadListStudent,
} from "services/classService";
import { sendInvitationEmail } from "services/inviteService";
import { preload, useSWRConfig } from "swr";
import { Attendee, ClassInfoType } from "types";

interface ClassPeopleProps {
  courseId: string | undefined;
  classDetail: ClassInfoType;
  yourRole: String;
  updateRoleAttendeeDirectly: Function;
  removeAttendeeDirectly: Function;
  StudentInCourse: any;
  mutateStudents: any;
}

interface dataTableType
  extends Omit<Attendee, "userId" | "courseId" | "invitationId" | "picture"> {
  key: any;
}

const ClassPeople = ({
  courseId,
  classDetail,
  yourRole,
  updateRoleAttendeeDirectly,
  removeAttendeeDirectly,
  StudentInCourse,
  mutateStudents,
}: ClassPeopleProps) => {
  // preload(ClassEndpointWTID + courseId, () => getClassDetail(courseId));

  const { mutate } = useSWRConfig();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stateFormInvateRef = useRef("");
  const inputAntdRef: any = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [initChangeRoleValues, setInitChangeRoleValues] = useState({});
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const { Option } = Select;
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingUploadStudent, setIsLoadingUploadStudent] = useState(false);
  let currentRole = yourRole;
  const { user } = useSelector(getAuthReducer);
  // const [studentsInClass, setStudentsInClass] = useState(newStudents);
  const [openRemoveAttendee, setOpenRemoveAttendee] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [removeAttendeeInfoCard, setRemoveAttendeeInfoCard] = useState<any>({
    name: "",
  });
  const handleCancelRemove = () => {
    setOpenRemoveAttendee(false);
  };

  if (StudentInCourse == null || StudentInCourse == undefined) {
    StudentInCourse = [];
  }

  const studentsInClass = StudentInCourse.map((student: any) => {
    return {
      ...student,
      key: student.studentId,
    };
  });

  const handleOKRemove = () => {
    setConfirmLoading(true);
    removeAttendee(courseId, removeAttendeeInfoCard.key)
      .then((res: any) => {
        messageApi.success("Remove attendee successfully");
        setOpenRemoveAttendee(false);
        removeAttendeeDirectly(removeAttendeeInfoCard.key);
      })
      .catch((err: any) => {
        console.log("ClassPeople: Failed to remove", err);
        messageApi.error("Failed to remove attendee");
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

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

  const columnsStudentsInClass: ColumnsType<any> = [
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
                  <Button
                    style={{ outline: "none" }}
                    onClick={() => handleChangeRole(value)}
                  >
                    Change role
                  </Button>
                  <Button
                    style={{ outline: "none" }}
                    danger
                    onClick={() => handleRemove(value)}
                  >
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
                  <Button
                    style={{ outline: "none" }}
                    danger
                    onClick={() => handleRemove(value)}
                  >
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
  const handleRemove = (value: any) => {
    setRemoveAttendeeInfoCard(value);
    setOpenRemoveAttendee(true);
  };

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

  const handleDownloadTemplate = () => {
    setIsDownloading(true);
    downloadTemplate(courseId)
      .then(() => {
        messageApi.success("Successfully downloaded");
      })
      .catch((err) => {
        console.log("ClassPeople: Failed to download", err);
        messageApi.error("Failed to download");
      })
      .finally(() => {
        setIsDownloading(false);
      });
  };

  const importFileXLSX = (info: any) => {
    setIsLoadingUploadStudent(true);
    if (info.file.status !== "uploading") {
      const bodyFormData = new FormData();
      bodyFormData.append("file", info.file.originFileObj);
      uploadListStudent(courseId, bodyFormData)
        .then((res: any) => {
          messageApi.success("Successfully uploaded");
          const tempStudentInClass: any = [];
          mutateStudents(res);
          res.forEach((student: any) => {
            tempStudentInClass.push({
              key: student.studentId,
              name: student.fullname,
              studentId: student.studentId,
            });
          });
          // setStudentsInClass(tempStudentInClass);
        })
        .catch((err) => {
          messageApi.error("Upload failed");
          console.log("ClassPeople: Failed to upload", err);
        })
        .finally(() => {
          setIsLoadingUploadStudent(false);
        });
    }
  };
  const TabPeople: TabsProps["items"] = [
    {
      label: "Teachers",
      key: "Teachers",
      children: (
        <>
          {currentRole == "HOST" && (
            <Button
              icon={<UserAddOutlined />}
              style={{ marginBottom: "10px" }}
              type="primary"
              onClick={() => {
                stateFormInvateRef.current = "teacher";
                showModal();
              }}
            >
              Invite New Teacher
            </Button>
          )}
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
            icon={<UserAddOutlined />}
            style={{
              marginBottom: "10px",
            }}
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
    {
      label: "Students In Course",
      key: "StudentsInCourse",
      children: (
        <>
          {currentRole == "HOST" && (
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <Upload
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                onChange={(info) => importFileXLSX(info)}
                showUploadList={false}
              >
                <Button
                  style={{
                    background: "#22b472",
                    color: "#fff",
                    outline: "none",
                    border: "none",
                  }}
                  icon={<ExportOutlined />}
                  type="primary"
                  loading={isLoadingUploadStudent}
                >
                  Import file xlsx
                </Button>
              </Upload>

              <Button
                loading={isDownloading}
                icon={<DownloadOutlined />}
                style={{ outline: "none" }}
                onClick={() => handleDownloadTemplate()}
              >
                Download template
              </Button>
            </div>
          )}

          <Table
            key="tableStudentInClass"
            columns={columnsStudentsInClass}
            dataSource={studentsInClass}
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
        updateRoleAttendeeDirectly(values);
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
      <Modal
        title={
          <>
            <ExclamationCircleOutlined
              style={{ color: "#ffc069", marginRight: "10px" }}
            />{" "}
            Remove Attendee
          </>
        }
        open={openRemoveAttendee}
        onOk={handleOKRemove}
        confirmLoading={confirmLoading}
        onCancel={handleCancelRemove}
        okButtonProps={{ danger: true }}
      >
        <p>Do you want to remove {removeAttendeeInfoCard.name}?</p>
      </Modal>
    </>
  );
};

export default ClassPeople;
