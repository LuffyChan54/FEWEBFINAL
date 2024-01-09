import { Button, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { UserStudentCard } from "types";

interface DataType {
  key: string;
  studentId?: string;
  email?: string;
  name?: string;
  birthday?: string;
  role?: string;
  blocked: boolean;
}

const UserList = ({
  users,
  handleActive,
}: {
  users: UserStudentCard[];
  handleActive: (userId: string, isActive: boolean) => void;
}) => {
  const header: ColumnsType<DataType> = [
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_, { role }) => {
        const color = role === "ADMIN" ? "geekblue" : "green";
        return (
          <Tag color={color} key={role}>
            {role || "USER"}
          </Tag>
        );
      },
    },
    {
      title: "Blocked",
      dataIndex: "blocked",
      key: "blocked",
      render: (_, { blocked }) => {
        const color = blocked === true ? "volcano" : "green";
        const key = blocked === true ? "Blocked" : "Active";
        return (
          <Tag color={color} key={key}>
            {key}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, { blocked, key }) => {
        return blocked ? (
          <Button type="primary" ghost onClick={() => handleActive(key, false)}>
            Active
          </Button>
        ) : (
          <Button danger onClick={() => handleActive(key, true)}>
            block
          </Button>
        );
      },
    },
  ];
  const dataSource = users.map((user) => ({
    studentId: user.studentCard?.studentId || "",
    email: user.email,
    name: user.name,
    birthday: user.studentCard?.birthday || "",
    role: user.userMetadata?.role,
    blocked: user.blocked || false,
    key: user.userId,
  }));
  return <Table dataSource={dataSource} columns={header} />;
};

export default UserList;
