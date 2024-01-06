import { getAuthReducer, setFullUser, setStudentInfo } from "@redux/reducer";
import { Descriptions, DescriptionsProps, Flex } from "antd";
import UpLoadStudentCard from "components/uploadStudentCard/UpLoadStudentCard";
import UserDetails from "components/userDetails/UserDetails";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "services/userService";
import { getStudentInfoCard } from "services/studentInfoService";
import UploadAvatar from "components/uploadAvatar/UploadAvatar";
const UserInfo = memo(() => {
  const dispatch = useDispatch();
  const [isFetchingUserInfo, setIsFetchingUserInfo] = useState(true);
  const [isFetchingStudentInfo, setIsFetchingStudentInfo] = useState(true);
  useEffect(() => {
    getUser()
      .then((res: any) => {
        dispatch(setFullUser(res));
      })
      .catch((err: any) => {
        console.log("UserInfo: Fail load user full info ", err);
      })
      .finally(() => setIsFetchingUserInfo(false));

    getStudentInfoCard()
      .then((res) => {
        dispatch(setStudentInfo(res));
      })
      .catch((err) => {
        console.log("UserInfo: Fail load student card info ", err);
      })
      .finally(() => setIsFetchingStudentInfo(false));
    return;
  }, []);
  return (
    <div>
      <h6>User Info: </h6>
      <Flex gap={"20px"}>
        <UpLoadStudentCard isFetchingStudentInfo={isFetchingStudentInfo} />
        <UserDetails
          isFetchingUserInfo={isFetchingUserInfo}
          isFetchingStudentInfo={isFetchingStudentInfo}
        />
        <UploadAvatar />
      </Flex>
    </div>
  );
});

export default UserInfo;
