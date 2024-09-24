import SomeOneChat from "./SomeOneChat";
import { MessagesContext } from "../../Context/MessagesContext";
import { useContext } from "react";

function ChatContent() {
  const { messages, currentUserChatting } = useContext(MessagesContext);
  const messagesList = messages.find((f) => f._id === currentUserChatting?._id);

  return <SomeOneChat messages={messagesList?.messages || []} />;
}

export default ChatContent;
