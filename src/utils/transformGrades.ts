import cloneDeep from "lodash/cloneDeep";
import { GradeType } from "types/grade/returnCreateGrade";
import { flattenGradeTypes } from "./getAllGrades";

export const transformFullGradesToDataGrades = (
  inputObject: any,
  mapGradeAndPercentage: any
) => {
  const resultArray: any = [];
  // Iterate through each slug in the input object
  if (inputObject == null || inputObject == undefined) {
    inputObject = {};
  }

  const arraySlug: any = Object.keys(inputObject);

  for (let k = 0; k < arraySlug.length; k++) {
    const slugKey = arraySlug[k];
    const slugData = inputObject[slugKey];

    // Iterate through each student data in the slug
    for (const studentData of slugData) {
      const studentId = studentData.studentId;
      const point = studentData.point;
      const status = studentData.status;
      // Check if the student already exists in the result array
      const existingStudent = resultArray.find(
        (student: any) => student.studentId === studentId
      );

      if (existingStudent) {
        // If the student already exists, update the existing entry
        existingStudent[slugKey] = point;
        if (mapGradeAndPercentage[slugKey]) {
          existingStudent.total +=
            (point * mapGradeAndPercentage[slugKey]) / 100;
        }
      } else {
        const newStudent = {
          studentId: studentId,
          key: studentId,
          name: studentId,
          [slugKey]: point,
          total: 0,
          status: status,
        };
        // If the student doesn't exist, create a new entry
        if (mapGradeAndPercentage[slugKey]) {
          newStudent.total += (point * mapGradeAndPercentage[slugKey]) / 100;
        }

        resultArray.push(newStudent);
      }
    }
  }

  return resultArray;
};

export const getGradeAndPercentage = (grades: GradeType[] | undefined) => {
  if (grades == undefined) {
    return {};
  }
  let mapGradeAndPercentage: any = {};
  for (let i = 0; i < grades.length; i++) {
    mapGradeAndPercentage[`${grades[i].id}`] = grades[i].percentage;
  }
  return mapGradeAndPercentage;
};
