import { Avatar, Button, styled, InputBase } from "@mui/material";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import { useSelector } from "react-redux";
import { useContext, useEffect, useRef, useState } from "react";
import { MessagesContext, messageType } from "../Context/MessagesContext";
import { io } from "socket.io-client";

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
  const { pushNewMessage, currentUserChatting, messages } =
    useContext(MessagesContext);

  const socket: any = useRef();

  useEffect(() => {
    socket.current = io("http://localhost:8000");
  }, []);

  useEffect(() => {
    if (user?._id && socket.current) {
      socket.current.emit("online", user._id);
    }
  }, [user, socket]);

  useEffect(() => {
    if (socket.current) {
      console.log(1234);
      socket.current.on("msg-recieve", (msg: messageType) => {
        pushNewMessage({
          ...msg,
          status: "sent",
        });
      });
    }
  }, []);

  const handleSubmit = () => {
    if (currentUserChatting) {
      pushNewMessage({
        from: user._id,
        to: currentUserChatting?._id || "",
        msg: message,
        status: "sending",
      });
      setMessage("");
    }
  };

  return (
    <div className="bg-white flex items-center p-2">
      <div className="flex items-center grow">
        <Avatar
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
