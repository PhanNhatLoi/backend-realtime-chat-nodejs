import { Button, styled, InputBase } from "@mui/material";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import { useSelector } from "react-redux";
import { useContext, useState } from "react";
import { MessagesContext } from "../Context/MessagesContext";
import MUIAvatar from "../MUI/Avatar";

const MessageInputWrapper = styled(InputBase)(
  () => `
    font-size: 18px;
    padding: 10xp;
    width: 100%;
`
);

function BottomBarContent() {
  const user = useSelector((state: any) => state.auth.user);
  const [message, setMessage] = useState<string>("");
  const { pushNewMessage, currentUserChatting } = useContext(MessagesContext);

  const handleSubmit = () => {
    if (currentUserChatting) {
      pushNewMessage({
        from: user._id,
        to: currentUserChatting?._id || "",
        msg: message,
        status: "sending...",
      });
      setMessage("");
    }
  };

  return (
    <div className="bg-white flex items-center p-2">
      <div className="flex items-center grow">
        <MUIAvatar
          sx={{ display: { xs: "none", sm: "flex" }, mr: 1 }}
          alt={user.name}
          src={user.avatar}
        />

        <MessageInputWrapper
          autoFocus
          placeholder="Write your message here..."
          fullWidth
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSubmit();
          }}
        />
      </div>
      <div>
        <Button
          disabled={!message}
          onClick={handleSubmit}
          startIcon={<SendTwoToneIcon />}
          variant="contained"
        >
          Send
        </Button>
      </div>
    </div>
  );
}

export default BottomBarContent;
