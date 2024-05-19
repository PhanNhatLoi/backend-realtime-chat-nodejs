import { Card, styled } from "@mui/material";
import { useSelector } from "react-redux";
import { MessagesContext, messageType } from "../../Context/MessagesContext";
import React, { useContext } from "react";
import MUIAvatar from "../../MUI/Avatar";
import DividerWrapper from "./DividerWrapper";
import { MoreVert } from "@mui/icons-material";
import ActionMenu from "./ActionMenu";
const CardWrapperSecondary = styled(Card)(
  ({ deleted }: { deleted?: boolean }) => `
        background: rgba(34, 51, 84, ${deleted ? "0.2" : "0.1"});
        word-break: break-word;
        color: rgb(34, 51, 84);
        padding: 15px;
        max-width: 380px;
        display: inline-flex;
        border-top-right-radius: 20px;

    `
);

const CardWrapperPrimary = styled(Card)(
  ({ deleted }: { deleted?: boolean }) => `
      background: ${deleted ? "rgba(34, 51, 84, 0.1)" : "rgb(85, 105, 255)"};
      word-break: break-word;
      color: rgb(255, 255, 255);
      padding: 15px;
      max-width: 380px;
      display: inline-flex;
      border-top-left-radius: 20px;
  `
);

const ContentMessage = styled("div")(
  () => `
  display: flex;
  align-items: center;
  .action {
    display: none;
  }
    :hover {
      .action {
        display: block;
      }
    }

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
              <ContentMessage className={`flex items-start justify-end py-3`}>
                {msg.status !== "deleted" && (
                  <ActionMenu transform="right" msgId={msg._id || ""} />
                )}
                <div className="flex items-end justify-start flex-col mx-2">
                  <CardWrapperPrimary deleted={msg.status === "deleted"}>
                    {msg.msg}
                  </CardWrapperPrimary>
                  {index === messages.length - 1 && (
                    <span className="w-full text-right text-sm text-gray-500">
                      {msg.status}
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
                </div>
                {msg.status !== "deleted" && (
                  <ActionMenu transform="left" msgId={msg._id || ""} />
                )}
              </ContentMessage>
            </React.Fragment>
          );
        }
      })}
    </>
  );
};

export default SomeOneChat;
