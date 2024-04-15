import React, { ReactNode, createContext, useState } from "react";

export type userType = {
  _id: string;
  name: string;
  email: string;
  // "role": number,
  state: string;
  socketId: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
};
export type messageType = {
  _id?: string;
  from: string;
  to: string;
  msg: string;
  createdAt?: string;
  updatedAt?: string;
};
export type MessagesTypeContent = {
  _id: string;
  messages: messageType[];
  user: userType;
};

type MessagesContextType = {
  messages: MessagesTypeContent[];
  currentUserChatting: userType;
  pushNewMessage: (message: { msg: string; sendTo: string }) => void;
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
    _id: "1",
    email: "",
    state: "",
    socketId: "",
    createdAt: "",
    updatedAt: "",
  });

  const [messages, setMessages] = useState<MessagesTypeContent[]>([
    {
      _id: "661a276a55c015162f87d945",
      messages: [
        {
          _id: "661cb035e20b9bde7e25eae2",
          from: "661809f4a4490454d61bc0f0",
          to: "661a276a55c015162f87d945",
          msg: "message to nhatloi123",
          createdAt: "2024-04-15T04:42:29.878Z",
          updatedAt: "2024-04-15T04:42:29.878Z",
        },
      ],
      user: {
        _id: "661a276a55c015162f87d945",
        name: "nhatloi",
        email: "nhatloi123@gmail.com",
        state: "Offline",
        socketId: "",
        avatar:
          "https://res.cloudinary.com/nhatloi/image/upload/v1608601448/avatar/78-785904_block-chamber-of-commerce-avatar-white-avatar-icon_b9lssx.jpg",
        createdAt: "2024-04-13T06:34:18.310Z",
        updatedAt: "2024-04-13T06:34:18.310Z",
      },
    },
    {
      _id: "661a2641b76a1a5b35276f53",
      messages: [
        {
          _id: "661cacd37ad5c8448acead68",
          from: "661809f4a4490454d61bc0f0",
          to: "661a2641b76a1a5b35276f53",
          msg: "Test message",
          createdAt: "2024-04-15T04:28:03.446Z",
          updatedAt: "2024-04-15T04:28:03.446Z",
        },
      ],
      user: {
        _id: "661a2641b76a1a5b35276f53",
        name: "test",
        email: "phanloi971@gmail.com",
        state: "Offline",
        socketId: "",
        avatar:
          "https://res.cloudinary.com/nhatloi/image/upload/v1608601448/avatar/78-785904_block-chamber-of-commerce-avatar-white-avatar-icon_b9lssx.jpg",
        createdAt: "2024-04-13T06:29:21.539Z",
        updatedAt: "2024-04-13T06:29:21.539Z",
      },
    },
  ]);

  const pushNewMessage = (message: { msg: string; sendTo: string }) => {
    setMessages(
      messages.map((mess) => {
        return mess._id === message.sendTo
          ? {
              ...mess,
              messages: [
                ...mess.messages,
                {
                  from: "661809f4a4490454d61bc0f0",
                  to: message.sendTo,
                  msg: message.msg,
                  createdAt: new Date(Date.now()).toLocaleDateString(),
                  updatedAt: new Date(Date.now()).toLocaleDateString(),
                },
              ],
            }
          : mess;
      })
    );
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
