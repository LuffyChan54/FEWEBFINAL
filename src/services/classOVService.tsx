import { classOVClient } from "lib/axios";
import { ClassOverviewType } from "types";
import { changeToClassOV } from "utils/virtualClassOV";

export const ClassOVEndpoint = "/api/course";

export const getClassOV = async () => {
  const res = await classOVClient.get(ClassOVEndpoint);
  const data = res.data;
  return data;
};

export const createClassOV = async (newClasOV: any, currData: any) => {
  const res = await classOVClient.post(ClassOVEndpoint, newClasOV);

  const data = res.data;

  const newClassOVRS = changeToClassOV(data);

  const result = [...currData, newClassOVRS];

  return result.sort((a: ClassOverviewType, b: ClassOverviewType) => {
    const dateA = new Date(a.profile.joinedAt);
    const dateB = new Date(b.profile.joinedAt);

    if (dateA < dateB) {
      return 1;
    } else {
      if (dateA > dateB) {
        return -1;
      } else {
        return 0;
      }
    }
  });
};

export const joinClassOV = async (courseCode: any, currData: any) => {
  const res = await classOVClient.put(ClassOVEndpoint + "/attendee/code", {
    code: courseCode,
  });
  const data = res.data;

  const result = [...currData, data];

  return result.sort((a: ClassOverviewType, b: ClassOverviewType) => {
    const dateA = new Date(a.profile.joinedAt);
    const dateB = new Date(b.profile.joinedAt);

    if (dateA < dateB) {
      return 1;
    } else {
      if (dateA > dateB) {
        return -1;
      } else {
        return 0;
      }
    }
  });
};
