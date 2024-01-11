import { Badge, Col, Row, Skeleton, Tabs } from "antd";
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

  //Handle logic:
  let itemsForGradeTypeReviews: any = [];
  if (gradeTypeReviews != undefined) {
    itemsForGradeTypeReviews = gradeTypeReviews.map((gradeTypeRV) => {
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
              const newChildReview = {
                label: (
                  <Badge dot={gradeReview.status == "REQUEST"}>
                    <div style={{ marginTop: "5px" }}>{gradeReview.topic}</div>
                  </Badge>
                ),
                key: gradeReview.id,
                children: `${gradeReview.gradeReviewResults}`,
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
