import { userClient, classClient } from "lib/axios";

export interface CreateUser {
  email: string;
  password: string;
  role: string;
}

export interface CreateCourse {
  name: string;
  desc: string;
  userId: string;
}

export interface Filter {
  take: number;
  skip: number;
}

export const getUsers = async () => {
  const res = await userClient.get("/api/admin/users");
  return res.data;
};

export const getUser = async (id: string) => {
  const res = await userClient.get(`/api/admin/users/${id}`);
  return res.data;
};

export const createUser = async (user: CreateUser) => {
  const res = await userClient.post(`/api/admin/user`, {
    ...user,
    userMetadata: {
      role: user.role,
    },
  });
  return res.data;
};

export const toggleActiveUser = async (userId: string, isActive: boolean) => {
  const res = await userClient.put(`/api/admin/user/${userId}`, {
    blocked: isActive,
  });
  return res.data;
};

export const getUserStudentCard = async (userId: string) => {
  const res = await classClient.get(
    `/api/admin/course/student/card?userId=${userId}`
  );
  return res.data;
};

export const getCourses = async (filter: Filter, userId: string) => {
  const res = await classClient.get(
    `/api/admin/course/take=${filter.take}&skip=${filter.skip}$userId=${userId}`
  );
  return res.data;
};

export const getCourse = async (courseId: string) => {
  const res = await classClient.get(`/api/admin/course/${courseId}`);
  return res.data;
};

export const createCourse = async (
  courseId: string,
  createCourse: CreateCourse
) => {
  const res = await classClient.post(
    `/api/admin/course/${courseId}`,
    createCourse
  );
  return res.data;
};

export const inactiveCourse = async (courseId: string) => {
  const res = await classClient.put(`/api/admin/course/${courseId}`, {
    isActive: false,
  });
  return res.data;
};

export const activeCourse = async (courseId: string) => {
  const res = await classClient.put(`/api/admin/course/${courseId}`, {
    active: true,
  });
  return res.data;
};

export const deleteCourse = async (courseId: string) => {
  const res = await classClient.delete(`/api/admin/course/${courseId}`);
  return res.data;
};

export const getStudentCardMappingTemplate = async () => {
  const res = await classClient.get(`/api/admin/course/template/import`);
  const buff = new Uint8Array(res.data.buffer.data).buffer;
  const fileURL = URL.createObjectURL(
    new Blob([buff], {
      type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
  );
  const link = document.createElement("a");
  link.href = fileURL;
  link.setAttribute("download", res.data.fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const mappingStudentCard = async (file: any) => {
  const res = await classClient.put("/api/admin/course/template/import", file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
