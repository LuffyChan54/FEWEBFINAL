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

export const getIDGradeStructure = async (courseId: any) => {
  const res = await gradeClient.get(
    GradeEndpointWTID + "?courseId=" + courseId + "&take&skip"
  );
  const data: ReturnCreateGrade = res.data as ReturnCreateGrade;
  return data.id;
};

export const getFullArrayGradeTypeData = async (
  courseId: any
): Promise<GradeType[]> => {
  const res = await gradeClient.get(
    GradeEndpointWTID + "?courseId=" + courseId + "&take&skip"
  );
  const data: ReturnCreateGrade = res.data as ReturnCreateGrade;
  data.gradeTypes = await getSubGrades(data.gradeTypes);
  return data.gradeTypes;
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

export const finalizeGradeType = async (gradeTypeID: any, status: any) => {
  const res = await gradeClient.put(
    GradeEndpointWTID + "/type/" + gradeTypeID + "/finalize",
    {
      status: status,
    }
  );
  return res.data;
};

export const getStudentGradeForTeacher = async (gradeTypeID: any) => {
  const res = await gradeClient.get(
    GradeEndpointWTID + "/type/" + gradeTypeID + "/student/grade"
  );
  return res.data;
};

export const getStudentGradeForStudent = async (gradeTypeID: any) => {
  const res = await gradeClient.get(
    GradeEndpointWTID + "/type/" + gradeTypeID + "/student"
  );
  return res.data;
};

export const updateBatchGradeForStudent = async (
  fullStudentGrades: any,
  gradeStructureID: any,
  studentID: any,
  values: any
) => {
  const dataSend: any = [];
  for (const key in values) {
    dataSend.push({
      gradeTypeId: key,
      point: values[key],
    });
  }
  const res = await gradeClient.put(
    GradeEndpointWTID + "/" + gradeStructureID + "/student/" + studentID,
    dataSend
  );
  const data = res.data;
  for (const pointData of data) {
    const studentList = fullStudentGrades[`${pointData.gradeTypeId}`];
    let isExisted = false;
    for (const student of studentList) {
      if (student.studentId == studentID) {
        student.point = pointData.point;
        isExisted = true;
        break;
      }
    }
    if (!isExisted) {
      studentList.push({
        studentId: pointData.studentId,
        point: pointData.point,
      });
    }
  }
  for (const key in values) {
    if (values[key] == null) {
      const studentList = fullStudentGrades[`${key}`];
      for (const student of studentList) {
        if (student.studentId == studentID) {
          deleteStudentGrade(key, studentID);
          break;
        }
      }
    }
  }

  for (const key in values) {
    if (values[key] == null) {
      const studentList = fullStudentGrades[`${key}`];
      for (const student of studentList) {
        if (student.studentId == studentID) {
          student.point = null;
          break;
        }
      }
    }
  }

  return fullStudentGrades;
};

export const deleteStudentGrade = async (gradeTypeId: any, studentId: any) => {
  const res = await gradeClient.delete(
    GradeEndpointWTID +
      "/type/" +
      gradeTypeId +
      "/student?studentId=" +
      studentId
  );

  console.log("DELETE DATA: ", res.data);
  return res.data;
};

export const createGradeReviews = async (values: any) => {
  const res = await gradeClient.post("/api/review/grade", values);
  return res.data;
};

export const getGradeTypeReview = async (gradeTypeId: any) => {
  const res = await gradeClient.get(
    "/api/review/grade?gradeTypeId=" + gradeTypeId + "&take&skip"
  );
  return res.data;
};
