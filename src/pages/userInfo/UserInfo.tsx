import { getAuthReducer } from "@redux/reducer";
import { Descriptions, DescriptionsProps, Flex } from "antd";
import UpLoadStudentCard from "components/uploadStudentCard/UpLoadStudentCard";
import UserDetails from "components/userDetails/UserDetails";
import { useSelector } from "react-redux";

const UserInfo = () => {
  return (
    <div>
      <h6>User Info: </h6>
      <Flex gap={"20px"}>
        <UpLoadStudentCard />
        <UserDetails />
      </Flex>
    </div>
  );
};

export default UserInfo;
