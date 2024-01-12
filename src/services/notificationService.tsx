import { notificationClient } from "lib/axios";

export interface MaskAsReadNotification {
  notificationId: string;
  isRead: true;
}

export const getNotifications = async () => {
  const resp = await notificationClient.get("/api/notification/notifications");
  return resp.data;
};

export const maskAsSearchNotifications = async (
  notifications: MaskAsReadNotification[]
) => {
  console.log(notifications);
  const resp = await notificationClient.put(
    `/api/notification/notifications`,
    notifications
  );
  return resp.data;
};

export const upsertUserToken = async (token: string) => {
  const resp = await notificationClient.post("/api/notification/token", {
    token,
  });
  return resp.data;
};
