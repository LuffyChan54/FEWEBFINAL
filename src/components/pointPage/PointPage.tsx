import React, { useEffect, useReducer, useRef, useState } from "react";
import { Button, Modal, Switch, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import FormCreateGrade from "./FormCreateGrade/FormCreateGrade";
import { getFullGradeData } from "services/gradeService";
import { GradeType, ReturnCreateGrade } from "types/grade/returnCreateGrade";
import { getAllGradesIntoColumns } from "utils/getAllGrades";
import TreeGradeStructure from "./FormCreateGrade/TreeGradeStructure";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const InitialColumns: ColumnsType<DataType> = [
  {
    title: "Full Name",
    width: "15%",
    dataIndex: "name",
    key: "name",
    fixed: "left",
  },
  {
    title: "Student ID",
    width: "15%",
    dataIndex: "studentId",
    key: "studentId",
    fixed: "left",
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Action",
    key: "operation",
    fixed: "right",
    width: "10%",
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

const FIXED_COLUMN = 8;

const PointPage = ({ courseId }: any) => {
  const [fixedTop, setFixedTop] = useState(true);
  const [isModalCreateGradeOpen, setIsModalCreateGradeOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [gradeStructureId, setGradeStructureId] = useState<any>("");
  const [isModalViewGradeOpen, setIsModalViewGradeOpen] = useState(false);
  const [widthOfScrollX, setWidthOfScrollX] = useState("162.5%");
  const [fullGradeStructure, setFullGradeStructure] = useState<GradeType[]>([]);
  const [gradeColumns, setGradeColumns] =
    useState<ColumnsType<DataType>>(InitialColumns);
  const handleCancelCreateGrade = () => {
    setIsModalCreateGradeOpen(false);
  };

  const updateColumns = (newGradeTypes: GradeType[]) => {
    const temporaryGrades = getAllGradesIntoColumns(
      newGradeTypes,
      InitialColumns
    );
    const currLength = temporaryGrades.length;
    const excess = currLength - FIXED_COLUMN;
    const percentagePerColumn = 100 / FIXED_COLUMN;
    const excessPercentage = percentagePerColumn * excess;
    const totalPercentage = excessPercentage + 100;
    setWidthOfScrollX(totalPercentage + "%");
    setGradeColumns(temporaryGrades);
  };

  const FetchAllGradesFunction = () => {
    getFullGradeData(courseId)
      .then((resGetFull: ReturnCreateGrade) => {
        setFullGradeStructure(resGetFull.gradeTypes);
        setGradeStructureId(resGetFull.id);
        updateColumns(resGetFull.gradeTypes);
        messageApi.success("Load structure successfully");
      })
      .catch((err: any) => {
        console.log("PointPage: Failed to load grade structure", err);
        messageApi.error("Fail to load grade structure");
      });
  };

  const timeRender = useRef(0);
  useEffect(() => {
    timeRender.current++;
    if (timeRender.current == 1) {
      FetchAllGradesFunction();
    }
  }, []);

  const handleCancelViewGrade = () => {
    setIsModalViewGradeOpen(false);
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
          {/* <Button
            type="primary"
            style={{ background: "#ffc069", outline: "none", color: "#000" }}
          >
            Update Grade Structure
          </Button> */}
          <Button
            style={{ outline: "none" }}
            onClick={() => setIsModalViewGradeOpen(true)}
          >
            View Grade Structure
          </Button>
        </div>
        <Table
          columns={gradeColumns}
          dataSource={data}
          scroll={{ x: widthOfScrollX }}
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
                <Table.Summary.Cell index={2} colSpan={8}>
                  {/* Points */}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={10}></Table.Summary.Cell>
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
          InitialColumns={InitialColumns}
          courseId={courseId}
          setIsModalCreateGradeOpen={setIsModalCreateGradeOpen}
          messageApi={messageApi}
          gradeStructureId={gradeStructureId}
          FetchAllGradesFunction={FetchAllGradesFunction}
        />
      </Modal>
      <Modal
        title="Grade Structure"
        open={isModalViewGradeOpen}
        onCancel={handleCancelViewGrade}
        footer={null}
      >
        <TreeGradeStructure
          gradeColumns={gradeColumns}
          setGradeColumns={setGradeColumns}
          InitialColumns={InitialColumns}
          courseId={courseId}
          setIsModalCreateGradeOpen={setIsModalCreateGradeOpen}
          messageApi={messageApi}
          gradeStructureId={gradeStructureId}
          FetchAllGradesFunction={FetchAllGradesFunction}
          fullGradeStructure={fullGradeStructure}
          setIsModalViewGradeOpen={setIsModalViewGradeOpen}
          updateColumns={updateColumns}
          setFullGradeStructure={setFullGradeStructure}
        />
      </Modal>
      {contextHolder}
    </>
  );
};

export default PointPage;
