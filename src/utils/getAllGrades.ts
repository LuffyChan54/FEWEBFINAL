import { ColumnsType } from "antd/es/table";
import { GradeType } from "types/grade/returnCreateGrade";

export const getAllGradesIntoColumns = (
  gradeInRecursion: GradeType[],
  initialValue: any
): any => {
  const allGrades: GradeType[] = flattenGradeTypes(gradeInRecursion);

  const newColumns = allGrades.map((grade) => ({
    title: grade.label,
    width: "15%",
    dataIndex: grade.label,
    key: grade.id,
  }));

  return [initialValue[0], initialValue[1], ...newColumns, initialValue[2]];
};

const flattenGradeTypes = (grades: GradeType[]): GradeType[] => {
  let flattenedGrades: GradeType[] = [];

  grades.forEach((grade) => {
    flattenedGrades.push(grade);

    if (grade.gradeSubTypes && grade.gradeSubTypes.length > 0) {
      const tempSubType = grade.gradeSubTypes.map((gradesub) => {
        gradesub.label = gradesub.label + " < " + grade.label;
        return gradesub;
      });
      const subGradeTypes = flattenGradeTypes(tempSubType);
      flattenedGrades = flattenedGrades.concat(subGradeTypes);
    }
  });
  return flattenedGrades;
};
