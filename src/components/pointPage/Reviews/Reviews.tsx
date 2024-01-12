import { CheckOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Descriptions,
  DescriptionsProps,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Skeleton,
  Steps,
  Tabs,
  Tag,
  message,
} from "antd";
import { cloneDeep, mapValues } from "lodash";
import React, { useRef, useState } from "react";
import { ClassEndpointWTID } from "services/classService";
import {
  addReviewResult,
  getAllGradeReviewsOfStudent,
  markDoneReviewResult,
} from "services/gradeService";
import useSWR, { useSWRConfig } from "swr";
import { GradeTypeReviews } from "types";
import MyChat from "./MyChat";

const Reviews = ({
  recordReviews,
  gradeStructureId,
  studentIdFromSearchParam,
  courseId,
  currentRole,
  fullStudentGrades,
  mutateStudentGrades,
  cacheKeyOfStudentGrade,
}: any) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate: myMutate } = useSWRConfig();
  const [currentReviewResult, setCurrentReviewResult] = useState<any>({});
  const studentIdReview = studentIdFromSearchParam
    ? studentIdFromSearchParam
    : recordReviews.studentId;
  const [openReviewResult, setOpenReviewResult] = useState(false);
  const [openDoneGradeReview, setOpenDoneGradeReview] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const refValuesCheck = useRef(undefined);
  const cacheKeyOfReviews =
    ClassEndpointWTID + courseId + "#points#reviews#" + studentIdReview;
  let {
    data: gradeTypeReviews,
    mutate: mutateGradeTypeReviews,
  }: { data: GradeTypeReviews[]; mutate: any } = useSWR(
    cacheKeyOfReviews,
    async () => {
      if (gradeStructureId != "") {
        const result = await getAllGradeReviewsOfStudent(
          gradeStructureId,
          studentIdReview
        );
        refValuesCheck.current = result;
        return result;
      }
    },
    {
      onSuccess: (data: GradeTypeReviews[]) => {
        return data;
      },
    }
  );

  if (refValuesCheck.current == undefined && gradeStructureId != "") {
    mutateGradeTypeReviews();
  }

  const refCurrentGradeReviewId = useRef("");
  const refGradeTypeId: any = useRef("");
  const refCurrentGradeReviewDone: any = useRef({});
  const refFinalGradeForCurrentGradeReviewDone: any = useRef(-1);
  const handleAddReviewResult = (gradeReviewID: any) => {
    refCurrentGradeReviewId.current = gradeReviewID;
    setOpenReviewResult(true);
  };
  //Handle logic:newCurrentReviewResult
  let itemsForGradeTypeReviews: any = [];
  if (gradeTypeReviews != undefined) {
    itemsForGradeTypeReviews = gradeTypeReviews.map((gradeTypeRV) => {
      //TODO:
      const newCurrentReviewResultSub: any = {};
      for (const gradeReviewsEl of gradeTypeRV.gradeReviews) {
        if (!currentReviewResult[`${gradeTypeRV.id}`]) {
          newCurrentReviewResultSub[`${gradeReviewsEl.id}`] =
            gradeReviewsEl.gradeReviewResults.length - 1;
        }
      }
      if (!currentReviewResult[`${gradeTypeRV.id}`]) {
        const newCurrentReviewResult: any = {};
        newCurrentReviewResult[`${gradeTypeRV.id}`] = newCurrentReviewResultSub;
        setCurrentReviewResult({
          ...currentReviewResult,
          ...newCurrentReviewResult,
        });
      }

      const newParentLabel = {
        label: (
          <Badge dot={gradeTypeRV.status == "REQUEST"}>
            <div style={{ marginTop: "5px" }}>
              {gradeTypeRV.gradeType.label}
            </div>
          </Badge>
        ),
        key: gradeTypeRV.gradeTypeId,
        children: (
          <Tabs
            defaultActiveKey="1"
            type="card"
            size="small"
            items={gradeTypeRV.gradeReviews.map((gradeReview) => {
              const itemsGradeReviewDesc: DescriptionsProps["items"] = [
                {
                  key: "studentId" + gradeReview.id,
                  label: "Student",
                  children: studentIdReview,
                },
                {
                  key: "desc" + gradeReview.id,
                  label: "Desc",
                  children: gradeReview.desc,
                },
                {
                  key: "expectedGrade" + gradeReview.id,
                  label: "Expected Grade",
                  children: (
                    <Tag color="cyan">{gradeReview.expectedGrade + ""}</Tag>
                  ),
                },
              ];
              let itemsForGradeReviewResult: any = [];
              if (
                gradeReview.gradeReviewResults.length > 0 &&
                currentReviewResult[`${gradeTypeRV.id}`]
              ) {
                const indexOfSub =
                  currentReviewResult[`${gradeTypeRV.id}`][`${gradeReview.id}`];
                const objectForResultReview =
                  gradeReview.gradeReviewResults[indexOfSub];
                if (objectForResultReview) {
                  itemsForGradeReviewResult = [
                    {
                      key: "point" + objectForResultReview.id,
                      label: "Review Grade",
                      children: (
                        <Tag color="green">
                          {objectForResultReview.point + ""}
                        </Tag>
                      ),
                    },
                    {
                      key: "feedback" + objectForResultReview.id,
                      label: "Feedback",
                      children: objectForResultReview.feedback,
                    },
                    {
                      key: "by" + objectForResultReview.id,
                      label: "By",
                      children:
                        objectForResultReview.teacher.name +
                        ` (${objectForResultReview.teacher.email})`,
                    },
                    {
                      key: "event" + objectForResultReview.id,
                      label: "Event",
                      children: objectForResultReview.event,
                    },
                  ];
                }
              }

              const newChildReview = {
                label: (
                  <Badge dot={gradeReview.status == "REQUEST"}>
                    <div style={{ marginTop: "5px" }}>{gradeReview.topic}</div>
                  </Badge>
                ),
                key: gradeReview.id,
                children: (
                  <>
                    <Descriptions
                      title={
                        <div>
                          Review Info{" "}
                          {gradeReview.status == "REQUEST" ? (
                            <Tag style={{ marginLeft: "10px" }} color="gold">
                              REQUEST
                            </Tag>
                          ) : (
                            <Tag style={{ marginLeft: "10px" }} color="green">
                              DONE
                            </Tag>
                          )}
                        </div>
                      }
                      items={itemsGradeReviewDesc}
                    />
                    {currentRole != "STUDENT" &&
                      gradeReview.status == "REQUEST" && (
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "20px",
                          }}
                        >
                          {gradeReview.gradeReviewResults.length > 0 && (
                            <Button
                              type="primary"
                              style={{ outline: "none" }}
                              onClick={() => {
                                refFinalGradeForCurrentGradeReviewDone.current =
                                  gradeReview.gradeReviewResults[
                                    gradeReview.gradeReviewResults.length - 1
                                  ].point;
                                refCurrentGradeReviewDone.current = gradeReview;
                                refGradeTypeId.current =
                                  gradeTypeRV.gradeTypeId;
                                setOpenDoneGradeReview(true);
                              }}
                            >
                              Mark Done
                            </Button>
                          )}
                          <Button
                            type="default"
                            style={{ outline: "none" }}
                            onClick={() =>
                              handleAddReviewResult(gradeReview.id)
                            }
                          >
                            Add review result
                          </Button>
                        </div>
                      )}
                    {gradeReview.gradeReviewResults.length > 0 && (
                      <>
                        <Steps
                          current={
                            currentReviewResult[`${gradeTypeRV.id}`]
                              ? currentReviewResult[`${gradeTypeRV.id}`][
                                  `${gradeReview.id}`
                                ]
                              : ""
                          }
                          onChange={(values: any) => {
                            const newObjectForSetReviewResult: any = {};
                            newObjectForSetReviewResult[`${gradeTypeRV.id}`] = {
                              ...currentReviewResult[`${gradeTypeRV.id}`],
                            };
                            newObjectForSetReviewResult[`${gradeTypeRV.id}`][
                              `${gradeReview.id}`
                            ] = values;
                            setCurrentReviewResult({
                              ...currentReviewResult,
                              ...newObjectForSetReviewResult,
                            });
                          }}
                          items={gradeReview.gradeReviewResults.map(
                            (gradeReviewRS) => {
                              const stepElement = {
                                title: gradeReviewRS.point,
                              };
                              return stepElement as any;
                            }
                          )}
                        />
                        <Descriptions
                          title={
                            <>
                              <p
                                style={{
                                  fontWeight: "normal",
                                  marginTop: "20px",
                                  marginBottom: 0,
                                }}
                              >
                                Grade review result
                              </p>
                            </>
                          }
                          items={itemsForGradeReviewResult}
                        />
                      </>
                    )}
                  </>
                ),
              };

              return newChildReview as any;
            })}
          />
        ),
      };
      return newParentLabel;
    });
  }

  const addReviewResultMutation = (newReviewResult: any) => {
    const gradeTypeReviewsClone = cloneDeep(gradeTypeReviews);
    let GradeTypeReviewIdWillChange: any = "";
    let nextLength = -1;
    for (const gradeReviewType of gradeTypeReviewsClone) {
      GradeTypeReviewIdWillChange = gradeReviewType.id;
      let isFinish = false;
      for (const gradeReviewSubSearch of gradeReviewType.gradeReviews) {
        if (gradeReviewSubSearch.id == refCurrentGradeReviewId.current) {
          nextLength = gradeReviewSubSearch.gradeReviewResults.length;
          gradeReviewSubSearch.gradeReviewResults.push(newReviewResult);
          isFinish = true;
          break;
        }
      }
      if (isFinish) {
        break;
      }
    }
    myMutate(cacheKeyOfReviews, gradeTypeReviewsClone, false);

    const currentReviewResultClone = cloneDeep(currentReviewResult);
    currentReviewResultClone[`${GradeTypeReviewIdWillChange}`][
      `${refCurrentGradeReviewId.current}`
    ] = nextLength;

    setCurrentReviewResult(currentReviewResultClone);
  };

  const markDoneGradeReviewMutation = (gradeReviewDone: any) => {
    const gradeTypeReviewsClone = cloneDeep(gradeTypeReviews);
    let isAllDone = true;
    for (const gradeReviewType of gradeTypeReviewsClone) {
      let isFinish = false;
      for (const gradeReviewSubSearch of gradeReviewType.gradeReviews) {
        if (gradeReviewSubSearch.id == gradeReviewDone.id) {
          gradeReviewSubSearch.status = "DONE";
          isFinish = true;
        }
        if (gradeReviewSubSearch.status != "DONE") {
          isAllDone = false;
          if (isFinish) {
            break;
          }
        }
      }
      if (isFinish) {
        if (isAllDone) {
          gradeReviewType.status = "DONE";
        }
        break;
      }
    }
    myMutate(cacheKeyOfReviews, gradeTypeReviewsClone, false);

    const gradeTypeIdWillChange = refGradeTypeId.current;
    const newStudentGrades = cloneDeep(fullStudentGrades);
    for (const tempStudent of newStudentGrades[gradeTypeIdWillChange]) {
      if (studentIdReview == tempStudent.studentId) {
        tempStudent.point = refFinalGradeForCurrentGradeReviewDone.current;
        if (isAllDone) {
          tempStudent.status = "DONE";
        }
        break;
      }
    }
    myMutate(cacheKeyOfStudentGrade, newStudentGrades, false);
  };

  const handleCancelReviewResult = () => {
    setOpenReviewResult(false);
  };
  const onFinishReviewResult = (values: any) => {
    setConfirmLoading(true);
    addReviewResult(refCurrentGradeReviewId.current, values)
      .then((res) => {
        addReviewResultMutation(res);
        messageApi.success("Successfully added review result");
        setOpenReviewResult(false);
      })
      .catch((err) => {
        messageApi.error("Failed to add review result");
        console.log("Reviews: Failed to addReviewResult", err);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  const handleOKDone = () => {
    // console.log(refCurrentGradeReviewDone.current);
    // console.log(refFinalGradeForCurrentGradeReviewDone.current);
    setConfirmLoading(true);
    markDoneReviewResult(refCurrentGradeReviewDone.current.id)
      .then((res) => {
        markDoneGradeReviewMutation(res);
        messageApi.success("Mark grade review done successfully");
        setOpenDoneGradeReview(false);
      })
      .catch((err) => {
        messageApi.error("Failed to mark grade review done");
        console.log("Reviews: Failed to mark review result done", err);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };
  const handleCancelDone = () => {
    setOpenDoneGradeReview(false);
  };
  return (
    <>
      {gradeStructureId == "" || !gradeTypeReviews ? (
        <Skeleton active />
      ) : (
        <Row>
          <Col span={16}>
            <div>
              <Tabs
                defaultActiveKey="abc"
                size="small"
                style={{ marginBottom: 10 }}
                items={itemsForGradeTypeReviews}
              />
            </div>
          </Col>
          <Col span={8}>
            <MyChat />
          </Col>
        </Row>
      )}

      <Modal
        title={`Add review result `}
        open={openReviewResult}
        onCancel={handleCancelReviewResult}
        footer={null}
        destroyOnClose={true}
      >
        <Form
          name="create_grade_review"
          onFinish={onFinishReviewResult}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.Item
            label="Point"
            name="point"
            rules={[{ required: true, message: "Missing grade" }]}
          >
            <InputNumber placeholder="Expected grade" />
          </Form.Item>
          <Form.Item
            label="Feedback"
            name="feedback"
            rules={[{ required: true, message: "Missing feedback" }]}
          >
            <Input placeholder="Description" />
          </Form.Item>
          <Form.Item>
            <Button loading={confirmLoading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          <>
            <CheckOutlined style={{ color: "#23b574", marginRight: "20px" }} />
            Mark Done {refCurrentGradeReviewDone.current?.topic}
          </>
        }
        destroyOnClose={true}
        open={openDoneGradeReview}
        onOk={handleOKDone}
        confirmLoading={confirmLoading}
        onCancel={handleCancelDone}
      >
        <p>
          Mark this grade review with final grade:{" "}
          <Tag color="green">
            {refFinalGradeForCurrentGradeReviewDone.current}
          </Tag>{" "}
        </p>
      </Modal>
      {contextHolder}
    </>
  );
};

export default Reviews;
