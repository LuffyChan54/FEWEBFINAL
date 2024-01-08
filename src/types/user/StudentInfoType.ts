export interface StudentInfoType {
  id: string;
  studentId?: string;
  name?: string;
  birthday?: string;
  cardExpiration?: string;
  degree?: string;
  department?: string;
  studentCardImage?: string;
  universityName?: string;
  userId: string;
}
export const initStudentInfoType: StudentInfoType = {
  id: "",
  studentId: "",
  name: "",
  birthday: "",
  cardExpiration: "",
  degree: "",
  department: "",
  studentCardImage: "",
  universityName: "",
  userId: "",
};
