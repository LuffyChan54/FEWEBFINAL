import { gradeClient } from "lib/axios";
import { GradeType, ReturnCreateGrade } from "types/grade/returnCreateGrade";

export const GradeEndpointWTID = "/api/grade";

export const createGradeStructure = async (courseID: any, gradeData: any) => {
  const res = await gradeClient.post(GradeEndpointWTID, {
    courseId: courseID,
    name: "dummy",
    ...gradeData,
  });
  return res.data;
};

export const createGradeStructureBatch = async (
  gradeStructureId: any,
  gradeData: any
) => {
  const res = await gradeClient.put(
    GradeEndpointWTID + "/" + gradeStructureId + "/type/batch",
    gradeData.gradeTypes
  );
  return res.data;
};

export const getFullGradeData = async (
  courseId: any
): Promise<ReturnCreateGrade> => {
  const res = await gradeClient.get(
    GradeEndpointWTID + "?courseId=" + courseId + "&take&skip"
  );
  const data: ReturnCreateGrade = res.data as ReturnCreateGrade;
  data.gradeTypes = await getSubGrades(data.gradeTypes);
  return data;
};

const getSubGrades = async (grades: GradeType[]): Promise<GradeType[]> => {
  const processedGrades = await Promise.all(
    grades.map(async (grade) => {
      const getSubTypeRes = await gradeClient.get(
        GradeEndpointWTID + "/type/" + grade.id + "?take=&skip="
      );
      const subTypeData = getSubTypeRes.data as GradeType;
      if (subTypeData.gradeSubTypes && subTypeData.gradeSubTypes?.length > 0) {
        subTypeData.gradeSubTypes = await getSubGrades(
          subTypeData.gradeSubTypes
        );
      }
      grade.gradeSubTypes = subTypeData.gradeSubTypes;
      return grade;
    })
  );
  return processedGrades;
};

export const deleteGrade = async (gradeID: any) => {
  const res = await gradeClient.delete(GradeEndpointWTID + "/type/" + gradeID);
  return res.data;
};
