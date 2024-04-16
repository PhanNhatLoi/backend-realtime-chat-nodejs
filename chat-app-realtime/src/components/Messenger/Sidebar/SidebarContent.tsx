import { useContext } from "react";
import { TextField, InputAdornment, Avatar, List } from "@mui/material";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { useSelector } from "react-redux";
import ItemChat from "./ItemChat";
import { MessagesContext } from "../../Context/MessagesContext";

function SidebarContent() {
  // const
  const user = useSelector((state: any) => state.auth.user);
  const { messages } = useContext(MessagesContext);

  return (
    <div className="p-7 w-full">
      <div className="flex items-center justify-between">
        <Avatar alt={user.name} src={user.avatar} />
        <div className="ml-5 text-4xl">
          <span>{user.name}</span>
        </div>
      </div>

      <TextField
        sx={{
          mt: 2,
          mb: 1,
        }}
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchTwoToneIcon />
            </InputAdornment>
          ),
        }}
        placeholder="Search..."
      />

      <div className="mb-2 mt-1 text-4xl">
        <h3>Chats</h3>
      </div>

      <div className="mt-2">
        <List disablePadding component="div">
          {messages.map((element) => {
            return (
              <ItemChat
                key={element._id}
                user={element.user}
                messageUnread={
                  element.messages.filter(
                    (f) => f.status !== "seen" && f.from !== user._id
                  ).length
                }
                messageLasted={
                  (element.messages && element.messages[0]?.msg) || ""
                }
              />
            );
          })}
        </List>
      </div>
    </div>
  );
}

export default SidebarContent;
