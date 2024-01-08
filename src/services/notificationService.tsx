import { notificationClient } from "lib/axios"

export const getNotifications = async () => {
  const resp = await notificationClient.get("/api/notification/notifications");
  return resp.data;
}

export const upsertUserToken = async (token: string) => {
  const resp = await notificationClient.post("/api/notification/token", {token});
  return resp.data;
}