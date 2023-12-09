import { getAuthReducer, setClassOverview, update } from "@redux/reducer";
import { Button, Card, Col, Flex, Input, Modal, message } from "antd";
import GlobalLayout from "layouts/globalLayout/GlobalLayout";
import { useRef, useState } from "react";
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
import { addClassOptions } from "helpers";
import { ClassEndpointWTID, getClassDetail } from "services/classService";

interface VirtualInputRefType {
  input: {
    value: string;
  };
}

const HomePage = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const outlet = useOutlet();
  const stateModal = useRef("");
  const inputClassNameRef = useRef(null);
  const inputClassDescRef = useRef(null);
  const inputClassCodeRef = useRef(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  //checking
  const { token, user } = useSelector(getAuthReducer);
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

  const addClassOVMutation = async (newClassOV: any) => {
    messageApi.loading("Creating new course...");
    try {
      await mutate(
        createClassOV(newClassOV, classOVs),
        addClassOptions(newClassOV, classOVs)
      );

      messageApi.success("Success! Added new class 🎉.");
      // dispatch(setClassOverview(classOVs));
    } catch (err) {
      messageApi.error("Failed to add the new class.");
    }
  };

  const joinClassOVMutation = async (classCode: any) => {
    messageApi.loading("Joining new course...");

    try {
      const newClassOVS = await mutate(joinClassOV(classCode, classOVs));
      // console.log("join class", newClassOVS);
      dispatch(setClassOverview(newClassOVS));
      messageApi.success("Success! Joined new class 🎉.");
    } catch (err) {
      messageApi.error("Failed to add the new class.");
    }
  };

  //handle function
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const state = stateModal.current;
    if (state == "Add Class") {
      const refInputClassName: VirtualInputRefType =
        inputClassNameRef.current as unknown as VirtualInputRefType;
      const className: string = refInputClassName.input.value;

      const refInputClassDesc: VirtualInputRefType =
        inputClassDescRef.current as unknown as VirtualInputRefType;
      const classDesc: string = refInputClassDesc.input.value;

      addClassOVMutation({ name: className, desc: classDesc });
    }

    if (state == "Join Class") {
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

  const handleCardClick = (id: any) => {
    navigate("/home/course/" + id);
  };

  const homePageElement = (
    <div className="wrap_mainscreen_modal">
      <Modal
        title={stateModal.current}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {stateModal.current == "Add Class" ? (
          <>
            <label>Class name:</label>
            <Input
              ref={inputClassNameRef}
              key="input_home_class_name"
              placeholder="Class name"
            />

            <label>Class descriptions:</label>
            <Input
              ref={inputClassDescRef}
              key="input_home_class_desc"
              placeholder="Class descriptions"
            />
          </>
        ) : (
          <>
            <label>Class code:</label>
            <Input
              ref={inputClassCodeRef}
              key="input_home_class_code"
              placeholder="Class Code"
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
            stateModal.current = "Add Class";
            showModal();
          }}
        >
          Add new class
        </Button>

        <Button
          onClick={() => {
            stateModal.current = "Join Class";
            showModal();
          }}
        >
          Join class
        </Button>
      </Flex>
      <Flex
        wrap="wrap"
        gap="50px"
        // style={{ background: "#f0f2f5", padding: "20px" }}
      >
        {classOVs?.map((el: ClassOverviewType) => {
          preload(ClassEndpointWTID + el.code, () => getClassDetail(el.code));
          return (
            <Col span={7} key={el.id}>
              <Card
                title={el.name}
                bordered={false}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(el.id)}
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
        })}
      </Flex>
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
};

export default HomePage;
