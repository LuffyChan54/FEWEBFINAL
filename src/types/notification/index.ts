export type EventType = "event" | "message" | "notification";
export type EventStatus = "todo" | "processing" | "urgent" | "doing";
export interface NotificationTemplate {
  type: EventType;
  title: string;
  redirectEndpoint: string;
  content: string;
  status: EventStatus;
}
