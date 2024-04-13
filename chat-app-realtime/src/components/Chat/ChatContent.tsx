import { UserType, messageType } from "@/src/type";
import { Avatar } from "antd";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const ChatItemStyled = styled.div`
  font-size: 20px;
  display: flex;
  margin-bottom: 10px;
  .msg {
    padding: 5px;
    max-width: 60%;
    border-radius: 10px;
    word-break: break-all;
  }
  .from {
    background: #3e4bff;
    color: white;
  }
  .to {
    background: #7ee5a0;
  }
`;

const ChatContent = () => {
  const [messages, setMessages] = useState<messageType[]>([]);

  const auth = useSelector((state: any) => state.auth);
  const { user, token } = auth;
  const currentChat: UserType = useSelector((state: any) => state.currentChat);

  useEffect(() => {
    async function FetchMessage(token: string) {
      Axios.get("/message/getmsg", {
        headers: { Authorization: token, userId: currentChat._id },
      }).then((res) => {
        const { data } = res;
        setMessages(data.messages);
      });
    }

    if (token && currentChat) FetchMessage(token);
  }, [token, currentChat]);

  const MsgFromContainer = ({ msg }: { msg: messageType }) => {
    return (
      <ChatItemStyled>
        <div>
          {user.avatar ? (
            <img
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
              alt="avatar"
              src={user.avatar}
            />
          ) : (
            <Avatar
              size={50}
              style={{
                marginRight: "10px",
              }}
            >
              {msg.from}
            </Avatar>
          )}
        </div>
        <div className="msg from">{msg.msg}</div>
      </ChatItemStyled>
    );
  };

  const MsgToContainer = ({ msg }: { msg: messageType }) => {
    return (
      <ChatItemStyled style={{ justifyContent: "end" }}>
        <div className="msg to">{msg.msg}</div>

        <div>
          {currentChat.avatar ? (
            <img
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                marginLeft: "10px",
              }}
              alt="avatar"
              src={currentChat.avatar}
            />
          ) : (
            <Avatar
              size={50}
              style={{
                marginLeft: "10px",
              }}
            >
              {msg.to}
            </Avatar>
          )}
        </div>
      </ChatItemStyled>
    );
  };

  return (
    <div className="chat-content">
      {user &&
        messages.map((msg) => {
          return msg.from === user._id ? (
            <MsgFromContainer msg={msg} />
          ) : (
            <MsgToContainer msg={msg} />
          );
        })}
    </div>
  );
};

export default ChatContent;
