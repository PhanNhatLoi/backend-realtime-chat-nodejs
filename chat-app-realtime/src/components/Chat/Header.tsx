import { UserType } from "@/src/type";
import {
  ExclamationCircleOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Avatar, Button } from "antd";
import React from "react";
import { useSelector } from "react-redux";

const HeaderChat = () => {
  const online = true; //test
  const currentChat: UserType = useSelector((state: any) => state.currentChat);

  return (
    <div className="chat-header">
      <div style={{ display: "flex" }}>
        {currentChat.avatar ? (
          <img
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
            alt="avatar"
            src={currentChat.avatar}
          />
        ) : (
          <Avatar
            size={50}
            style={{
              marginRight: "10px",
            }}
          >
            {currentChat.name}
          </Avatar>
        )}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <span style={{ fontWeight: "bold", width: "100%" }}>
            {currentChat.name}
          </span>
          <span style={{ display: "flex", alignItems: "center" }}>
            <div className={`circle-${online ? "online" : "offline"}`} />{" "}
            {"Online"}
          </span>
        </div>
      </div>
      <div>
        <Button style={{ height: "100%" }} type="text">
          <PhoneOutlined style={{ fontSize: "25px" }} />
        </Button>
        <Button style={{ height: "100%" }} type="text">
          <VideoCameraOutlined style={{ fontSize: "25px" }} />
        </Button>
        <Button style={{ height: "100%" }} type="text">
          <ExclamationCircleOutlined style={{ fontSize: "25px" }} />
        </Button>
      </div>
    </div>
  );
};

export default HeaderChat;
