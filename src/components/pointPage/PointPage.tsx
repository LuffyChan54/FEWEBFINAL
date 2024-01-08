import React, { useState } from "react";
import { Button, Modal, Switch, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import FormCreateGrade from "./FormCreateGrade/FormCreateGrade";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const InitialColumns: ColumnsType<DataType> = [
  {
    title: "Full Name",
    width: 100,
    dataIndex: "name",
    key: "name",
    fixed: "left",
  },
  {
    title: "Age",
    width: 100,
    dataIndex: "age",
    key: "age",
    fixed: "left",
  },
  {
    title: "Action",
    key: "operation",
    fixed: "right",
    width: 100,
    render: () => <a>action</a>,
  },
];

//testData
const data: DataType[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

const PointPage = ({ courseId }: any) => {
  const [fixedTop, setFixedTop] = useState(true);
  const [isModalCreateGradeOpen, setIsModalCreateGradeOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [gradeColumns, setGradeColumns] =
    useState<ColumnsType<DataType>>(InitialColumns);
  const handleCancelCreateGrade = () => {
    setIsModalCreateGradeOpen(false);
  };
  return (
    <>
      <div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <Button
            type="primary"
            style={{ outline: "none" }}
            onClick={() => setIsModalCreateGradeOpen(true)}
          >
            Create new Grade Structure
          </Button>
          <Button
            type="primary"
            style={{ background: "#ffc069", outline: "none", color: "#000" }}
          >
            Update Grade Structure
          </Button>
          <Button style={{ outline: "none" }}>View Grade Structure</Button>
        </div>
        <Table
          columns={gradeColumns}
          dataSource={data}
          scroll={{ x: 1500 }}
          summary={() => (
            <Table.Summary fixed={fixedTop ? "top" : "bottom"}>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={1}>
                  <Switch
                    checkedChildren="Fixed Top"
                    unCheckedChildren="Fixed Top"
                    checked={fixedTop}
                    onChange={() => {
                      setFixedTop(!fixedTop);
                    }}
                  />
                </Table.Summary.Cell>
                {/* <Table.Summary.Cell index={2} colSpan={8}>
                  Points
                </Table.Summary.Cell> */}
                {/* <Table.Summary.Cell index={10}>Fix Right</Table.Summary.Cell> */}
              </Table.Summary.Row>
            </Table.Summary>
          )}
          // antd site header height
          sticky={{ offsetHeader: 64 }}
        />
      </div>
      <Modal
        title="Create Grade Structure"
        open={isModalCreateGradeOpen}
        onCancel={handleCancelCreateGrade}
        footer={null}
        destroyOnClose={true}
      >
        <FormCreateGrade
          gradeColumns={gradeColumns}
          setGradeColumns={setGradeColumns}
          courseId={courseId}
          setIsModalCreateGradeOpen={setIsModalCreateGradeOpen}
          messageApi={messageApi}
        />
      </Modal>
      {contextHolder}
    </>
  );
};

export default PointPage;
