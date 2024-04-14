import React, { ReactNode, createContext, useState } from "react";

export type userType = { name: string; avatar: string; id: string };
export type MessagesTypeContent = {
  user: userType | "owner";
  content: string;
};

type MessagesContextType = {
  messages: MessagesTypeContent[];
  currentUserChatting: userType;
  pushNewMessage: (message: MessagesTypeContent) => void;
  setCurrentUserChatting: React.Dispatch<React.SetStateAction<userType>>;
};

export const MessagesContext = createContext<MessagesContextType>(
  {} as MessagesContextType
);

type Props = {
  children: ReactNode;
};

export function MessagesProvider({ children }: Props) {
  const [currentUserChatting, setCurrentUserChatting] = useState<userType>({
    name: "Zain Baptista",
    avatar: "/static/images/avatars/1.jpg",
    id: "1",
  });

  const [messages, setMessages] = useState<MessagesTypeContent[]>([
    {
      user: currentUserChatting,
      content: " Hi. Can you send me the missing invoices asap?",
    },
    {
      user: currentUserChatting,
      content: " Hi. Can you send me the missing invoices asap?",
    },
    {
      user: "owner",
      content: `Yes, I'll email them right now. I'll let you know once the remaining
      invoices are done.`,
    },
    {
      user: "owner",
      content: `Hey! Are you there?`,
    },
    {
      user: currentUserChatting,
      content: " Hi. Can you send me the missing invoices asap?",
    },
    {
      user: currentUserChatting,
      content: " Hi. Can you send me the missing invoices asap?",
    },
    {
      user: currentUserChatting,
      content: " Hi. Can you send me the missing invoices asap?",
    },
    {
      user: currentUserChatting,
      content: " Hi. Can you send me the missing invoices asap?",
    },
    {
      user: currentUserChatting,
      content: " Hi. Can you send me the missing invoices asap?",
    },
  ]);

  const pushNewMessage = (message: MessagesTypeContent) => {
    setMessages([...messages, message]);
  };

  //   fetch message

  //   fetch message

  return (
    <MessagesContext.Provider
      value={{
        messages,
        currentUserChatting,
        pushNewMessage,
        setCurrentUserChatting,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
