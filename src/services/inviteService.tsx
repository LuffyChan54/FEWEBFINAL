import { inviteClient } from "lib/axios";

export const sendInvitationEmail = async (emails: any[], courseId: any) => {
  const res = await inviteClient.post(
    `/api/course/${courseId}/invitation`,
    emails
  );
  const data = res.data;

  return data;
};

export const validateInvitationEmail = async (token: any) => {
  const res = await inviteClient.get(
    `/api/course/attendee/token?token=${token}`
  );
  const data = res.data;

  return data;
};
