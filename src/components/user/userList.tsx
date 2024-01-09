import { Button, Dropdown, Flex, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { sortBy } from "lodash";
import { Link, useNavigate } from "react-router-dom";
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
  isTableLoading,
}: {
  users: UserStudentCard[];
  handleActive: (userId: string, isActive: boolean) => void;
  isTableLoading: boolean;
}) => {
  const navigate = useNavigate();
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
      filters: [
        { text: "blocked", value: true },
        { text: "active", value: false },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.blocked === value.valueOf(),
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
        const blockedBtn = blocked ? (
          <Button
            type="primary"
            ghost
            onClick={(e) => {
              e.stopPropagation();
              handleActive(key, false);
            }}
          >
            Active
          </Button>
        ) : (
          <Button
            danger
            onClick={(e) => {
              e.stopPropagation();
              handleActive(key, true);
            }}
          >
            Block
          </Button>
        );
        return blockedBtn;
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
  return (
    <Table
      onRow={(row) => ({
        onClick: () => navigate(`/admin/course?userId=${row.key}`),
      })}
      style={{ cursor: "pointer" }}
      loading={isTableLoading}
      dataSource={sortBy(dataSource, "blocked")}
      columns={header}
    />
  );
};

export default UserList;
