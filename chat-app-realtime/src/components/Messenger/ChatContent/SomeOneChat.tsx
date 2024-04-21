import { Card, styled } from "@mui/material";
import { useSelector } from "react-redux";
import { MessagesContext, messageType } from "../../Context/MessagesContext";
import React, { useContext } from "react";
import MUIAvatar from "../../MUI/Avatar";
import DividerWrapper from "./DividerWrapper";
const CardWrapperSecondary = styled(Card)(
  () => `
        background: rgba(34, 51, 84, 0.1);
        word-break: break-word;
        color: rgb(34, 51, 84);
        padding: 15px;
        max-width: 380px;
        display: inline-flex;
        border-top-right-radius: 20px;

    `
);

const CardWrapperPrimary = styled(Card)(
  () => `
      background: rgb(85, 105, 255);
      word-break: break-word;
      color: rgb(255, 255, 255);
      padding: 15px;
      max-width: 380px;
      display: inline-flex;
      border-top-left-radius: 20px;
  `
);

const SomeOneChat = ({ messages }: { messages: messageType[] }) => {
  const user = useSelector((state: any) => state.auth.user);
  const { currentUserChatting } = useContext(MessagesContext);

  return (
    <>
      {messages.map((msg, index) => {
        const dateTime =
          msg.createdAt &&
          (index === 0 ||
            new Date(messages[index - 1].createdAt || "").toDateString() !==
              new Date(msg.createdAt).toDateString())
            ? new Date(msg.createdAt).toDateString() ===
              new Date(Date.now()).toDateString()
              ? "To day"
              : new Date(msg.createdAt).toDateString()
            : null;
        if (msg.from === user._id) {
          return (
            <React.Fragment key={index}>
              {dateTime && <DividerWrapper>{dateTime}</DividerWrapper>}
              <div className={`flex items-start justify-end py-3`}>
                <div className="flex items-end justify-start flex-col mx-2">
                  <CardWrapperPrimary>{msg.msg}</CardWrapperPrimary>
                  {/* {index === messages.length - 1 && (
                    <span className="w-full text-right text-sm text-gray-500">
                      {msg.status}
                    </span>
                  )} */}
                </div>
              </div>
            </React.Fragment>
          );
        } else {
          return (
            <React.Fragment key={index}>
              {dateTime && <DividerWrapper>{dateTime}</DividerWrapper>}
              <div className={`flex items-start justify-start py-3`}>
                <div style={{ width: "50px" }}>
                  {(index === 0 || messages[index - 1].from !== msg.from) && (
                    <MUIAvatar
                      sx={{
                        width: 50,
                        height: 50,
                      }}
                      alt={currentUserChatting?.name}
                      src={currentUserChatting?.avatar || ""}
                    />
                  )}
                </div>
                <div className="flex items-start justify-start flex-col mx-2">
                  <CardWrapperSecondary>{msg.msg}</CardWrapperSecondary>
                </div>
              </div>
            </React.Fragment>
          );
        }
      })}
    </>
  );
};

export default SomeOneChat;
