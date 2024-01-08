import { ClassOverviewType } from "types";
import { createVirtualClassOV } from "utils/virtualClassOV";

export const addClassOptions = (newClasOV: any, currData: any[]) => {
  newClasOV = createVirtualClassOV(newClasOV);
  return {
    optimisticData: [...currData, newClasOV].sort(
      (a: ClassOverviewType, b: ClassOverviewType) => {
        const dateA = new Date(a.profile.joinedAt);
        const dateB = new Date(b.profile.joinedAt);

        if (dateA < dateB) {
          return 1;
        } else {
          if (dateA > dateB) {
            return -1;
          } else {
            return 0;
          }
        }
      }
    ),
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

export const removeClassOptions = (clasID: any, currData: any[]) => {
  return {
    optimisticData: currData
      .filter((classOV) => {
        if (classOV.id != clasID) {
          return classOV;
        }
      })
      .sort((a: ClassOverviewType, b: ClassOverviewType) => {
        const dateA = new Date(a.profile.joinedAt);
        const dateB = new Date(b.profile.joinedAt);

        if (dateA < dateB) {
          return 1;
        } else {
          if (dateA > dateB) {
            return -1;
          } else {
            return 0;
          }
        }
      }),
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};
