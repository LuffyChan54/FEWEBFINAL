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
