import { Card, styled } from "@mui/material";
import { useSelector } from "react-redux";
import { MessagesContext, messageType } from "../../Context/MessagesContext";
import { useContext } from "react";
import MUIAvatar from "../../MUI/Avatar";
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
        if (msg.from === user._id) {
          return (
            <div className={`flex items-start justify-end py-3`}>
              <div style={{ width: "50px" }}></div>
              <div className="flex items-start justify-start flex-col mx-2">
                <CardWrapperPrimary>{msg.msg}</CardWrapperPrimary>
              </div>
            </div>
          );
        } else {
          return (
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
          );
        }
      })}
    </>
  );
};

export default SomeOneChat;
