// RCE CSS
import "react-chat-elements/dist/main.css";
import "./MyChat.css";
// MessageBox component
import { Button, Input, MessageBox, MessageList } from "react-chat-elements";
import React, { useEffect, useState } from "react";
import { Tag } from "antd";
import io, { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { getAuthReducer } from "@redux/reducer";
import { Comment } from "types/reviews/GradeTypeReview";

export const GET_COMMENTS = "GET_COMMENTS";
export const COMMENTS_GOT = "COMMENTS_GOT";
export const CREATE_COMMENT = "CREATE_COMMENT";
export const COMMENT_CREATED = "COMMENT_CREATED";

const MyChat = ({ gradeReviewIDChat }: { gradeReviewIDChat: string }) => {
  const messageListReferance = React.createRef();
  const inputReferance: any = React.createRef();

  const [chatMessages, setChatMessages] = useState<any>([]);

  const { token, user } = useSelector(getAuthReducer);
  const [socket, setSocket] = useState<Socket>();

  const getComments = (res: Comment[]) => {
    setChatMessages([
      ...chatMessages,
      ...res.map((message) => ({
        avatar: message.avatar,
        avatarFlexible: true,
        title: (
          <Tag color={user.userId === message.senderId ? "#23b574" : "#108ee9"}>
            {message.senderName}
          </Tag>
        ),
        position: user.userId === message.senderId ? "left" : "right",
        type: "text",
        text: message.content,
      })),
    ]);
  };

  const commentCreated = (message: Comment) => {
    console.log(message);
    setChatMessages((prev: any) => {
      return [
        ...prev,
        {
          avatar: message.avatar,
          avatarFlexible: true,
          title: (
            <Tag
              color={user.userId === message.senderId ? "#23b574" : "#108ee9"}
            >
              {message.senderName}
            </Tag>
          ),
          position: user.userId === message.senderId ? "left" : "right",
          type: "text",
          text: message.content,
        },
      ];
    });
  };

  const [triggerRender, setTriggerRender] = useState("");

  useEffect(() => {
    if (!gradeReviewIDChat) {
      return;
    }

    const socket = io(import.meta.env.VITE_REVIEW_SOCKET, {
      extraHeaders: {
        authorization: "Bearer " + token.accessToken,
      },
    });

    socket.emit(
      GET_COMMENTS,
      { gradeReviewId: gradeReviewIDChat },
      getComments
    );

    socket.on(COMMENT_CREATED, commentCreated);

    setSocket(socket);

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [gradeReviewIDChat]);

  const handleSendMessage = () => {
    const messageSend = inputReferance.current.value;
    inputReferance.current.value = "";

    socket?.emit(
      CREATE_COMMENT,
      {
        gradeReviewId: gradeReviewIDChat,
        content: messageSend,
      },
      (message: Comment) => {
        setChatMessages([
          ...chatMessages,
          {
            avatar: message.avatar,
            avatarFlexible: true,
            title: (
              <Tag
                color={user.userId === message.senderId ? "#23b574" : "#108ee9"}
              >
                {message.senderName}
              </Tag>
            ),
            position: user.userId === message.senderId ? "left" : "right",
            type: "text",
            text: message.content,
          },
        ]);
      }
    );
  };

  return (
    <>
      <div
        style={{
          marginLeft: "40px",
          height: "100%",
          padding: "10px",
          background: "#d1f3e3",
          borderRadius: "8px",
        }}
      >
        <Tag color="success">Conversation</Tag>
        <div
          style={{
            height: "500px",
            // paddingBottom: "100px",
            margin: "10px 0",
            overflow: "auto",
          }}
        >
          <MessageList
            referance={messageListReferance}
            className="message-list"
            lockable={true}
            toBottomHeight={"100%"}
            dataSource={chatMessages}
          />
        </div>
        <Input
          referance={inputReferance}
          placeholder="Type here..."
          maxHeight={100}
          multiline={true}
          value={"inputValue"}
          autofocus={true}
          inputStyle={{
            // boxShadow: "2px 2px 2px 2px rgba(0,0,0,0.2)",
            padding: "8px",
            borderRadius: "8px ",
          }}
          rightButtons={
            <Button
              color="white"
              className="outline-none"
              backgroundColor="#23b574"
              text="Send"
              onClick={handleSendMessage}
            />
          }
        />
      </div>
    </>
  );
};

export default MyChat;
