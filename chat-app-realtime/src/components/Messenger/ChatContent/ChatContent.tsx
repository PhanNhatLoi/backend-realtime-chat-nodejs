import SomeOneChat from "./SomeOneChat";
import { MessagesContext } from "../../Context/MessagesContext";
import { useContext } from "react";

function ChatContent() {
  const { messages } = useContext(MessagesContext);

  return (
    <div className="p-3">
      <SomeOneChat messages={messages} groupDate={"2024-04-11T16:04:04"} />
      <SomeOneChat messages={messages} groupDate={"2024-04-14T16:04:04"} />
    </div>
  );
}

export default ChatContent;
