import { ClassOverviewType } from "types";

export const createVirtualClassOV = (tempClass: any): ClassOverviewType => {
  const result: ClassOverviewType = {
    id: "pending..." + Math.random(),
    name: tempClass.name,
    desc: tempClass.desc,
    code: "pending...",
    background: null,
    createdAt: new Date().toISOString(),
    host: {
      userId: "pending..." + Math.random(),
      courseId: "pending...",
      email: "pending...",
      role: "HOST",
      invitationId: null,
      joinedAt: new Date().toISOString(),
      name: "peding...",
    },
    profile: {
      userId: "pending..." + Math.random(),
      courseId: "pending...",
      email: "pending...",
      role: "HOST",
      invitationId: null,
      joinedAt: new Date().toISOString(),
      name: "peding...",
    },
  };

  return result;
};

export const changeToClassOV = (data: any): ClassOverviewType => {
  data.profile = data.host;

  return data;
};
