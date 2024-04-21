import axios from "axios";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { SERVER_URL, pusher_cluster, pusher_key } from "../../config/constant";
import Pusher from "pusher-js";
// import { io, Socket } from "socket.io-client";

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
  status: statusMessageType;
  createdAt?: string;
  updatedAt?: string;
};

export type statusMessageType = "new" | "sending..." | "sent" | "seen";
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

  const auth = useSelector((state: any) => state.auth);

  const [messages, setMessages] = useState<MessagesTypeContent[]>([]);

  const userId = useSelector((state: any) => state.auth.user)?._id;

  const [listUser, setListUser] = useState<userType[]>([]);

  const chooseUserChatting = (user: userType) => {
    setCurrentUserChatting(user);
    try {
      axios
        .post(
          `${SERVER_URL}/message/read-msg`,
          {}, //body null
          {
            headers: {
              Authorization: "Bearer " + auth.token,
              userId: user._id,
            },
          }
        )
        .then(() => {
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
        });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = useCallback(() => {
    if (auth.token) {
      try {
        axios
          .get(`${SERVER_URL}/message/get-all-msg`, {
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

  // realtime event
  useEffect(() => {
    if (userId) {
      const pusher = new Pusher(pusher_key, {
        cluster: pusher_cluster,
        channelAuthorization: {
          endpoint: SERVER_URL,
          transport: "ajax",
        },
      });
      const channelUser = pusher.subscribe(userId);

      // event send-msg from user
      channelUser.bind(
        "send-msg",
        ({ msg, user }: { msg: messageType; user: userType }) => {
          if (user._id === currentUserChatting?._id) {
            try {
              axios
                .post(
                  `${SERVER_URL}/message/read-msg`,
                  {}, //body null
                  {
                    headers: {
                      Authorization: "Bearer " + auth.token,
                      userId: user._id,
                    },
                  }
                )
                .then(() => {
                  setMessages((pre: MessagesTypeContent[]) => {
                    const newMessages = pre.map((mess) => {
                      return mess._id === msg.from
                        ? {
                            ...mess,
                            messages: [
                              ...mess.messages,
                              {
                                ...msg,
                                status: "seen" as statusMessageType,
                              },
                            ],
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
            } catch (error) {
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
            }
          } else {
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
          }
        }
      );

      // event send-done
      channelUser.bind("sent-msg", ({ msg }: { msg: messageType }) => {
        setMessages((pre) => {
          let temp = pre;
          const index = temp.findIndex((f) => f._id === msg.to);
          if (index >= 0) {
            temp[index].messages[temp[index].messages.length - 1] = msg;
          }
          return temp;
        });
      });

      return () => {
        pusher.unsubscribe(userId);
        pusher.disconnect();
      };
    }
  }, [userId, currentUserChatting]);

  useEffect(() => {
    if (auth.token) {
      fetchMessages();
      fetchUsers();
    }
  }, [auth.token]);

  const pushNewMessage = (message: messageType) => {
    const newMessage: messageType = {
      ...message,
      createdAt: new Date(Date.now()).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
    };

    if (message.to !== userId && currentUserChatting) {
      // send message before call api status is sending...
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

      try {
        axios.post(
          `${SERVER_URL}/message/send-msg`,
          {
            to: message.to,
            msg: message.msg,
          },
          { headers: { Authorization: "Bearer " + auth.token } }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

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
