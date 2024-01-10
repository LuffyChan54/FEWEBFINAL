export const transformFullGradesToDataGrades = (inputObject: any) => {
  const resultArray: any = [];

  // Iterate through each slug in the input object
  for (const slugKey in inputObject) {
    const slugData = inputObject[slugKey];

    // Iterate through each student data in the slug
    for (const studentData of slugData) {
      const studentId = studentData.studentId;
      const point = studentData.point;

      // Check if the student already exists in the result array
      const existingStudent = resultArray.find(
        (student: any) => student.studentId === studentId
      );

      if (existingStudent) {
        // If the student already exists, update the existing entry
        existingStudent[slugKey] = point;
        existingStudent.total += point;
      } else {
        // If the student doesn't exist, create a new entry
        const newStudent = {
          studentId: studentId,
          key: studentId,
          name: studentId,
          [slugKey]: point,
          total: point,
        };

        resultArray.push(newStudent);
      }
    }
  }

  return resultArray;
};
