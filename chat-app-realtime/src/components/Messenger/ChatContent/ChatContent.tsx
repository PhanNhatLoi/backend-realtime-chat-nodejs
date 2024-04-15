import SomeOneChat from "./SomeOneChat";
import { MessagesContext } from "../../Context/MessagesContext";
import { useContext } from "react";

function ChatContent() {
  const { messages, currentUserChatting } = useContext(MessagesContext);
  const messagesList = messages.find((f) => f._id === currentUserChatting?._id);

  return (
    <div className="p-3">
      <SomeOneChat messages={messagesList?.messages || []} />
    </div>
  );
}

export default ChatContent;
