import { getRefreshToken, gradeClient } from "lib/axios";
import { GradeType, ReturnCreateGrade } from "types/grade/returnCreateGrade";
import { getNextExpiresTime, isTokenStillValid } from "utils/expiresTime";

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

export const updateGrade = async (gradeID: any, newGradeData: any) => {
  const res = await gradeClient.put(
    GradeEndpointWTID + "/type/" + gradeID,
    newGradeData
  );
  return res.data;
};

export const addSubGrade = async (gradeID: any, values: any) => {
  const res = await gradeClient.put(
    GradeEndpointWTID + "/type/" + gradeID + "/sub/batch",
    values
  );
  return res.data;
};

export const downloadGradeTemplate = async (gradeStructureID: any) => {
  const res = await gradeClient.get(
    GradeEndpointWTID + "/" + gradeStructureID + "/board"
  );
  const buff = new Uint8Array(res.data.buffer.data).buffer;
  const fileURL = URL.createObjectURL(
    new Blob([buff], {
      type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
  );
  const link = document.createElement("a");
  link.href = fileURL;
  link.setAttribute("download", "grade-board.xlsx");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const uploadStudentGrade = async (gradeID: any, formData: any) => {
  const res = await gradeClient.put(
    GradeEndpointWTID + "/type/" + gradeID + "/student/template/import",
    formData
  );
  return res.data;
};

export const downloadGradeTypeTemplate = async (gradeTypeID: any) => {
  // api/grade/type/:id/student/grade
  const res = await gradeClient.get(
    GradeEndpointWTID + "/type/" + gradeTypeID + "/student/template/import"
  );
  const buff = new Uint8Array(res.data.buffer.data).buffer;
  const fileURL = URL.createObjectURL(
    new Blob([buff], {
      type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
  );
  const link = document.createElement("a");
  link.href = fileURL;
  link.setAttribute("download", res.data.fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return;
};

export const uploadGradeType = async (gradeTypeID: any, formData: any) => {
  // api/grade/type/:id/student/grade
  const res = await gradeClient.put(
    GradeEndpointWTID + "/type/" + gradeTypeID + "/student/template/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};
