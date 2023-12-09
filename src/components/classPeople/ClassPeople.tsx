import { Button, Modal, Space, Table, Tabs, TabsProps, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useRef, useState } from "react";

interface ClassPeopleProps {
  classID: string | undefined;
}

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: any) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "11",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "22",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "33",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "12",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "23",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "34",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "14",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "25",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "36",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const ClassPeople = ({ classID }: ClassPeopleProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            dataSource={data}
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

          <Table columns={columns} virtual scroll={{ x: 1000, y: 1000 }} />
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
