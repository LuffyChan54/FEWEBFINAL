import React, { useEffect, useReducer, useRef, useState } from "react";
import { Button, Modal, Skeleton, Switch, Table, Upload, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import FormCreateGrade from "./FormCreateGrade/FormCreateGrade";
import {
  downloadGradeTemplate,
  downloadGradeTypeTemplate,
  finalizeGradeType,
  getFullArrayGradeTypeData,
  getFullGradeData,
  getIDGradeStructure,
  getStudentGradeForTeacher,
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
import { DownloadOutlined, ExportOutlined } from "@ant-design/icons";
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

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const InitialColumns: ColumnsType<any> = [
  {
    title: "Full Name",
    width: "15%",
    dataIndex: "name",
    key: "name",
    fixed: "left",
  },
  {
    title: "Student ID",
    width: "15%",
    dataIndex: "studentId",
    key: "studentId",
    fixed: "left",
    sorter: (a, b) => +a.studentId - +b.studentId,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Total grade",
    key: "total",
    dataIndex: "total",
    fixed: "right",
    width: "5%",
  },
  {
    title: "Action",
    key: "operation",
    fixed: "right",
    width: "5%",
    render: () => <a>action</a>,
  },
];

//testData
let data: any[] = [];
// for (let i = 0; i < 100; i++) {
//   data.push({
//     key: i,
//     name: `Edward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`,
//   });
// }

const FIXED_COLUMN = 8;

const PointPage = ({
  courseId,
  StudentInCourse,
  yourRole,
  classDetail,
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
      currentRole
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

  //STUDENT GRADE:
  let { data: fullStudentGrades, mutate: mutateStudentGrades } = useSWR(
    ClassEndpointWTID + courseId + "#points#fullgradeStudent",
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
          const res = await getStudentGradeForTeacher(
            tempGradeStructures[i].id
          );
          resultFullStudentGrade[`${tempGradeStructures[i].id}`] = res;
        } catch (err: any) {
          console.log(
            "Failed to load grade student " + tempGradeStructures[i].label,
            err
          );
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

  //TRANSFORM OBJECT:

  data = [];
  const mapGradeAndPercentage = getGradeAndPercentage(fullGradeStructure);
  const fullGradeStudentAfterTransform = transformFullGradesToDataGrades(
    fullStudentGrades,
    mapGradeAndPercentage
  );
  StudentInCourse.forEach((student: any) => {
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
    fullGradeStructure: GradeType[]
  ) => {
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
    fullGradeStructure: GradeType[]
  ) => {
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
          <Table
            columns={gradeColumns}
            dataSource={data}
            scroll={{ x: widthOfScrollX }}
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
      {contextHolder}
    </>
  );
};

export default PointPage;
