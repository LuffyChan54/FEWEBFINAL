import { classClient } from "lib/axios";

export const BindingImgEndpoint =
  "/api/course/fb3fb492-6567-4626-851c-8147bed71a7e/attendee/student-card";

export const bindingImage = async (yourStudentCardImg: any) => {
  const res = await classClient.post(BindingImgEndpoint, yourStudentCardImg, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
