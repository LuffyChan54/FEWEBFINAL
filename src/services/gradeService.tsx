import { gradeClient } from "lib/axios";

export const GradeEndpointWTID = "/api/grade";

export const createGradeStructure = async (courseID: any, gradeData: any) => {
  const res = await gradeClient.post(GradeEndpointWTID, {
    courseId: courseID,
    name: "dummy",
    ...gradeData,
  });
  return res.data;
};
