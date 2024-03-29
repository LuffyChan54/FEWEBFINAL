import {
  getAlertHome,
  getAuthReducer,
  getClassOVReducer,
  getFlags,
  getHashInfo,
  setAlert,
  setClassOverview,
  setFlags,
  update,
} from "@redux/reducer";
import {
  Alert,
  Button,
  Card,
  Col,
  Flex,
  Input,
  Modal,
  Skeleton,
  message,
} from "antd";
import GlobalLayout from "layouts/globalLayout/GlobalLayout";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutlet } from "react-router-dom";
import * as userService from "services/userService";
import useSWR, { preload } from "swr";
import { ClassOverviewType } from "types";
import {
  getClassOV,
  ClassOVEndpoint as cacheKeyClassOV,
  createClassOV,
  joinClassOV,
} from "services/classOVService";
import { addClassOptions, removeClassOptions } from "helpers";
import { identity, isEqual, sortBy } from "lodash";

interface VirtualInputRefType {
  input: {
    value: string;
  };
}

const HomePage = memo(() => {
  const nextRedirectURL = localStorage.getItem("nextRedirectURL");
  if (nextRedirectURL) {
    localStorage.removeItem("nextRedirectURL");
    window.location = nextRedirectURL as any;
  }
  const [isFetchingClassesFirstTime, setIsFetchingClassesFirstTime] =
    useState(true);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const outlet = useOutlet();
  const stateModal = useRef("");
  const inputClassNameRef = useRef(null);
  const inputClassDescRef = useRef(null);
  const inputClassCodeRef = useRef(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const alertValue = useSelector(getAlertHome);
  //checking
  const { token, user } = useSelector(getAuthReducer);
  const reduxClassOVS = useSelector(getClassOVReducer);
  let {
    isLoading,
    isValidating,
    error,
    data: classOVs,
    mutate,
  } = useSWR(cacheKeyClassOV, getClassOV, {
    onSuccess: (data) => {
      // console.log("SWR on success: ", data);
      dispatch(setClassOverview(data));
      return data.sort((a: ClassOverviewType, b: ClassOverviewType) => {
        const dateA = new Date(a.profile.joinedAt);
        const dateB = new Date(b.profile.joinedAt);

        if (dateA < dateB) {
          return 1;
        } else {
          if (dateA > dateB) {
            return -1;
          } else {
            return 0;
          }
        }
      });
    },
  });

  const isFinishLoadingFirstTime = useRef(0);
  if (classOVs) {
    isFinishLoadingFirstTime.current++;
    if (isFinishLoadingFirstTime.current == 1) {
      // messageApi.open({
      //   key: "loadingCourses",
      //   type: "success",
      //   content: "Success! Loaded courses 🎉.",
      //   duration: 2,
      // });
      setIsFetchingClassesFirstTime(false);
    }
  }

  useEffect(() => {
    if (!user.emailVerified) {
      userService
        .getUser()
        .then((res) => {
          const payload = {
            email: res.email,
            emailVerified: res.emailVerified,
            name: res.name,
            picture: res.picture,
          };
          dispatch(update(payload));
          // console.log(payload);
        })
        .catch((err) => {
          console.log("fetch error:", err);
        });
    }

    if (!classOVs && isFinishLoadingFirstTime.current == 0) {
      // messageApi.open({
      //   key: "loadingCourses",
      //   type: "loading",
      //   content: "Loading courses...",
      //   duration: 0,
      // });
    }
  }, []);

  useEffect(() => {
    if (alertValue.value) {
      if (alertValue.type == "info") {
        messageApi.info(alertValue.value);
      }

      if (alertValue.type == "success") {
        messageApi.success(alertValue.value);
      }

      if (alertValue.type == "error") {
        messageApi.error(alertValue.value);
      }

      dispatch(setAlert({}));
    }
  }, [alertValue.value]);

  const addClassOVMutation = async (newClassOV: any) => {
    messageApi.open({
      key: "addingCourse",
      type: "loading",
      content: "Creating new course...",
      duration: 0,
    });
    try {
      const newClassOVS = await mutate(
        createClassOV(newClassOV, classOVs),
        addClassOptions(newClassOV, classOVs)
      );

      messageApi.open({
        key: "addingCourse",
        type: "success",
        content: "Success! Added new course 🎉.",
        duration: 2,
      });

      dispatch(setClassOverview(newClassOVS));
    } catch (err) {
      messageApi.open({
        key: "addingCourse",
        type: "error",
        content: "Failed to add the new course.",
        duration: 2,
      });
    }
  };

  const joinClassOVMutation = async (classCode: any) => {
    messageApi.open({
      key: "joiningCourse",
      type: "loading",
      content: "Joining new course...",
      duration: 0,
    });
    try {
      const newClassOVS = await mutate(joinClassOV(classCode, classOVs));
      // console.log("join class", newClassOVS);
      dispatch(setClassOverview(newClassOVS));
      messageApi.open({
        key: "joiningCourse",
        type: "success",
        content: "Success! Joined new course 🎉.",
        duration: 2,
      });
    } catch (err) {
      messageApi.open({
        key: "joiningCourse",
        type: "error",
        content: "Failed to add the new course.",
        duration: 2,
      });
    }
  };

  //handle function
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const state = stateModal.current;
    if (state == "Add Course") {
      const refInputClassName: VirtualInputRefType =
        inputClassNameRef.current as unknown as VirtualInputRefType;
      const className: string = refInputClassName.input.value;

      const refInputClassDesc: VirtualInputRefType =
        inputClassDescRef.current as unknown as VirtualInputRefType;
      const classDesc: string = refInputClassDesc.input.value;

      addClassOVMutation({ name: className, desc: classDesc });
    }

    if (state == "Join Course") {
      const refInputClassCode: VirtualInputRefType =
        inputClassCodeRef.current as unknown as VirtualInputRefType;
      const classCode: string = refInputClassCode.input.value;

      joinClassOVMutation(classCode);
    }

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const hashInfoValue = useSelector(getHashInfo);

  const handleCardClick = (id: any, isActive: boolean) => {
    if (!isActive) {
      messageApi.open({
        key: "course",
        type: "warning",
        content: "Your course is not active yet",
        duration: 2,
      });
    } else {
      navigate("/home/course/" + id + "#" + hashInfoValue);
    }
  };

  const homePageElement = (
    <div className="wrap_mainscreen_modal">
      <Modal
        title={stateModal.current}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {stateModal.current == "Add Course" ? (
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
        ) : (
          <>
            <label>Class code:</label>
            <Input
              ref={inputClassCodeRef}
              key="input_home_class_code"
              placeholder="Course Code"
            />
          </>
        )}
      </Modal>

      <Flex
        gap="20px"
        style={{
          marginBottom: "20px",
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            stateModal.current = "Add Course";
            showModal();
          }}
        >
          Add new class
        </Button>

        <Button
          onClick={() => {
            stateModal.current = "Join Course";
            showModal();
          }}
        >
          Join class
        </Button>
      </Flex>

      {isFetchingClassesFirstTime ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton active style={{ width: "30%" }} />
          <Skeleton active style={{ width: "30%" }} />
          <Skeleton active style={{ width: "30%" }} />
        </div>
      ) : (
        <Flex
          wrap="wrap"
          gap="50px"
          // style={{ background: "#f0f2f5", padding: "20px" }}
        >
          {sortBy(classOVs || [], [({ isActive }) => !isActive]).map(
            (el: ClassOverviewType) => {
              // preload(ClassEndpointWTID + el.code, () => getClassDetail(el.code));
              return (
                <Col span={7} key={el.id}>
                  <Card
                    extra={
                      el.isActive ? (
                        <Alert message="Active" type="success" showIcon />
                      ) : (
                        <Alert message="Inactive" type="error" showIcon />
                      )
                    }
                    title={el.name}
                    bordered={false}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => handleCardClick(el.id, el.isActive!)}
                  >
                    <h6 style={{ marginBottom: "15px" }}>{el.desc}</h6>
                    <p style={{ marginBottom: "2px" }}>
                      Joined At: {el.profile.joinedAt?.split("T")[0]}
                    </p>
                    <p style={{ marginBottom: "2px" }}>
                      Your role: {el.profile.role}
                    </p>
                    <p style={{ marginBottom: "2px" }}>
                      Course created at: {el.createdAt.split("T")[0]}
                    </p>
                    <i>Host by: {el.host.name}</i>
                  </Card>
                </Col>
              );
            }
          )}
        </Flex>
      )}
    </div>
  );

  return (
    <GlobalLayout>
      {contextHolder}
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: outlet ? "#fff" : "#f0f2f5",
        }}
      >
        {outlet || homePageElement}
      </div>
    </GlobalLayout>
  );
});

export default HomePage;
