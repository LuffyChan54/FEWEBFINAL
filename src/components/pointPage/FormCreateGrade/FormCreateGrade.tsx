import React, { useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import { createGradeStructure } from "services/gradeService";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

interface FormCreateGradeProps {
  gradeColumns: ColumnsType<DataType>;
  setGradeColumns: Function;
  courseId: String;
  setIsModalCreateGradeOpen: Function;
  messageApi: any;
}

const FormCreateGrade = ({
  gradeColumns,
  setGradeColumns,
  courseId,
  setIsModalCreateGradeOpen,
  messageApi,
}: FormCreateGradeProps) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    console.log("Received values of form:", values);
    createGradeStructure(courseId, values)
      .then((res: any) => {
        console.log("Form create grade res:  ", res);
        setIsModalCreateGradeOpen(false);
        // setGradeColumns((prev: ColumnsType<DataType> ):ColumnsType<DataType> => {

        // })
        messageApi.success("Create grade structure successfully");
      })
      .catch((err: any) => {
        console.log("FormCreateGrade: Failed to create grade structure", err);
        messageApi.error("Failed to create grade structure");
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  return (
    <Form
      name="dynamic_form_grade_item"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      autoComplete="off"
    >
      <Form.List name="gradeTypes">
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
                  rules={[{ required: true, message: "Missing percentage" }]}
                >
                  <InputNumber placeholder="Percentage" />
                </Form.Item>
                <Form.Item {...restField} name={[name, "desc"]}>
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
  );
};

export default FormCreateGrade;
