import { classClient } from "lib/axios";

export const cardMappingEndpoint =
  "/api/course/d2aaf424-3f30-4d6e-889d-d368f0dca5c4/attendee/student-card";

export const getStudentInfoCard = async () => {
  const res = await classClient.get(cardMappingEndpoint);
  return res.data;
};

export const updateStudentInfoCard = async (cardID: any, payload: any) => {
  const res = await classClient.post(
    cardMappingEndpoint + "/" + cardID,
    payload
  );
  return res.data;
};

export const removeStudentInfoCard = async (cardID: any) => {
  const res = await classClient.delete(cardMappingEndpoint + "/" + cardID);
  return res.data;
};
