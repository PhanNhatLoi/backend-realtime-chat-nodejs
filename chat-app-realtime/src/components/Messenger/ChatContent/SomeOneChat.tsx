import { Avatar, Card, styled } from "@mui/material";
import DividerWrapper from "./DividerWrapper";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import {
  MessagesTypeContent,
  messageType,
} from "../../Context/MessagesContext";
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

const SomeOneChat = ({
  messages,
  groupDate,
}: {
  messages: messageType[];
  groupDate: string;
}) => {
  const idUser = useSelector((state: any) => state.auth.user)?.id || null;

  return (
    <>
      <DividerWrapper>
        {new Date(Date.now()).toLocaleDateString() ===
        new Date(groupDate).toLocaleDateString()
          ? "Today"
          : format(new Date(groupDate), "MMMM dd yyyy")}
      </DividerWrapper>
      {messages.map((msg, index) => {
        return (
          <div
            className={`flex items-start justify-${
              msg.from === idUser ? "end" : "start"
            } py-3`}
          >
            <div style={{ width: "50px" }}>
              {msg.from === idUser &&
                (index === 0 || messages[index - 1].from !== msg.from) && (
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 50,
                      height: 50,
                    }}
                    alt={"msg.user.name"}
                    src={"msg.user.avatar"}
                  />
                )}
            </div>

            <div className="flex items-start justify-start flex-col mx-2">
              {msg.from === idUser ? (
                <CardWrapperPrimary>{msg.msg}</CardWrapperPrimary>
              ) : (
                <CardWrapperSecondary>{msg.msg}</CardWrapperSecondary>
              )}
            </div>
            <div style={{ width: "50px" }}>
              {msg.from === idUser &&
                index !== 0 &&
                messages[index - 1].from !== msg.from && (
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 50,
                      height: 50,
                    }}
                    alt={"user.name"}
                    src={"user.avatar"}
                  />
                )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SomeOneChat;
