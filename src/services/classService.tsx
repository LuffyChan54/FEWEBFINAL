import { classClient } from "lib/axios";

export const ClassEndpointWTID = "/api/course/";

export const getClassDetail = async (courseId: any) => {
  const res = await classClient.get(ClassEndpointWTID + courseId);
  return res.data;
};

export const updateClassDetail = async (classDetails: any) => {
  const res = await classClient.put(ClassEndpointWTID, classDetails);
  return res.data;
};

export const updateCourseInfo = async (
  courseID: any,
  data: any,
  currentData: any
) => {
  const res = await classClient.put("/api/course/" + courseID, data);
  const newInfo = res.data;
  return { ...currentData, name: newInfo.name, desc: newInfo.desc };
};

export const updateBackground = async (
  courseID: any,
  bgFile: any,
  currentData: any
) => {
  const res = await classClient.put(
    "/api/course/" + courseID + "/background",
    bgFile,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const newInfo = res.data;
  return { ...currentData, background: newInfo.background };
};

export const leaveClass = async (classID: any, studentID: any) => {
  const res = await classClient.delete(
    ClassEndpointWTID + classID + "/attendee/leave"
  );
  return res.data;
};

export const deleteClass = async (classID: any) => {
  const res = await classClient.delete(ClassEndpointWTID + classID);
  return res.data;
};

export const changeRole = async (classID: any, updateInfo: any) => {
  const res = await classClient.put(
    ClassEndpointWTID + classID + "/attendee/role",
    updateInfo
  );
  return res.data;
};

export const removeAttendee = async (classID: any, attendeeID: any) => {
  const res = await classClient.delete(
    ClassEndpointWTID + classID + "/attendee/" + attendeeID
  );
  return res.data;
};

export const downloadTemplate = async (classID: any) => {
  const res = await classClient.get(
    ClassEndpointWTID + classID + "/import/template"
  );
  const buff = new Uint8Array(res.data.buffer.data).buffer;
  const fileURL = URL.createObjectURL(
    new Blob([buff], {
      type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
  );
  const link = document.createElement("a");
  link.href = fileURL;
  link.setAttribute("download", "student-import.xlsx");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return;
};

export const uploadListStudent = async (courseID: any, listStudent: any) => {
  const res = await classClient.post(
    ClassEndpointWTID + courseID + "/import/template",
    listStudent,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const getStudentCard = async (courseID: any) => {
  const res = await classClient.get(
    ClassEndpointWTID + courseID + "/attendee/student-card"
  );
  return res.data;
};
