import React, { useState } from "react";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, Tree } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import { ColumnsType } from "antd/es/table";
import { changeGradeTypeToNode, deleteGradeById } from "utils/getAllGrades";
import { GradeType } from "types/grade/returnCreateGrade";
import { deleteGrade } from "services/gradeService";
import cloneDeep from "lodash/cloneDeep";
interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

interface TreeGradeProps {
  gradeColumns: ColumnsType<DataType>;
  setGradeColumns: Function;
  courseId: String;
  setIsModalCreateGradeOpen: Function;
  messageApi: any;
  InitialColumns: ColumnsType<DataType>;
  gradeStructureId: String;
  FetchAllGradesFunction: Function;
  fullGradeStructure: GradeType[];
  setIsModalViewGradeOpen: Function;
  updateColumns: Function;
  setFullGradeStructure: Function;
}

// const treeData: DataNode[] = [
//   {
//     title: "parent 1",
//     key: "0-0",
//     children: [
//       {
//         title: "parent 1-0",
//         key: "0-0-0",
//         children: [
//           {
//             title: "leaf",
//             key: "0-0-0-0",
//           },
//           {
//             title: "leaf",
//             key: "0-0-0-1",
//           },
//           {
//             title: "leaf",
//             key: "0-0-0-2",
//           },
//         ],
//       },
//       {
//         title: "parent 1-1",
//         key: "0-0-1",
//         children: [
//           {
//             title: "leaf",
//             key: "0-0-1-0",
//           },
//         ],
//       },
//       {
//         title: "parent 1-2",
//         key: "0-0-2",
//         children: [
//           {
//             title: "leaf",
//             key: "0-0-2-0",
//           },
//           {
//             title: "leaf",
//             key: "0-0-2-1",
//           },
//         ],
//       },
//     ],
//   },
// ];

const TreeGradeStructure = ({
  fullGradeStructure,
  messageApi,
  setIsModalViewGradeOpen,
  updateColumns,
  setFullGradeStructure,
}: TreeGradeProps) => {
  const [gradeDelete, setGradeDelete] = useState<any>({ name: "" });
  const [openDeleteGrade, setOpenDeleteGrade] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleOKDelete = () => {
    setConfirmLoading(true);
    deleteGrade(gradeDelete.id)
      .then((res) => {
        const newResultAfterDelete = deleteGradeById(
          cloneDeep(fullGradeStructure),
          gradeDelete.id
        );
        updateColumns(newResultAfterDelete);
        setFullGradeStructure(newResultAfterDelete);
        messageApi.success("Delete grade structure successfully");
        setOpenDeleteGrade(false);
      })
      .catch((err) => {
        console.log("TreeGradeStructure: Failed to delete grade", err);
        messageApi.error("Failed to delete grade");
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };
  const handleCancelDelete = () => {
    setOpenDeleteGrade(false);
  };

  const handeClickDeleteGrade = (grade: GradeType) => {
    setGradeDelete(grade);
    setOpenDeleteGrade(true);
  };

  const handeClickAddSubGrade = (grade: GradeType) => {
    console.log("TreeGradeStructure: AddSub", grade);
  };
  const handeClickUpdateGrade = (grade: GradeType) => {
    console.log("TreeGradeStructure: Update", grade);
  };

  const treeData = changeGradeTypeToNode(
    fullGradeStructure,
    handeClickAddSubGrade,
    handeClickUpdateGrade,
    handeClickDeleteGrade
  );
  return (
    <>
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        //   defaultExpandedKeys={[""]}
        //   onSelect={onSelect}
        treeData={treeData}
      />
      <Modal
        zIndex={9999}
        key="deletegrade"
        title={
          <>
            <ExclamationCircleOutlined
              style={{ color: "#ffc069", marginRight: "10px" }}
            />{" "}
            Delete grade
          </>
        }
        open={openDeleteGrade}
        onOk={handleOKDelete}
        confirmLoading={confirmLoading}
        onCancel={handleCancelDelete}
        okButtonProps={{ danger: true }}
      >
        <p>Do you want to remove {gradeDelete.label}?</p>
      </Modal>
    </>
  );
};

export default TreeGradeStructure;
