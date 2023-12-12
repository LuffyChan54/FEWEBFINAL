import { getAuthReducer } from "@redux/reducer";
import { Watermark, message } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { validateInvitationEmail } from "services/inviteService";

const TemporaryPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams] = useSearchParams();

  const tokenInvitation = searchParams.get("token");
  const { token, user } = useSelector(getAuthReducer);

  useEffect(() => {
    messageApi.open({
      key: "temporaryPage",
      type: "loading",
      content: "Loading...",
      duration: 0,
    });

    if (token?.accessToken != "" && user && tokenInvitation) {
      validateInvitationEmail(tokenInvitation)
        .then((data) => {
          console.log(data);
          messageApi.open({
            key: "temporaryPage",
            type: "success",
            content: "Success! Joined course 🎉.",
            duration: 3,
          });
          window.location = `/home/course/${data.id}` as any;
        })
        .catch(() => {
          messageApi.open({
            key: "temporaryPage",
            type: "error",
            content: "Fail! Failed to join course.",
            duration: 3,
          });
        });
    } else {
      //
      const currURL = window.location.href;
      localStorage.setItem("nextRedirectURL", currURL);
      window.location = "/auth" as any;
    }
  });
  return (
    <Watermark content="HP Class">
      {contextHolder}
      <div style={{ height: "100vh", width: "100vw" }} />
    </Watermark>
  );
};

export default TemporaryPage;
