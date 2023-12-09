import { ClassOverviewType } from "types";

export const addClassOptions = (
  newTodo: ClassOverviewType,
  todos: ClassOverviewType[]
) => {
  return {
    optimisticData: [...todos, newTodo].sort((a, b) => 1),
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};
