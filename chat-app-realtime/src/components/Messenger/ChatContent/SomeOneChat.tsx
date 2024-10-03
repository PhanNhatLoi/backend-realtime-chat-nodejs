import { Card, styled } from "@mui/material";
import { useSelector } from "react-redux";
import { MessagesContext, messageType } from "../../Context/MessagesContext";
import React, { useContext } from "react";
import MUIAvatar from "../../MUI/Avatar";
import DividerWrapper from "./DividerWrapper";
import ActionMenu from "./ActionMenu";
import { Emoji } from "emoji-picker-react";
const CardWrapperSecondary = styled(Card)(
  ({ deleted }: { deleted?: boolean }) =>
    `
        background: rgba(34, 51, 84, 1);
        word-break: break-word;
        color: rgb(255, 255, 255);
        padding: 15px;
        max-width: 380px;
        display: inline-flex;
        border-top-right-radius: 20px;
        ${
          deleted &&
          `
            box-shadow: none;
            background: rgba(34, 51, 84, 0.8);
            color: rgba(255, 255, 255,0.2);
          `
        }
    `
);

const CardWrapperPrimary = styled(Card)(
  ({ deleted }: { deleted?: boolean }) => `
      background: rgb(85, 105, 255);
      word-break: break-word;
      color: rgb(255, 255, 255);
      padding: 15px;
      max-width: 380px;
      display: inline-flex;
      border-top-left-radius: 20px;
      ${
        deleted &&
        `
          box-shadow: none;
          background: rgba(34, 51, 84, 0.8);
          color: rgba(34, 51, 84, 0.2);
        `
      }
  `
);

const ContentMessage = styled("div")(
  () => `
  display: flex;
  align-items: center;

   .emoji {
    transform: translate(0, -10px);
    width:100%;
    display:flex;
    flex-direction: row;
    }
    
    .emoji .icon {
      background: white;
      border-radius: 20px;
      padding: 2px;
    }

  .action {
    display: none;
  }
    :hover {
      .action {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
    }
  `
);

const SomeOneChat = ({ messages }: { messages: messageType[] }) => {
  const user = useSelector((state: any) => state.auth.user);
  const { currentUserChatting } = useContext(MessagesContext);

  const lastSeenIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].status === "seen") {
        return i;
      }
    }
    return -1;
  })();

  return (
    <div className="p-3">
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
        if (msg.from === user?._id) {
          return (
            <React.Fragment key={index}>
              {dateTime && <DividerWrapper>{dateTime}</DividerWrapper>}
              <ContentMessage className={`flex items-start justify-end py-3`}>
                {msg.status !== "deleted" && (
                  <>
                    <ActionMenu owner transform="right" msg={msg} />
                  </>
                )}
                <div className="flex items-end justify-start flex-col mx-2">
                  <CardWrapperPrimary deleted={msg.status === "deleted"}>
                    {msg.msg}
                  </CardWrapperPrimary>
                  {msg.react && msg.status !== "deleted" && (
                    <div
                      className="emoji"
                      style={{ justifyContent: "flex-start" }}
                    >
                      <div className="icon">
                        <Emoji unified={msg.react.split("|")[0]} size={20} />
                      </div>
                    </div>
                  )}
                  {index === messages.length - 1 && msg.status !== "seen" && (
                    <span className="w-full text-right text-sm text-gray-500">
                      {msg.status}
                    </span>
                  )}
                  {index === lastSeenIndex && (
                    <span className="w-full flex justify-end mt-2">
                      <MUIAvatar
                        sx={{
                          background: "red",
                          width: 20,
                          height: 20,
                        }}
                        alt={currentUserChatting?.name}
                        src={currentUserChatting?.avatar || ""}
                      />
                    </span>
                  )}
                </div>
              </ContentMessage>
            </React.Fragment>
          );
        } else {
          return (
            <React.Fragment key={index}>
              {dateTime && <DividerWrapper>{dateTime}</DividerWrapper>}
              <ContentMessage className={`flex items-start justify-start py-3`}>
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
                  <CardWrapperSecondary deleted={msg.status === "deleted"}>
                    {msg.msg}
                  </CardWrapperSecondary>
                  {msg.react && msg.status !== "deleted" && (
                    <div
                      className="emoji"
                      style={{ justifyContent: "flex-end" }}
                    >
                      <div className="icon">
                        <Emoji unified={msg.react.split("|")[0]} size={20} />
                      </div>
                    </div>
                  )}
                </div>
                {msg.status !== "deleted" && (
                  <>
                    <ActionMenu owner={false} transform="left" msg={msg} />
                  </>
                )}
              </ContentMessage>
            </React.Fragment>
          );
        }
      })}
    </div>
  );
};

export default SomeOneChat;
