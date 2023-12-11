import {
  Button,
  Input,
  Modal,
  Space,
  Table,
  Tabs,
  TabsProps,
  Tag,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useRef, useState } from "react";
import { sendInvitationEmail } from "services/inviteService";
import { Attendee, ClassInfoType } from "types";

interface ClassPeopleProps {
  courseId: string | undefined;
  classDetail: ClassInfoType;
}

interface dataTableType
  extends Omit<Attendee, "userId" | "courseId" | "invitationId" | "picture"> {
  key: any;
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
  {
    title: "Action",
    key: "action",
    render: (_) => (
      <Space size="middle">
        <a>Delete</a>
      </Space>
    ),
  },
];

const ClassPeople = ({ courseId, classDetail }: ClassPeopleProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stateFormInvateRef = useRef("");
  const inputAntdRef: any = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
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
            columns={columns}
            dataSource={Students}
            virtual
            scroll={{ x: 1000, y: 1000 }}
          />
        </>
      ),
    },
  ];

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
    </>
  );
};

export default ClassPeople;
