import { classOVClient } from "lib/axios";

export const ClassOVEndpoint = "/get-class-ov";

export const getClassOV = async () => {
  const res = await classOVClient.get(ClassOVEndpoint);
  const data = res.data;

  return data;
};
