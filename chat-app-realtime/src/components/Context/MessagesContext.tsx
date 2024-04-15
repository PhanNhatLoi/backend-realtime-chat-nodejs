import axios from "axios";
import React, {
  ReactNode,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../config/constant";
import { io } from "socket.io-client";

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
  status: "new" | "sending" | "sent" | "seen";
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
  currentUserChatting: userType | undefined;
  pushNewMessage: (message: string) => void;
  setCurrentUserChatting: React.Dispatch<
    React.SetStateAction<userType | undefined>
  >;
};

export const MessagesContext = createContext<MessagesContextType>(
  {} as MessagesContextType
);

type Props = {
  children: ReactNode;
};

export function MessagesProvider({ children }: Props) {
  const [currentUserChatting, setCurrentUserChatting] = useState<
    userType | undefined
  >();

  const auth = useSelector((state: any) => state.auth);

  const [messages, setMessages] = useState<MessagesTypeContent[]>([]);

  const socket: any = useRef();

  useEffect(() => {
    socket.current = io(SERVER_URL);
  }, []);

  useEffect(() => {
    if (auth.user?._id && socket.current) {
      socket.current.emit("online", auth.user._id);
    }
  }, [auth, socket]);

  useEffect(() => {
    if (auth.token) {
      try {
        axios
          .get(`${SERVER_URL}/message/getallmsg`, {
            headers: { Authorization: "Bearer " + auth.token },
          })
          .then((res: any) => {
            setMessages(res.data);
            setCurrentUserChatting(res.data[0]?.user);
          });
      } catch (error) {
        setMessages([]);
      }
    }
  }, [auth.token]);

  const pushNewMessage = (message: string) => {
    setMessages(
      messages.map((mess) => {
        return mess._id === currentUserChatting?._id
          ? {
              ...mess,
              messages: [
                ...mess.messages,
                {
                  from: auth.user._id,
                  to: currentUserChatting._id,
                  msg: message,
                  status: "sending",
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
