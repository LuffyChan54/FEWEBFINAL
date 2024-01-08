import { ClassInfoType } from "types";

export const changeRoleMutation = (
  currClassDetails: ClassInfoType,
  values: any
) => {
  if (values.role != "HOST") {
    for (let i = 0; i < currClassDetails.attendees.length; i++) {
      if (currClassDetails.attendees[i].userId == values.attendeeId) {
        currClassDetails.attendees[i].role = values.role;
        break;
      }
    }
  } else {
    let newHost = null;
    for (let i = 0; i < currClassDetails.attendees.length; i++) {
      if (currClassDetails.attendees[i].userId == values.attendeeId) {
        currClassDetails.attendees[i].role = values.role;
        const newHost = currClassDetails.attendees[i];
        currClassDetails.attendees[i] = currClassDetails.host;
        currClassDetails.attendees[i].role = "TEACHER";
        currClassDetails.host = newHost;
        break;
      }
    }
  }

  return { ...currClassDetails };
};

export const removeAttendeeMutation = (
  attendeeID: any,
  currenData: ClassInfoType
) => {
  if (currenData.attendees != null && currenData.attendees.length != 0) {
    const currAttendees = [...currenData.attendees];
    const newAttendees = currAttendees.filter((st) => {
      if (st.userId != attendeeID) {
        return st;
      }
    });
    currenData.attendees = newAttendees;
  }
  return { ...currenData };
};
