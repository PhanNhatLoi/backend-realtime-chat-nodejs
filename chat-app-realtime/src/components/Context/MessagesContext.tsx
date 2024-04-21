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
  chooseUserChatting: (user?: userType) => void;
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

  const [refresh, setRefresh] = useState<boolean>(false);

  const [actionToRefresh, setActionToRefresh] = useState<
    | {
        action: "sent-msg" | "receive-msg";
        msg: messageType;
        user?: userType;
      }
    | undefined
  >();

  //
  const handleRefreshMessages = async () => {
    // sent done msg
    if (actionToRefresh?.action === "sent-msg") {
      setMessages((pre) => {
        let temp = pre;
        const index = temp.findIndex((f) => f._id === actionToRefresh.msg.to);
        if (index >= 0) {
          const msgIndex = temp[index].messages.findIndex(
            (f) => f._id === actionToRefresh.msg._id
          );
          if (msgIndex >= 0) {
            temp[index].messages[msgIndex] = actionToRefresh.msg;
          } else {
            if (temp[index].messages[temp[index].messages.length - 1]._id) {
              temp[index].messages = [
                ...temp[index].messages,
                actionToRefresh.msg,
              ];
            } else {
              temp[index].messages[temp[index].messages.length - 1] =
                actionToRefresh.msg;
            }
          }
        }
        return temp;
      });
    }

    // receive msg
    if (actionToRefresh?.action === "receive-msg") {
      let temp = messages;
      let index = temp.findIndex((f) => f._id === actionToRefresh.msg.from);
      if (index >= 0) {
        temp[index].messages = [...temp[index].messages, actionToRefresh.msg];
      } else {
        // this is first message
        if (actionToRefresh.user) {
          temp = [
            ...temp,
            {
              _id: actionToRefresh.user._id,
              messages: [actionToRefresh.msg],
              user: actionToRefresh.user,
            },
          ];
        }
      }

      // case chat current === new user message send
      if (currentUserChatting?._id === actionToRefresh.user?._id) {
        try {
          await axios
            .post(
              `${SERVER_URL}/message/read-msg`,
              {}, //body null
              {
                headers: {
                  Authorization: "Bearer " + auth.token,
                  userId: actionToRefresh.user?._id,
                },
              }
            )
            .then(() => {
              const msgIndex = temp[index].messages.findIndex(
                (f) => f._id === actionToRefresh.msg._id
              );
              temp[index].messages[msgIndex].status = "seen";
            });
        } catch (error) {
          console.log(error);
        }
      }

      setMessages(temp);
    }
    setRefresh(false);
    setActionToRefresh(undefined);
  };

  useEffect(() => {
    if (refresh) {
      handleRefreshMessages();
    }
  }, [refresh]);

  const chooseUserChatting = (user?: userType) => {
    if (user) {
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
    } else {
      setCurrentUserChatting(undefined);
    }
  };

  const fetchMessages = useCallback(() => {
    if (auth.token) {
      try {
        axios
          .get(`${SERVER_URL}/message/get-all-msg`, {
            headers: { Authorization: "Bearer " + auth.token },
          })
          .then((res: { data: MessagesTypeContent[] }) => {
            setMessages(res.data);
            if (res.data.length > 0) {
              setCurrentUserChatting(res.data[0].user);
            }
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
        "receive-msg",
        ({ msg, user }: { msg: messageType; user: userType }) => {
          setActionToRefresh({
            action: "receive-msg",
            msg: msg,
            user: user,
          });
          setRefresh(true);
        }
      );

      // event send-done
      channelUser.bind("sent-msg", ({ msg }: { msg: messageType }) => {
        setActionToRefresh({
          action: "sent-msg",
          msg: msg,
        });
        setRefresh(true);
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
