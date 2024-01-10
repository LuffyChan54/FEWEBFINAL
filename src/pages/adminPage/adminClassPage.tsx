import {
  createClassAction,
  getAdminReducer,
  getClassesAction,
  toggleActiveClassAction,
} from "@redux/reducer";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCourse,
  getAllCourses,
  getCourses,
  toggleActiveClass,
} from "services/adminService";
import {
  Button,
  Flex,
  Input,
  InputRef,
  Modal,
  Space,
  Upload,
  message,
} from "antd";
import { DownloadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import ClassList from "components/classOverview/classList";
import { useSearchParams } from "react-router-dom";

const AdminClassPage = () => {
  const { classes } = useSelector(getAdminReducer);
  let [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isTableLoading, setTableLoading] = useState(true);
  const [isShowModel, setShowModel] = useState(false);
  const inputClassNameRef = useRef<InputRef>(null);
  const inputClassDescRef = useRef<InputRef>(null);

  const handleActive = async (courseId: string, isActive: boolean) => {
    toggleActiveClass(courseId, isActive).then((_class) => {
      dispatch(toggleActiveClassAction(_class));
    });
    messageApi.open({
      key: `${isActive ? "Active" : "Inactive"} class successfully!`,
      type: "success",
      content: `${isActive ? "Active" : "Inactive"} class successfully!`,
      duration: 1.5,
    });
  };

  const handleCreateNewCourse = () => {
    if (
      searchParams.get("userId") &&
      inputClassNameRef.current?.input?.value &&
      inputClassDescRef.current?.input?.value
    ) {
      setShowModel(false);
      createCourse({
        userId: searchParams.get("userId")!,
        name: inputClassNameRef.current?.input?.value,
        desc: inputClassDescRef.current?.input?.value,
      }).then((_class) => {
        dispatch(createClassAction(_class));
        messageApi.open({
          key: `Create new course successfully!`,
          type: "success",
          content: `Create new course successfully!`,
          duration: 1.5,
        });
      });
    } else {
      messageApi.open({
        key: `Missing something about name or desc`,
        type: "warning",
        content: `Missing something about name or desc`,
        duration: 1.5,
      });
    }
  };

  useEffect(() => {
    setTableLoading(true);
    if (searchParams.get("userId")) {
      getCourses(searchParams.get("userId")!, { skip: 0, take: 100 }).then(
        (classes) => {
          dispatch(getClassesAction(classes));
          setTableLoading(false);
        }
      );
    } else {
      getAllCourses({ skip: 0, take: 100 }).then((classes) => {
        dispatch(getClassesAction(classes));
        setTableLoading(false);
      });
    }
  }, [searchParams.get("userId")]);

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      {contextHolder}
      <Modal
        title={"Add New Class"}
        open={isShowModel}
        onOk={() => handleCreateNewCourse()}
        onCancel={() => setShowModel(false)}
      >
        <>
          <label>Class name:</label>
          <Input
            ref={inputClassNameRef}
            key="input_home_class_name"
            placeholder="Course name"
          />

          <label>Class descriptions:</label>
          <Input
            ref={inputClassDescRef}
            key="input_home_class_desc"
            placeholder="Course descriptions"
          />
        </>
      </Modal>
      <Flex gap={"small"} align="flex-start" justify="flex-end">
        {searchParams.get("userId") ? (
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setShowModel(true)}
          >
            Create new course
          </Button>
        ) : (
          <></>
        )}
      </Flex>
      <ClassList
        isTableLoading={isTableLoading}
        classes={classes}
        handleActive={handleActive}
      />
    </Space>
  );
};

export default AdminClassPage;
