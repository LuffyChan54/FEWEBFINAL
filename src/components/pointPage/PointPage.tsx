import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  Badge,
  Button,
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Skeleton,
  Switch,
  Table,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import FormCreateGrade from "./FormCreateGrade/FormCreateGrade";
import {
  createGradeReviews,
  downloadGradeTemplate,
  downloadGradeTypeTemplate,
  finalizeGradeType,
  getFullArrayGradeTypeData,
  getFullGradeData,
  getIDGradeStructure,
  getStudentGradeForStudent,
  getStudentGradeForTeacher,
  updateBatchGradeForStudent,
  uploadGradeType,
  uploadStudentGrade,
} from "services/gradeService";
import { GradeType, ReturnCreateGrade } from "types/grade/returnCreateGrade";
import {
  flattenGradeTypes,
  getAllGradesIntoColumns,
  updateGradeStatusById,
} from "utils/getAllGrades";
import TreeGradeStructure from "./FormCreateGrade/TreeGradeStructure";
import {
  DownloadOutlined,
  ExportOutlined,
  FlagOutlined,
  ImportOutlined,
  NotificationOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import cloneDeep from "lodash/cloneDeep";
import { ClassEndpointWTID } from "services/classService";
import useSWR, { useSWRConfig } from "swr";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuthReducer,
  getClassOVReducer,
  removeClassOV,
  setAlert,
  setTabActive,
} from "@redux/reducer";
import { ClassOVEndpoint } from "services/classOVService";
import { removeClassOptions } from "helpers";
import { useNavigate } from "react-router-dom";
import {
  getGradeAndPercentage,
  transformFullGradesToDataGrades,
} from "utils/transformGrades";
import { EditableCell } from "./EditableCell";
import { current } from "@reduxjs/toolkit";
import Reviews from "./Reviews/Reviews";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

//testData
let data: any[] = [];

const FIXED_COLUMN = 8;

