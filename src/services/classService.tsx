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
