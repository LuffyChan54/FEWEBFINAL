export interface Attendee {
  userId: string;
  courseId: string;
  email: any;
  role: string;
  invitationId: any;
  joinedAt: string;
  name?: string;
  picture?: string;
}

export interface ClassInfoType {
  id: string;
  name: string;
  desc: string;
  code: string;
  background: string;
  createdAt: string;
  attendees: Attendee[];
  host: Attendee;
  isActive?: boolean;
}
