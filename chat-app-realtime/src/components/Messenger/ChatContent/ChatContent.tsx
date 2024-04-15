import SomeOneChat from "./SomeOneChat";
import { MessagesContext } from "../../Context/MessagesContext";
import { useContext } from "react";

function ChatContent() {
  const { messages } = useContext(MessagesContext);

  return (
    <div className="p-3">
      {messages.map((mess) => {
        return (
          <SomeOneChat
            messages={mess.messages}
            groupDate={"2024-04-11T16:04:04"}
          />
        );
      })}
    </div>
  );
}

export default ChatContent;