const PointPage = ({
  courseId,
  StudentInCourse,
  yourRole,
  classDetail,
  studentID,
  searchParams,
  changeSearchParams,
}: any) => {
  const [fixedTop, setFixedTop] = useState(true);
  const [isModalCreateGradeOpen, setIsModalCreateGradeOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalViewGradeOpen, setIsModalViewGradeOpen] = useState(false);
  const [widthOfScrollX, setWidthOfScrollX] = useState("162.5%");
  const [isLoadingUploadStudentGrade, setIsLoadingUploadStudentGrade] =
    useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  // const [data, setData] = useState<any>([])
  // const [gradeColumns, setGradeColumns] =
  //   useState<ColumnsType<DataType>>(InitialColumns);
  let currentRole = yourRole;
  const [isLoadingPointFirstTime, setIsLoadingPointFirstTime] = useState(true);
  const { mutate: myMutate } = useSWRConfig();
  const classOVS = useSelector(getClassOVReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(getAuthReducer);
  if (classDetail.host != null) {
    if (user.userId == classDetail.host.userId) {
      currentRole = "HOST";
    } else {
      classDetail.attendees.forEach((attendee: any) => {
        if (attendee.userId == user.userId) {
          currentRole = attendee.role;
        }
      });
    }
  }

  //EDITABLE CELL:
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: any) => record.key === editingKey;

  // console.log("EDITING KEY GLOBAL: ", editingKey);
  const editGrade = (record: any) => {
    setEditingKey(record.key);
    updateColumns(fullGradeStructure);
    form.setFieldsValue({ ...record });
  };

  const cancelEdittedGrade = () => {
    const resetCellValueObject: any = {};

    flattenGradeTypes(cloneDeep(fullGradeStructure))?.forEach(
      (columnValues) => {
        resetCellValueObject[`${columnValues.id}`] = null;
      }
    );
    form.setFieldsValue({ ...resetCellValueObject });
    setEditingKey("");
  };

  const saveEdittedGrade = async (recordKey: any) => {
    try {
      const row = (await form.validateFields()) as any;
      const newData = [...data];
      const index = newData.findIndex((item) => recordKey === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        // setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        // setData(newData);
        setEditingKey("");
      }

      updateGradeMutation(row, recordKey);
      const resetCellValueObject: any = {};

      flattenGradeTypes(cloneDeep(fullGradeStructure))?.forEach(
        (columnValues) => {
          resetCellValueObject[`${columnValues.id}`] = null;
        }
      );
      form.setFieldsValue({ ...resetCellValueObject });
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const InitialColumns: any = [
    {
      title: "Full Name",
      width: "15%",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      editable: false,
    },
    {
      title: "Student ID",
      width: "15%",
      dataIndex: "studentId",
      key: "studentId",
      fixed: "left",
      sorter: (a: any, b: any) => +a.studentId - +b.studentId,
      sortDirections: ["descend", "ascend"],
      editable: false,
    },
    {
      title: "Total grade",
      key: "total",
      dataIndex: "total",
      fixed: "right",
      width: "5%",
      editable: false,
    },
  ];

  const updateColumns = (newGradeTypes: GradeType[] | undefined) => {
    if (newGradeTypes == undefined) {
      return InitialColumns;
    }

    const temporaryGrades = getAllGradesIntoColumns(
      newGradeTypes,
      InitialColumns,
      handleUploadListGrade,
      handleMarkFinalize,
      hanlemarkUnFinalize,
      hanleDownloadGradeTypeTemplate,
      currentRole,
      saveEdittedGrade,
      cancelEdittedGrade,
      editGrade,
      editingKey
    );
    const currLength = temporaryGrades.length;
    const excess = currLength - FIXED_COLUMN;
    const percentagePerColumn = 100 / FIXED_COLUMN;
    const excessPercentage = percentagePerColumn * excess;
    const totalPercentage = excessPercentage + 100;
    setWidthOfScrollX(totalPercentage + "%");
    return temporaryGrades;
  };

  //ForSWR:

  if (StudentInCourse == null || StudentInCourse == undefined) {
    StudentInCourse = [];
  }

  // const [temporaryGradeFull, setTemporaryGradeFull] = useState<GradeType[]>([]);

  const refTemporaryGradeFull = useRef<GradeType[]>([]);
  let {
    data: fullGradeStructure,
    mutate,
    isLoading,
  } = useSWR(
    ClassEndpointWTID + courseId + "#points",
    () => getFullArrayGradeTypeData(courseId),
    {
      onSuccess: (data: GradeType[]): GradeType[] => {
        // mutate(data);
        // setTemporaryGradeFull(data)
        refTemporaryGradeFull.current = data;
        mutateStudentGrades();
        setGradeColumns(data);
        return data;
      },
      onError: (data) => {
        if (data.response.data.message == "not found course") {
          dispatch(removeClassOV({ id: courseId }));
          myMutate(
            ClassOVEndpoint,
            removeClassOptions(courseId, classOVS).optimisticData,
            false
          );
          dispatch(setTabActive("home"));
          navigate("/home");
          dispatch(
            setAlert({
              type: "info",
              value: "This class has not been found!",
            })
          );
        }
      },
    }
  );

  const cacheKeyOfStudentGrade =
    ClassEndpointWTID + courseId + "#points#fullgradeStudent";
  //STUDENT GRADE:
  let { data: fullStudentGrades, mutate: mutateStudentGrades } = useSWR(
    cacheKeyOfStudentGrade,
    async () => {
      let tempGradeStructures: any = [];
      if (fullGradeStructure?.length == 0) {
        tempGradeStructures = refTemporaryGradeFull.current;
      } else {
        tempGradeStructures = cloneDeep(fullGradeStructure);
      }
      tempGradeStructures = flattenGradeTypes(tempGradeStructures);

      let resultFullStudentGrade: any = {};
      for (let i = 0; i < tempGradeStructures.length; i++) {
        try {
          if (currentRole != "STUDENT") {
            const res = await getStudentGradeForTeacher(
              tempGradeStructures[i].id
            );
            resultFullStudentGrade[`${tempGradeStructures[i].id}`] = res;
          } else {
            const res = await getStudentGradeForStudent(
              tempGradeStructures[i].id
            );
            const newArrayStudentPoint = [];
            newArrayStudentPoint.push({
              studentId: studentID,
              point: res.point,
            });
            resultFullStudentGrade[`${tempGradeStructures[i].id}`] =
              newArrayStudentPoint;
          }
        } catch (err: any) {
          // console.log(
          //   "Failed to load grade student " + tempGradeStructures[i].label,
          //   err
          // );
        }
      }
      return resultFullStudentGrade;
    },
    {
      onSuccess: (data: any) => {
        return data;
      },
    }
  );

  const UpdateGradeOptions = (
    fullStudentGrades: any,
    objectChange: any,
    studentId: any
  ) => {
    const result = cloneDeep(fullStudentGrades);
    const updateObjectKeys = Object.keys(objectChange);
    for (const key of updateObjectKeys) {
      const studentData = result[`${key}`];
      let isExisted = false;
      for (const student of studentData) {
        if (student.studentId == studentId) {
          isExisted = true;
          student.point = objectChange[`${key}`];
          break;
        }
      }
      if (!isExisted) {
        studentData.push({
          studentId: studentId,
          point: objectChange[`${key}`],
        });
      }
    }
    return {
      optimisticData: result,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
  };

  const updateGradeMutation = async (values: any, studentId: any) => {
    try {
      await mutateStudentGrades(
        updateBatchGradeForStudent(
          fullStudentGrades,
          gradeStructureId,
          studentId,
          values
        ),
        UpdateGradeOptions(fullStudentGrades, values, studentId)
      );
      messageApi.success(
        "Update grades for student " + studentId + " successfully"
      );
    } catch (err) {
      messageApi.error("Failed to update grades for student " + studentId);
      console.log("PointPage: Failed to update grades for student ", err);
    }
  };

  //TRANSFORM OBJECT:

  data = [];
  const mapGradeAndPercentage = getGradeAndPercentage(fullGradeStructure);
  const fullGradeStudentAfterTransform = transformFullGradesToDataGrades(
    fullStudentGrades,
    mapGradeAndPercentage
  );
  StudentInCourse.forEach((student: any) => {
    if (currentRole == "STUDENT") {
      if (student.studentId == studentID) {
        const availableStudentGrade = fullGradeStudentAfterTransform.find(
          (studentInfo: any) => studentInfo.studentId == student.studentId
        );
        if (availableStudentGrade != undefined) {
          data.push({
            ...availableStudentGrade,
            name: student.fullname,
          });
        } else {
          data.push({
            key: student.studentId,
            name: student.fullname,
            studentId: student.studentId,
          });
        }
      }
    } else {
      const availableStudentGrade = fullGradeStudentAfterTransform.find(
        (studentInfo: any) => studentInfo.studentId == student.studentId
      );
      if (availableStudentGrade != undefined) {
        data.push({
          ...availableStudentGrade,
          name: student.fullname,
        });
      } else {
        data.push({
          key: student.studentId,
          name: student.fullname,
          studentId: student.studentId,
        });
      }
    }
  });

  // Object.keys(fullStudentGrades).forEach(key => {

  // })
  //For grade structureID:
  let { data: gradeColumns, mutate: mutateGradeColumn } = useSWR(
    ClassEndpointWTID + courseId + "#points#columns",
    () => {
      if (fullGradeStructure?.length == 0) {
        return updateColumns(refTemporaryGradeFull.current);
      } else {
        return updateColumns(fullGradeStructure);
      }
    },
    {
      onSuccess: (data: ColumnsType<DataType>) => {
        return data;
      },
    }
  );

  // console.log("FULL GRADE STRUCTURE", fullGradeStructure);

  // useEffect(() => {
  //   if (!isLoading) {
  //     setIsLoadingPointFirstTime(false);
  //   }
  // }, [isLoading]);

  const catchFirstLoading = useRef(0);
  if (fullGradeStructure == undefined) {
    fullGradeStructure = [];
    mutate([]);
  } else {
    if (!isLoading) {
      catchFirstLoading.current++;
      if (catchFirstLoading.current == 1) {
        setIsLoadingPointFirstTime(false);
      }
    }
  }

  const setGradeColumns = (temporaryGrades: GradeType[]) => {
    const newColumnsUpdate = updateColumns(temporaryGrades);
    // console.log("New columns: ", newColumnsUpdate);
    mutateGradeColumn(newColumnsUpdate);
  };

  //For grade structureID:
  let { data: gradeStructureId, mutate: mutateGradeStructureID } = useSWR(
    ClassEndpointWTID + courseId + "#points#GradeStructureID",
    () => getIDGradeStructure(courseId),
    {
      onSuccess: (data) => {
        return data;
      },
    }
  );

  if (gradeStructureId == undefined) {
    gradeStructureId = "";
  }
  // if (refFirstTime.current[`${courseId}`] == 1) {
  //   console.log("RESET" + courseId);
  //   refFirstTime.current[`${courseId}`]++;
  //   setIsLoadingPointFirstTime(false);
  // }

  const handleCancelCreateGrade = () => {
    setIsModalCreateGradeOpen(false);
  };

  const handleUploadListGrade = (info: any, grade: GradeType) => {
    messageApi.open({
      key: "upload_grade_type_template",
      type: "loading",
      content: "Uploading grade list for " + grade.label,
      duration: 0,
    });
    if (info.file.status !== "uploading") {
      const bodyFormData = new FormData();
      bodyFormData.append("file", info.file.originFileObj);
      uploadGradeType(grade.id, bodyFormData)
        .then((res: any) => {
          console.log("UPLOA RES:", res);
          messageApi.open({
            key: "upload_grade_type_template",
            type: "success",
            content: "Successfully uploaded",
            duration: 2,
          });
        })
        .catch((err) => {
          console.log("PointPage: Failed to upload list grade", err);
          messageApi.open({
            key: "upload_grade_type_template",
            type: "error",
            content: "Failed to upload grade list",
            duration: 2,
          });
        })
        .finally(() => {});
    }
  };
  const handleMarkFinalize = (
    grade: GradeType,
    fullGradeStructure: GradeType[] | undefined
  ) => {
    if (fullGradeStructure == undefined) {
      return;
    }
    messageApi.open({
      key: "finalize_grade_type_template",
      type: "loading",
      content: "Finalizing grade " + grade.label,
      duration: 0,
    });
    finalizeGradeType(grade.id, "DONE")
      .then(() => {
        // console.log("BEFORE FUNCTION RUUN: ", fullGradeStructure);
        const newResultAfterUpdate = updateGradeStatusById(
          cloneDeep(fullGradeStructure),
          grade.id,
          "DONE"
        );
        updateColumns(newResultAfterUpdate);
        setFullGradeStructure(newResultAfterUpdate);
        messageApi.open({
          key: "finalize_grade_type_template",
          type: "success",
          content: "Finalized Successfully",
          duration: 2,
        });
      })
      .catch((err) => {
        console.log("PointPage: failed to finalize grade ", err);
        messageApi.open({
          key: "finalize_grade_type_template",
          type: "error",
          content: "Failed to finalize the grade",
          duration: 2,
        });
      })
      .finally(() => {});
  };
  const hanlemarkUnFinalize = (
    grade: GradeType,
    fullGradeStructure: GradeType[] | undefined
  ) => {
    if (fullGradeStructure == undefined) {
      return;
    }
    messageApi.open({
      key: "unfinalize_grade_type_template",
      type: "loading",
      content: "UnFinalizing grade " + grade.label,
      duration: 0,
    });
    finalizeGradeType(grade.id, "CREATED")
      .then(() => {
        // console.log("BEFORE FUNCTION RUUN: ", fullGradeStructure);
        const newResultAfterUpdate = updateGradeStatusById(
          cloneDeep(fullGradeStructure),
          grade.id,
          "CREATED"
        );
        updateColumns(newResultAfterUpdate);
        setFullGradeStructure(newResultAfterUpdate);
        messageApi.open({
          key: "unfinalize_grade_type_template",
          type: "success",
          content: "UnFinalized Successfully",
          duration: 2,
        });
      })
      .catch((err) => {
        console.log("PointPage: failed to unfinalize grade ", err);
        messageApi.open({
          key: "unfinalize_grade_type_template",
          type: "error",
          content: "Failed to unfinalize the grade",
          duration: 2,
        });
      })
      .finally(() => {});
  };
  const hanleDownloadGradeTypeTemplate = (grade: GradeType) => {
    messageApi.open({
      key: "download_grade_type_template",
      type: "loading",
      content: "Downloading grade template for " + grade.label,
      duration: 0,
    });
    downloadGradeTypeTemplate(grade.id)
      .then(() => {
        messageApi.open({
          key: "download_grade_type_template",
          type: "success",
          content: "Successfully downloaded",
          duration: 2,
        });
      })
      .catch((err: any) => {
        console.log("PointPage: Error downloading gradetype template", err);
        messageApi.open({
          key: "download_grade_type_template",
          type: "error",
          content: "Failed to download",
          duration: 2,
        });
      })
      .finally(() => {});
  };

  const setFullGradeStructure = (newGradeStructure: GradeType[]) => {
    mutate(newGradeStructure);
  };

  const FetchAllGradesFunction = () => {
    messageApi.info("New info will be updated");
    mutate();
  };

  const timeRender = useRef(0);
  useEffect(() => {
    timeRender.current++;
    if (timeRender.current == 1) {
      // FetchAllGradesFunction();
    }
  }, []);

  const handleCancelViewGrade = () => {
    setIsModalViewGradeOpen(false);
  };

  const handleDownloadGradeTemplate = () => {
    setIsDownloading(true);
    downloadGradeTemplate(gradeStructureId)
      .then(() => {
        messageApi.success("Successfully downloaded");
      })
      .catch((err) => {
        console.log("PointPage: Failed to download template", err);
        messageApi.error("Failed to download");
      })
      .finally(() => {
        setIsDownloading(false);
      });
  };

  //For Editable cell:

  //FKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
  const newGradeInRecursion = cloneDeep(fullGradeStructure);
  const allGrades: GradeType[] = flattenGradeTypes(newGradeInRecursion);

  const [openCreateGradeReviews, setOpenCreateGradeReviews] = useState(false);
  const [gradeReviewWillCreate, setGradeReviewWillCreate] = useState<GradeType>(
    allGrades[0]
  );
  const [recordReviews, setRecordReviews] = useState<any>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleCancelCreateGradeReviews = () => {
    setOpenCreateGradeReviews(false);
  };

  const onFinishCreateGradeReviews = (values: any) => {
    setConfirmLoading(true);
    createGradeReviews({ ...values, gradeTypeId: gradeReviewWillCreate.id })
      .then((res) => {
        const newStudentGrades = cloneDeep(fullStudentGrades);
        for (const tempStudent of newStudentGrades[
          `${gradeReviewWillCreate.id}`
        ]) {
          if (studentID == tempStudent.studentId) {
            tempStudent.status = "REQUEST";
            break;
          }
        }
        myMutate(cacheKeyOfStudentGrade, newStudentGrades, false);
        // console.log("Create grade review return ", res);
        setOpenCreateGradeReviews(false);
        messageApi.success("Create grade review successfully");
      })
      .catch((err: any) => {
        messageApi.error("Failed to create grade review");
        console.log("PointPage: Failed to createGradeReview", err);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

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
                onClick={() => hanleDownloadGradeTypeTemplate(grade)}
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
                  onClick={() => hanlemarkUnFinalize(grade, fullGradeStructure)}
                />
              ) : (
                <SoundOutlined
                  onClick={() => handleMarkFinalize(grade, fullGradeStructure)}
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

        {currentRole == "STUDENT" && grade.status == "DONE" && (
          <Tooltip title="Create grade review">
            <FlagOutlined
              style={{
                width: "fit-content",
                outline: "none",
                cursor: "pointer",
                color: "#23b574",
              }}
              onClick={() => {
                setGradeReviewWillCreate(grade);
                setOpenCreateGradeReviews(true);
              }}
            />
          </Tooltip>
        )}
      </div>
    ),
    width: "15%",
    dataIndex: grade.id,
    key: grade.id,
    editable: true,
  }));

  const [hasUnreadReview, setHasUnreadReview] = useState(true);
  const [openGradeReviews, setOpenGradeReviews] = useState(false);
  const [countCloseOpen, setCountCloseOpen] = useState(0);

  if (searchParams && searchParams.studentid) {
    if (!openGradeReviews) {
      console.log(countCloseOpen);
      setOpenGradeReviews(true);
    }
  }

  const actionColumn = {
    title: "Action",
    key: "action",
    fixed: "right",
    width: "15%",
    editable: false,
    render: (_: any, record: any) => {
      const editable = record.key === editingKey;
      // console.log("EDITABLE: ", record.key, editable);
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
        <>
          {currentRole != "STUDENT" && (
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => editGrade(record)}
            >
              Edit
            </Typography.Link>
          )}
          {record.status && record.status != "NOREVIEWS" && (
            <div style={{ marginLeft: "20px", display: "inline-block" }}>
              <Badge dot={record.status == "REQUEST"}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#fadb14",
                      colorPrimaryHover: "#faad14",
                    },
                  }}
                >
                  <Button
                    style={{ outline: "none" }}
                    type={record.status == "REQUEST" ? "primary" : "dashed"}
                    onClick={() => {
                      setRecordReviews(record);
                      setCountCloseOpen(1);
                      // changeSearchParams({ studentid: record.studentId });
                      setOpenGradeReviews(true);
                    }}
                  >
                    Reviews
                  </Button>
                </ConfigProvider>
              </Badge>
            </div>
          )}
        </>
      );
    },
  };

  if (gradeColumns == undefined) {
    gradeColumns = [];
  }

  gradeColumns = [
    InitialColumns[0],
    InitialColumns[1],
    ...newColumns,
    InitialColumns[2],
    actionColumn,
  ];

  //fkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
  const mergedColumns = gradeColumns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: "number",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  // console.log(gradeStructureId);
  return (
    <>
      {isLoadingPointFirstTime ? (
        <Skeleton active />
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              {currentRole == "HOST" && (
                <Button
                  type="primary"
                  style={{ outline: "none" }}
                  onClick={() => setIsModalCreateGradeOpen(true)}
                >
                  Create new Grade Structure
                </Button>
              )}
              {/* <Button
              type="primary"
              style={{ background: "#ffc069", outline: "none", color: "#000" }}
            >
              Update Grade Structure
            </Button> */}
              <Button
                style={{ outline: "none" }}
                onClick={() => setIsModalViewGradeOpen(true)}
              >
                View Grade Structure
              </Button>
            </div>

            {currentRole == "HOST" && (
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
              >
                <Button
                  loading={isDownloading}
                  icon={<DownloadOutlined />}
                  style={{ outline: "none" }}
                  type="primary"
                  onClick={() => handleDownloadGradeTemplate()}
                >
                  Download board grade
                </Button>
                {/* <Upload
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              onChange={(info) => importFileXLSX(info)}
              showUploadList={false}
            >
              <Button
                style={{
                  outline: "none",
                  border: "none",
                }}
                icon={<ExportOutlined />}
                type="primary"
                loading={isLoadingUploadStudentGrade}
              >
                Import file xlsx
              </Button>
            </Upload> */}
              </div>
            )}
          </div>

          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              columns={mergedColumns}
              dataSource={data}
              scroll={{ x: widthOfScrollX }}
              rowClassName="editable-row"
              bordered
              summary={() => (
                <Table.Summary fixed={fixedTop ? "top" : "bottom"}>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={1}>
                      <Switch
                        checkedChildren="Fixed Top"
                        unCheckedChildren="Fixed Top"
                        checked={fixedTop}
                        onChange={() => {
                          setFixedTop(!fixedTop);
                        }}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} colSpan={8}>
                      {/* Points */}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={10}></Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
              // antd site header height
              sticky={{ offsetHeader: 64 }}
            />
          </Form>
        </div>
      )}
      <Modal
        title="Create Grade Structure"
        open={isModalCreateGradeOpen}
        onCancel={handleCancelCreateGrade}
        footer={null}
        destroyOnClose={true}
      >
        <FormCreateGrade
          gradeColumns={gradeColumns}
          setGradeColumns={setGradeColumns}
          InitialColumns={InitialColumns}
          courseId={courseId}
          setIsModalCreateGradeOpen={setIsModalCreateGradeOpen}
          messageApi={messageApi}
          gradeStructureId={gradeStructureId}
          FetchAllGradesFunction={FetchAllGradesFunction}
        />
      </Modal>
      <Modal
        title="Grade Structure"
        open={isModalViewGradeOpen}
        onCancel={handleCancelViewGrade}
        footer={null}
      >
        <TreeGradeStructure
          gradeColumns={gradeColumns}
          setGradeColumns={setGradeColumns}
          InitialColumns={InitialColumns}
          courseId={courseId}
          setIsModalCreateGradeOpen={setIsModalCreateGradeOpen}
          messageApi={messageApi}
          gradeStructureId={gradeStructureId}
          FetchAllGradesFunction={FetchAllGradesFunction}
          fullGradeStructure={fullGradeStructure}
          setIsModalViewGradeOpen={setIsModalViewGradeOpen}
          updateColumns={updateColumns}
          setFullGradeStructure={setFullGradeStructure}
          currentRole={currentRole}
        />
      </Modal>

      <Modal
        title={`Create grade review: ${gradeReviewWillCreate?.label}`}
        open={openCreateGradeReviews}
        onCancel={handleCancelCreateGradeReviews}
        footer={null}
        destroyOnClose={true}
      >
        <Form
          name="create_grade_review"
          onFinish={onFinishCreateGradeReviews}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.Item
            label="Topic"
            name="topic"
            rules={[{ required: true, message: "Missing Topic" }]}
          >
            <Input placeholder="Topic" />
          </Form.Item>
          <Form.Item
            label="Expected Grade"
            name="expectedGrade"
            rules={[{ required: true, message: "Missing expected grade" }]}
          >
            <InputNumber placeholder="Expected grade" />
          </Form.Item>
          <Form.Item
            label="Desc"
            name="desc"
            rules={[{ required: true, message: "Missing desc" }]}
          >
            <Input placeholder="Description" />
          </Form.Item>
          <Form.Item>
            <Button loading={confirmLoading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Grade reviews`}
        open={openGradeReviews}
        onCancel={() => {
          changeSearchParams({});
          setCountCloseOpen(1);
          setOpenGradeReviews(false);
        }}
        footer={null}
        destroyOnClose={true}
        width={1500}
      >
        <Reviews
          gradeStructureId={gradeStructureId}
          recordReviews={recordReviews}
          studentIdFromSearchParam={searchParams.studentid}
          courseId={courseId}
          currentRole={currentRole}
          fullStudentGrades={fullStudentGrades}
          mutateStudentGrades={mutateStudentGrades}
          cacheKeyOfStudentGrade={cacheKeyOfStudentGrade}
        />
      </Modal>

      {contextHolder}
    </>
  );
};

export default PointPage;
