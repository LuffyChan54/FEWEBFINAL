import { Attendee } from "./ClassInfoType";

export interface ClassOverviewType {
  id: string;
  name: string;
  desc: string;
  code: string;
  background: null;
  createdAt: string;
  host: Attendee;
  profile: Attendee;
  isActive: boolean;
}
