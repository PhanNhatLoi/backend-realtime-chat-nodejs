import { Button, styled, InputBase } from "@mui/material";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import { useSelector } from "react-redux";
import { useContext, useState } from "react";
import { MessagesContext } from "../Context/MessagesContext";
import MUIAvatar from "../MUI/Avatar";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

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
  const [openEmoji, setOpenEmoji] = useState<boolean>(false);
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

  const handleClickIcon = (emoji: EmojiClickData) => {
    setMessage((pre: string) => {
      return pre + emoji.emoji;
    });
  };

  return (
    <div className="bg-white flex items-center p-2">
      <div style={{ position: "absolute", bottom: "60px", right: 10 }}>
        <EmojiPicker open={openEmoji} onEmojiClick={handleClickIcon} />
      </div>
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
            if (event.key === "Enter" && message) handleSubmit();
          }}
        />
      </div>
      <div
        style={{
          fontSize: 30,
          marginRight: "10px",
          cursor: "pointer",
        }}
        onClick={() => {
          setOpenEmoji(!openEmoji);
        }}
      >
        😀
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
