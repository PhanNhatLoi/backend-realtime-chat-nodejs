import axios from "axios";
import React, {
  ReactNode,
  createContext,
  useCallback,
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
  pushNewMessage: (message: messageType) => void;
  chooseUserChatting: (user: userType) => void;
  fetchMessages: () => void;
  listUser: userType[];
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

  const socket: any = useRef();

  const auth = useSelector((state: any) => state.auth);

  const [messages, setMessages] = useState<MessagesTypeContent[]>([]);

  const userId = useSelector((state: any) => state.auth.user)?._id;

  const [listUser, setListUser] = useState<userType[]>([]);

  const chooseUserChatting = (user: userType) => {
    setCurrentUserChatting(user);
    socket.current.emit("read-msg", user._id);
    setMessages(
      messages.map((mess) => {
        return mess._id === user._id
          ? {
              ...mess,
              messages: mess.messages.map((msg) => {
                return {
                  ...msg,
                  status: "seen",
                };
              }),
            }
          : mess;
      })
    );
  };

  const fetchMessages = useCallback(() => {
    if (auth.token) {
      try {
        axios
          .get(`${SERVER_URL}/message/getallmsg`, {
            headers: { Authorization: "Bearer " + auth.token },
          })
          .then((res: any) => {
            setMessages(res.data);
          });
      } catch (error) {
        setMessages([]);
      }
    }
  }, [auth.token]);

  const fetchUsers = useCallback(() => {
    if (auth.user) {
      try {
        axios
          .get(`${SERVER_URL}/user/all_infor`, {
            headers: { Authorization: "Bearer " + auth.token },
          })
          .then((res: any) => {
            setListUser(
              res.data.user.filter((f: userType) => f._id !== auth.user._id)
            );
          });
      } catch (error) {
        setMessages([]);
      }
    }
  }, [auth.user]);

  useEffect(() => {
    socket.current = io(SERVER_URL);
  }, []);

  useEffect(() => {
    if (userId && socket.current) {
      socket.current.emit("online", userId);
    }
  }, [userId, socket]);

  useEffect(() => {
    if (auth.token) {
      fetchMessages();
      fetchUsers();
    }
  }, [auth.token]);

  useEffect(() => {
    socket.current.on("msg-recieve", (msg: messageType, user: userType) => {
      setMessages((pre: MessagesTypeContent[]) => {
        const newMessages = pre.map((mess) => {
          return mess._id === msg.from
            ? {
                ...mess,
                messages: [...mess.messages, msg],
              }
            : mess;
        });
        return !pre.some((s) => s._id === msg.from)
          ? [
              ...newMessages,
              {
                _id: msg.from,
                messages: [msg],
                user: user,
              },
            ]
          : newMessages;
      });
    });
  }, []);

  const pushNewMessage = (message: messageType) => {
    const newMessage: messageType = {
      ...message,
      createdAt: new Date(Date.now()).toLocaleDateString(),
      updatedAt: new Date(Date.now()).toLocaleDateString(),
    };
    currentUserChatting &&
      setMessages((pre: MessagesTypeContent[]) => {
        const newMessages: MessagesTypeContent[] = pre.map(
          (mess: MessagesTypeContent) => {
            return mess._id === message.to
              ? {
                  ...mess,
                  messages: [...mess.messages, newMessage],
                }
              : mess;
          }
        );
        return !pre.some((s) => s._id === message.to)
          ? [
              ...newMessages,
              {
                _id: message.to,
                messages: [newMessage],
                user: currentUserChatting,
              },
            ]
          : newMessages;
      });
    if (message.to !== userId) {
      try {
        axios
          .post(
            `${SERVER_URL}/message/sendmsg`,
            {
              to: message.to,
              msg: message.msg,
            },
            { headers: { Authorization: "Bearer " + auth.token } }
          )
          .then(() => {
            socket.current.emit("send-msg", newMessage);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  //   fetch message

  //   fetch message

  return (
    <MessagesContext.Provider
      value={{
        messages,
        currentUserChatting,
        pushNewMessage,
        chooseUserChatting,
        fetchMessages,
        listUser,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
