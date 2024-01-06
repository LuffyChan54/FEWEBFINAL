import { ClassInfoType } from "types";

export const updateClassOptions = (newClasOV: any, currData: ClassInfoType) => {
  return {
    optimisticData: { ...currData, ...newClasOV },
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

export const updateClassBackground = (
  bgFileSRC: any,
  currData: ClassInfoType
) => {
  return {
    optimisticData: { ...currData, background: bgFileSRC },
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};
