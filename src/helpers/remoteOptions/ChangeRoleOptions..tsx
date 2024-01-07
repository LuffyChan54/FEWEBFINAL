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

  console.log("ChangeRoleOptions: ", currClassDetails);
  return { ...currClassDetails };
};
