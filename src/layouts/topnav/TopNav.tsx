import { getAuthReducer } from "@redux/reducer";
import { Flex } from "antd";
import MyAlert from "components/myAlert/MyAlert";
import MyUser from "components/myUser/MyUser";
import { memo } from "react";
import { useSelector } from "react-redux";
const TopNav = memo(() => {
  const { user } = useSelector(getAuthReducer);
  return (
    <Flex gap="large" justify="space-between" align="center">
      <h5 style={{ color: "#23b574" }}>Wellcome: {user.name}</h5>
      <Flex gap="large" justify="flex-end" align="center">
        <MyAlert />
        <MyUser />
      </Flex>
    </Flex>
  );
});

export default TopNav;
