import { Button, Modal, Space, Table, Tabs, TabsProps, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useRef, useState } from "react";
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
    setIsModalOpen(false);
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
          <Button type="primary" onClick={() => showModal()}>
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
          <Button type="primary" onClick={() => showModal()}>
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
      <Modal
        key="class_people_invite_student"
        title="Invite By Email"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
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
