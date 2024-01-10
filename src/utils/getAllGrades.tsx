import { ColumnsType } from "antd/es/table";
import { GradeType } from "types/grade/returnCreateGrade";
import cloneDeep from "lodash/cloneDeep";
import { Button, Popconfirm, Tooltip, Typography, Upload } from "antd";
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
  hanleDownloadGradeTemplate: any,
  currentRole: any,
  saveEdittedGrade: any,
  cancelEdittedGrade: any,
  editGrade: any,
  editingKey: any
): any => {
  const newGradeInRecursion = cloneDeep(gradeInRecursion);
  const allGrades: GradeType[] = flattenGradeTypes(newGradeInRecursion);

  const newColumns = allGrades.map((grade) => ({
    title: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>{grade.label} </div>

        {currentRole == "HOST" && (
          <div>
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

            <Tooltip
              title={grade.status == "DONE" ? "UnFinalized" : "Finalize"}
            >
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
          </div>
        )}
      </div>
    ),
    width: "15%",
    dataIndex: grade.id,
    key: grade.id,
    editable: true,
  }));

  const actionColumn = {
    title: "Action",
    key: "action",
    fixed: "right",
    width: "15%",
    editable: false,
    render: (_: any, record: any) => {
      const editable = record.key === editingKey;
      return editable ? (
        <span>
          <Typography.Link
            onClick={() => saveEdittedGrade(record.key)}
            style={{ marginRight: 8 }}
          >
            Save
          </Typography.Link>
          <Popconfirm title="Sure to cancel?" onConfirm={cancelEdittedGrade}>
            <a>Cancel</a>
          </Popconfirm>
        </span>
      ) : (
        <Typography.Link
          disabled={editingKey !== ""}
          onClick={() => editGrade(record)}
        >
          Edit
        </Typography.Link>
      );
    },
  };

  return [
    initialValue[0],
    initialValue[1],
    ...newColumns,
    initialValue[2],
    actionColumn,
  ];
};

export const flattenGradeTypes = (
  grades: GradeType[] | undefined
): GradeType[] => {
  if (grades == undefined) {
    return [];
  }
  grades = cloneDeep(grades);
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
  handleClickDelete: any,
  currentRole: any
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
          {currentRole == "HOST" && (
            <>
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
            </>
          )}
        </div>
      ),
      key: grade.id,
    };
    if (grade.gradeSubTypes && grade.gradeSubTypes.length > 0) {
      const children = changeGradeTypeToNode(
        grade.gradeSubTypes,
        handleClickAddSubGrade,
        handleClickUpdate,
        handleClickDelete,
        currentRole
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
