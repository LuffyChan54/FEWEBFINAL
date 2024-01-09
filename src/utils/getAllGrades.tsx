import { ColumnsType } from "antd/es/table";
import { GradeType } from "types/grade/returnCreateGrade";
import cloneDeep from "lodash/cloneDeep";
import { Button, Tooltip, Upload } from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  ImportOutlined,
  NotificationOutlined,
  PartitionOutlined,
  SoundOutlined,
  ToolOutlined,
} from "@ant-design/icons";
export const getAllGradesIntoColumns = (
  gradeInRecursion: GradeType[],
  initialValue: any,
  handleUploadListGrade: any,
  handleMarkFinalize: any,
  hanlemarkUnFinalize: any,
  hanleDownloadGradeTemplate: any
): any => {
  const newGradeInRecursion = cloneDeep(gradeInRecursion);
  const allGrades: GradeType[] = flattenGradeTypes(newGradeInRecursion);

  // console.log("Flatten", allGrades);

  const newColumns = allGrades.map((grade) => ({
    title: (
      <>
        <div>{grade.label} </div>
        <Tooltip title="Download grade template">
          <DownloadOutlined
            style={{
              outline: "none",
              cursor: "pointer",
              color: "#23b574",
            }}
            onClick={() => hanleDownloadGradeTemplate(grade)}
          />
        </Tooltip>

        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          onChange={(info) => handleUploadListGrade(info, grade)}
          showUploadList={false}
        >
          <Tooltip title="Upload grade list">
            <ImportOutlined
              style={{
                outline: "none",
                cursor: "pointer",
                color: "#23b574",
                marginLeft: "20px",
              }}
            />
          </Tooltip>
        </Upload>

        <Tooltip title={grade.status == "DONE" ? "UnFinalized" : "Finalize"}>
          {grade.status == "DONE" ? (
            <NotificationOutlined
              style={{
                marginLeft: "20px",
                outline: "none",
                cursor: "pointer",
              }}
              onClick={() => hanlemarkUnFinalize(grade, gradeInRecursion)}
            />
          ) : (
            <SoundOutlined
              onClick={() => handleMarkFinalize(grade, gradeInRecursion)}
              style={{
                marginLeft: "20px",
                outline: "none",
                cursor: "pointer",
                color: "#23b574",
              }}
            />
          )}
        </Tooltip>
      </>
    ),
    width: "15%",
    dataIndex: grade.label,
    key: grade.id,
  }));

  return [
    initialValue[0],
    initialValue[1],
    ...newColumns,
    initialValue[2],
    initialValue[3],
  ];
};

const flattenGradeTypes = (grades: GradeType[]): GradeType[] => {
  let flattenedGrades: GradeType[] = [];
  grades.forEach((grade) => {
    grade.label =
      grade.label +
      ` ${grade.parentId == null ? "(" + grade.percentage + "%)" : ""}`;
    flattenedGrades.push(grade);

    if (grade.gradeSubTypes && grade.gradeSubTypes.length > 0) {
      const tempSubType = grade.gradeSubTypes.map((gradesub) => {
        gradesub.label =
          gradesub.label + ` (${gradesub.percentage}%) ` + " < " + grade.label;
        return gradesub;
      });
      const subGradeTypes = flattenGradeTypes(tempSubType);
      flattenedGrades = flattenedGrades.concat(subGradeTypes);
    }
  });
  return flattenedGrades;
};

export const changeGradeTypeToNode = (
  grades: GradeType[],
  handleClickAddSubGrade: any,
  handleClickUpdate: any,
  handleClickDelete: any
) => {
  return grades.map((grade) => {
    const newNode: any = {
      title: (
        <div
          style={{
            marginLeft: "20px",
            display: "flex",
            gap: "10px",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <div>
            {" "}
            {grade.label}{" "}
            <i
              style={{ color: "rgba(0,0,0,0.5)" }}
            >{` (${grade.percentage}%)`}</i>{" "}
          </div>

          <Tooltip title="Add sub grade">
            <PartitionOutlined
              style={{ color: "#23b574", cursor: "pointer" }}
              onClick={() => handleClickAddSubGrade(grade)}
            />
          </Tooltip>

          <Tooltip title="Update grade">
            <ToolOutlined
              style={{ color: "#ffc53d", cursor: "pointer" }}
              onClick={() => handleClickUpdate(grade)}
            />
          </Tooltip>
          <Tooltip title="Delete grade">
            <DeleteOutlined
              style={{ color: "#ff4d4f", cursor: "pointer" }}
              onClick={() => handleClickDelete(grade)}
            />
          </Tooltip>
        </div>
      ),
      key: grade.id,
    };
    if (grade.gradeSubTypes && grade.gradeSubTypes.length > 0) {
      const children = changeGradeTypeToNode(
        grade.gradeSubTypes,
        handleClickAddSubGrade,
        handleClickUpdate,
        handleClickDelete
      );
      newNode.children = children;
    }
    return newNode;
  });
};

export const deleteGradeById = (
  grades: GradeType[],
  gradeIdToDelete: any
): GradeType[] => {
  return grades.reduce((acc, grade) => {
    if (grade.id === gradeIdToDelete) {
      // Grade found, skip it (effectively removing it)
      return acc;
    }

    if (grade.gradeSubTypes && grade.gradeSubTypes.length > 0) {
      // Recursively delete from subgrades
      grade.gradeSubTypes = deleteGradeById(
        grade.gradeSubTypes,
        gradeIdToDelete
      );
    }

    return [...acc, grade];
  }, [] as GradeType[]);
};

export const updateGradeById = (
  grades: GradeType[],
  gradeIdToUpdate: string,
  updatedInfo: any
): GradeType[] => {
  return grades.map((grade) => {
    if (grade.id === gradeIdToUpdate) {
      grade.label = updatedInfo.label;
      grade.percentage = updatedInfo.percentage;
      grade.desc = updatedInfo.desc;
      return cloneDeep(grade);
    }

    if (grade.gradeSubTypes && grade.gradeSubTypes.length > 0) {
      // Recursively update subgrades
      grade.gradeSubTypes = updateGradeById(
        grade.gradeSubTypes,
        gradeIdToUpdate,
        updatedInfo
      );
    }

    return grade;
  });
};

export const updateGradeStatusById = (
  grades: GradeType[],
  gradeIdToUpdate: any,
  status: any
): GradeType[] => {
  return grades.map((grade) => {
    if (grade.id === gradeIdToUpdate) {
      grade.status = status;
      return cloneDeep(grade);
    }

    if (grade.gradeSubTypes && grade.gradeSubTypes.length > 0) {
      // Recursively update subgrades
      grade.gradeSubTypes = updateGradeStatusById(
        grade.gradeSubTypes,
        gradeIdToUpdate,
        status
      );
    }

    return grade;
  });
};
