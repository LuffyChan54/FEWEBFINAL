// RCE CSS
import "react-chat-elements/dist/main.css";
import "./MyChat.css";
// MessageBox component
import { Button, Input, MessageBox, MessageList } from "react-chat-elements";
import React from "react";
import { Tag } from "antd";

const MyChat = () => {
  const messageListReferance = React.createRef();
  const inputReferance = React.createRef();

  const chatMessages: any = [
    {
      position: "right",
      type: "text",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    {
      position: "left",
      type: "text",
      text: "AHIHI",
    },
    {
      position: "right",
      type: "text",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    {
      position: "left",
      type: "text",
      text: "AHIHI",
    },
    {
      position: "right",
      type: "text",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    {
      position: "left",
      type: "text",
      text: "AHIHI",
    },
    {
      position: "right",
      type: "text",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    {
      position: "left",
      type: "text",
      text: "AHIHI",
    },
    {
      position: "right",
      type: "text",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    {
      position: "left",
      type: "text",
      text: "AHIHI",
    },
    {
      position: "right",
      type: "text",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    {
      position: "left",
      type: "text",
      text: "AHIHI",
    },
    {
      position: "right",
      type: "text",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    {
      position: "left",
      type: "text",
      text: "AHIHI",
    },
    {
      position: "right",
      type: "text",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    {
      position: "left",
      type: "text",
      text: "AHIHI",
    },
    {
      position: "right",
      type: "text",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    {
      position: "left",
      type: "text",
      text: "AHIHI",
    },
    {
      position: "right",
      type: "text",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    {
      position: "left",
      type: "text",
      text: "AHIHI",
    },
    {
      position: "right",
      type: "text",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    {
      position: "left",
      type: "text",
      text: "AHIHI",
    },
    {
      position: "right",
      type: "text",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    {
      position: "left",
      type: "text",
      text: "AHIHIhahahahahah",
    },
  ];

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
          inputStyle={{
            // boxShadow: "2px 2px 2px 2px rgba(0,0,0,0.2)",
            padding: "8px",
            borderRadius: "8px ",
          }}
          rightButtons={
            <Button color="white" backgroundColor="#23b574" text="Send" />
          }
        />
      </div>
    </>
  );
};

export default MyChat;
