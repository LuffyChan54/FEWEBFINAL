import { classClient } from "lib/axios";

export const ClassEndpointWTID = "/get-class";

export const getClassDetail = async (classID: string) => {
  const res = await classClient.get(ClassEndpointWTID);
  return res.data;
};
