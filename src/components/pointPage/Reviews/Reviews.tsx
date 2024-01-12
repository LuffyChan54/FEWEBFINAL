import {
  Badge,
  Col,
  Descriptions,
  DescriptionsProps,
  Row,
  Skeleton,
  Steps,
  Tabs,
} from "antd";
import { mapValues } from "lodash";
import React, { useRef, useState } from "react";
import { ClassEndpointWTID } from "services/classService";
import { getAllGradeReviewsOfStudent } from "services/gradeService";
import useSWR from "swr";
import { GradeTypeReviews } from "types";

const Reviews = ({
  recordReviews,
  gradeStructureId,
  studentIdFromSearchParam,
  courseId,
}: any) => {
  const [currentReviewResult, setCurrentReviewResult] = useState<any>({});
  const studentIdReview = studentIdFromSearchParam
    ? studentIdFromSearchParam
    : recordReviews.studentId;

  const refValuesCheck = useRef(undefined);
  let {
    data: gradeTypeReviews,
    mutate: mutateGradeTypeReviews,
  }: { data: GradeTypeReviews[]; mutate: any } = useSWR(
    ClassEndpointWTID + courseId + "#points#reviews#" + studentIdReview,
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
                  key: "desc" + gradeReview.id,
                  label: "Desc",
                  children: gradeReview.desc,
                },
                {
                  key: "expectedGrade" + gradeReview.id,
                  label: "Expected Grade",
                  children: gradeReview.expectedGrade + "",
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
                itemsForGradeReviewResult = [
                  {
                    key: "point" + objectForResultReview.id,
                    label: "Point",
                    children: objectForResultReview.point,
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
                      title="Review Info"
                      items={itemsGradeReviewDesc}
                    />
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
                          title={<p>Grade review result</p>}
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
          <Col span={8}>CHAT</Col>
        </Row>
      )}
    </>
  );
};

export default Reviews;
