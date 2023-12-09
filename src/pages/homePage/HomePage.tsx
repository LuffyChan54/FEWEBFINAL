import { getAuthReducer, getClassOVReducer, update } from "@redux/reducer";
import { Button, Card, Col, Flex, Input, Modal } from "antd";
import GlobalLayout from "layouts/globalLayout/GlobalLayout";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useOutlet } from "react-router-dom";
import * as userService from "services/userService";
import { ClassOverviewType } from "types";

interface VirtualInputRefType {
  input: {
    value: string;
  };
}

const HomePage = () => {
  const dispatch = useDispatch();
  const classOVs: ClassOverviewType[] = useSelector(getClassOVReducer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const outlet = useOutlet();
  const stateModal = useRef("");
  const inputClassNameRef = useRef(null);
  const inputClassDescRef = useRef(null);
  const inputClassCodeRef = useRef(null);
  const navigate = useNavigate();

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

  //TODO: HANLDE SWR

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

      console.log(className, classDesc);
    }

    if (state == "Join Class") {
      const refInputClassCode: VirtualInputRefType =
        inputClassCodeRef.current as unknown as VirtualInputRefType;
      const classCode: string = refInputClassCode.input.value;

      console.log(classCode);
    }

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCardClick = (id: any) => {
    navigate("/home/class/" + id);
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
        {classOVs.map((el) => (
          <Col span={7} key={el.id}>
            <Card
              title={el.name}
              bordered={false}
              style={{
                cursor: "pointer",
              }}
              onClick={() => handleCardClick(el.id)}
            >
              <h5>{el.desc}</h5>
              <i>{el.host_name}</i>
            </Card>
          </Col>
        ))}
      </Flex>
    </div>
  );

  return (
    <GlobalLayout>
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
