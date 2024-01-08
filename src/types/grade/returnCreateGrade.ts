export interface GradeType {
  id: String;
  gradeStructureId: String;
  percentage: Number;
  label: String;
  desc: String;
  type: String;
  status: String;
  created_at: String;
  updated_at: String;
  parentId: String;
  gradeSubTypes?: GradeType[];
}

export interface ReturnCreateGrade {
  id: String;
  courseId: String;
  name: String;
  status: String;
  gradeTypes: GradeType[];
}
