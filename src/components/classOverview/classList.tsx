import { Button, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { uniq, uniqBy } from "lodash";
import moment from "moment";
import { ClassInfoType } from "types";

interface DataType {
  key: string;
  hosted?: string;
  name?: string;
  desc?: string;
  code?: string;
  createdAt?: string;
  isActive?: boolean;
}

const ClassList = ({
  classes,
  handleActive,
  isTableLoading,
}: {
  classes: ClassInfoType[];
  handleActive: (userId: string, isActive: boolean) => void;
  isTableLoading: boolean;
}) => {
  const header: ColumnsType<DataType> = [
    {
      title: "Hosted",
      dataIndex: "hosted",
      key: "hosted",
      filters: uniqBy(
        classes.map((_class) => ({
          text: _class.host?.name || "",
          value: _class.host?.name || "",
        })),
        "value"
      ),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => {
        return !record.hosted ? true : record.hosted.includes(value.toString());
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Desc",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) =>
        moment(a.createdAt).toDate() > moment(b.createdAt).toDate() ? 1 : 0,
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      filters: [
        { text: "active", value: true },
        { text: "inActive", value: false },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.isActive === value.valueOf(),
      render: (_, { isActive }) => {
        const color = isActive === false ? "volcano" : "green";
        const key = isActive === true ? "Active" : "Inactive";
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
      render: (_, { isActive, key }) => {
        const blockedBtn = !isActive ? (
          <Button type="primary" ghost onClick={() => handleActive(key, true)}>
            Active
          </Button>
        ) : (
          <Button danger onClick={() => handleActive(key, false)}>
            Inactive
          </Button>
        );
        return blockedBtn;
      },
    },
  ];

  const dataSource = classes.map((_class) => ({
    key: _class.id,
    hosted: _class.host?.name,
    name: _class.name,
    desc: _class.desc,
    code: _class.code,
    createdAt: moment(_class.createdAt).format("DD/MM/YYYY"),
    isActive: _class.isActive,
  }));
  return (
    <Table loading={isTableLoading} dataSource={dataSource} columns={header} />
  );
};

export default ClassList;
