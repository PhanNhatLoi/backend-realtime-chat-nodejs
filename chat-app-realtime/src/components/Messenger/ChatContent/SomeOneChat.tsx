import { Avatar, Card, styled } from "@mui/material";
import DividerWrapper from "./DividerWrapper";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import {
  MessagesContext,
  MessagesTypeContent,
  messageType,
} from "../../Context/MessagesContext";
import { useContext } from "react";
const CardWrapperSecondary = styled(Card)(
  () => `
        background: rgba(34, 51, 84, 0.1);
        color: rgb(34, 51, 84);
        padding: 15px;
        max-width: 380px;
        display: inline-flex;
        border-top-left-radius: 20px;

    `
);

const CardWrapperPrimary = styled(Card)(
  () => `
      background: rgb(85, 105, 255);
      color: rgb(255, 255, 255);
      padding: 15px;
      max-width: 380px;
      display: inline-flex;
      border-top-right-radius: 20px;
  `
);

const SomeOneChat = ({ messages }: { messages: messageType[] }) => {
  const user = useSelector((state: any) => state.auth.user);
  const { currentUserChatting } = useContext(MessagesContext);

  return (
    <>
      {/* <DividerWrapper>
        {new Date(Date.now()).toLocaleDateString() ===
        new Date(groupDate).toLocaleDateString()
          ? "Today"
          : format(new Date(groupDate), "MMMM dd yyyy")}
      </DividerWrapper> */}
      {messages.map((msg, index) => {
        console.log(msg, 1234);
        return (
          <div
            className={`flex items-start justify-${
              msg.from === user._id ? "end" : "start"
            } py-3`}
          >
            <div style={{ width: "50px" }}>
              {msg.from !== user._id &&
                (index === 0 || messages[index - 1].from !== msg.from) && (
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 50,
                      height: 50,
                    }}
                    alt={currentUserChatting?.name}
                    src={currentUserChatting?.avatar}
                  />
                )}
            </div>

            <div className="flex items-start justify-start flex-col mx-2">
              {msg.from === user._id ? (
                <CardWrapperPrimary>{msg.msg}</CardWrapperPrimary>
              ) : (
                <CardWrapperSecondary>{msg.msg}</CardWrapperSecondary>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SomeOneChat;
