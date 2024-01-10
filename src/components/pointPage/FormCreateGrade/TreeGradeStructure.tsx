import React, { useState } from "react";
import {
  DownOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Tree,
  message,
} from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import { ColumnsType } from "antd/es/table";
import {
  changeGradeTypeToNode,
  deleteGradeById,
  updateGradeById,
} from "utils/getAllGrades";
import { GradeType } from "types/grade/returnCreateGrade";
import { addSubGrade, deleteGrade, updateGrade } from "services/gradeService";
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
  currentRole: any;
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
  FetchAllGradesFunction,
  currentRole,
}: TreeGradeProps) => {
  const [gradeContact, setGradeContact] = useState<any>({ name: "" });
  const [openDeleteGrade, setOpenDeleteGrade] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [openUpdateGrade, setOpenUpdateGrade] = useState(false);
  const [openAddSubGrade, setOpenAddSubGrade] = useState(false);
  const [form] = Form.useForm();
  const handleOKDelete = () => {
    setConfirmLoading(true);
    deleteGrade(gradeContact.id)
      .then((res) => {
        const newResultAfterDelete = deleteGradeById(
          cloneDeep(fullGradeStructure),
          gradeContact.id
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
    setGradeContact(grade);
    setOpenDeleteGrade(true);
  };

  const handeClickAddSubGrade = (grade: GradeType) => {
    setGradeContact(grade);
    setOpenAddSubGrade(true);
  };
  const handleCancelAddSub = () => {
    setOpenAddSubGrade(false);
  };
  const onFinishSubGrade = (values: any) => {
    // FetchAllGradesFunction();
    setConfirmLoading(true);
    addSubGrade(gradeContact.id, values.subGrades)
      .then((res) => {
        FetchAllGradesFunction();
        setConfirmLoading(false);
        setOpenAddSubGrade(false);
        messageApi.success("Add sub grade successfully");
      })
      .catch((err) => {
        messageApi.error("Failed to add grade sub types");
        console.log("TreeGradeStructure: Failed to add SubGrade", err);
        setConfirmLoading(false);
      });
  };

  const handeClickUpdateGrade = (grade: GradeType) => {
    form.setFieldsValue({
      label: grade.label,
      percentage: grade.percentage,
      desc: grade.desc,
    });
    setGradeContact(grade);
    setOpenUpdateGrade(true);
  };

  const handleCancelUpdate = () => {
    setOpenUpdateGrade(false);
  };
  const onFinishUpdate = (values: any) => {
    setConfirmLoading(true);
    updateGrade(gradeContact.id, values)
      .then((res) => {
        const newResultAfterUpdate = updateGradeById(
          cloneDeep(fullGradeStructure),
          gradeContact.id,
          values
        );
        console.log("AfterUpdate: ", newResultAfterUpdate);
        updateColumns(newResultAfterUpdate);
        setFullGradeStructure(newResultAfterUpdate);
        setOpenUpdateGrade(false);
        messageApi.success("Update grade successfully");
      })
      .catch((err) => {
        messageApi.error("Failed to update grade");
        console.log("TreeGradeStructure: Failed to update grade", err);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  const treeData = changeGradeTypeToNode(
    fullGradeStructure,
    handeClickAddSubGrade,
    handeClickUpdateGrade,
    handeClickDeleteGrade,
    currentRole
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
        <p>Do you want to remove {gradeContact.label}?</p>
      </Modal>

      <Modal
        key="updategrade"
        title="Update grade"
        open={openUpdateGrade}
        confirmLoading={confirmLoading}
        onCancel={handleCancelUpdate}
        footer={null}
      >
        <Form
          form={form}
          name="update_grade_form"
          onFinish={onFinishUpdate}
          //   style={{ maxWidth: 600 }}
          autoComplete="off"
          initialValues={{
            label: gradeContact.label,
            percentage: gradeContact.percentage,
            desc: gradeContact.desc,
          }}
        >
          <Form.Item>
            <Space
              key="space_update_grade"
              style={{ display: "flex", marginBottom: 8 }}
              align="baseline"
            >
              <Form.Item
                name="label"
                rules={[{ required: true, message: "Missing name" }]}
              >
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item
                name="percentage"
                rules={[{ required: true, message: "Missing percentage" }]}
              >
                <InputNumber placeholder="Percentage" />
              </Form.Item>
              <Form.Item
                name="desc"
                rules={[{ required: true, message: "Missing desc" }]}
              >
                <Input placeholder="Description" />
              </Form.Item>
            </Space>
            <Button loading={confirmLoading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        key="addsubgrade"
        title="Add sub grade"
        open={openAddSubGrade}
        onCancel={handleCancelAddSub}
        footer={null}
      >
        <Form
          name="dynamic_form_sub_grade_item"
          onFinish={onFinishSubGrade}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.List name="subGrades">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "label"]}
                      rules={[{ required: true, message: "Missing name" }]}
                    >
                      <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "percentage"]}
                      rules={[
                        { required: true, message: "Missing percentage" },
                      ]}
                    >
                      <InputNumber placeholder="Percentage" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "desc"]}
                      rules={[{ required: true, message: "Missing desc" }]}
                    >
                      <Input placeholder="Description" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button loading={confirmLoading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TreeGradeStructure;
