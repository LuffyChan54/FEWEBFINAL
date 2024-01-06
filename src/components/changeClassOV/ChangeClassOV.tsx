import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { ClassInfoType } from "types";

const ChangeClassOV = ({
  classDetails,
  updateClassOverviewInfo,
}: {
  classDetails: ClassInfoType;
  updateClassOverviewInfo: any;
}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [isUpdatingClassOV, setisUpdatingClassOV] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleUpdateCourse = (values: any) => {
    updateClassOverviewInfo(values);
    setOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Change Info
      </Button>
      <Modal
        title="Class Info"
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 400 }}
          initialValues={{ name: classDetails.name, desc: classDetails.desc }}
          onFinish={handleUpdateCourse}
          onFinishFailed={() => {}}
          autoComplete="off"
        >
          <Form.Item
            label="Class name"
            name="name"
            rules={[
              { required: true, message: "Please input your class name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Descriptions" name="desc">
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              loading={isUpdatingClassOV}
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangeClassOV;
