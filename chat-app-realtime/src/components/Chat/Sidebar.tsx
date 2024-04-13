import { Avatar } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { GetMessageResponseType, UserType } from "@/src/type";
import { dispatchSetCurrentChat } from "../../redux/actions/chatAction";

const UserMessageStyled = styled.div`
  width: 100%;
  height: 80px;
  padding: 5px 10px 5px 10px;
  .message-card {
    height: 100%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 0px 4px 0px 4px;
    .user-card-item {
      height: 100%;
      width: 100%;
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      span {
        width: 100%;
      }
    }
  }

  .message-card:hover {
    background: #f3f3f3;
  }

  .active {
    box-shadow: 1px 2px 4px #888888;
  }
`;

const SidebarChat = () => {
  const token = useSelector((state: any) => state.auth.token) || "";
  const currentChat: UserType = useSelector((state: any) => state.currentChat);
  const [userMessages, setUserMessages] = useState<GetMessageResponseType[]>(
    []
  );

  const dishpatch = useDispatch();

  const FetchMessage = async (token: string) => {
    axios
      .get("/message/getallmsg", {
        headers: { Authorization: token },
      })
      .then((res) => {
        setUserMessages(res.data);
      });
  };
  useEffect(() => {
    if (token) {
      FetchMessage(token);
    }
  }, [token]);

  const UserMessageContent = ({ item }: { item: GetMessageResponseType }) => {
    return (
      <UserMessageStyled
        key={item._id}
        onClick={() => {
          dishpatch(dispatchSetCurrentChat(item.user));
        }}
      >
        <div
          className={`message-card ${
            item._id === currentChat._id ? "active" : ""
          }`}
        >
          <div>
            {item.user.avatar ? (
              <img
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                alt="avatar"
                src={item.user.avatar}
              />
            ) : (
              <Avatar style={{ marginRight: "10px" }}>{item.user.name}</Avatar>
            )}
          </div>
          <div className="user-card-item">
            <span style={{ fontWeight: "bold" }}>{item.user.name}</span>
            <span
              style={{
                width: "calc(100% - 80px)",
                color: "#C1C1C1",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.messages[0]?.msg || ""}
            </span>
          </div>
        </div>
      </UserMessageStyled>
    );
  };
  return (
    <div className="sidebar">
      <div className="sidebar-title">
        <span className="title">Chats</span>
        <span className="number">{`(4)`}</span>
      </div>
      <div className="sidebar-scroll">
        {userMessages.length > 0 &&
          userMessages.map((item) => {
            return (
              <UserMessageContent
                key={item._id}
                item={item}
              ></UserMessageContent>
            );
          })}
      </div>
    </div>
  );
};

export default SidebarChat;
