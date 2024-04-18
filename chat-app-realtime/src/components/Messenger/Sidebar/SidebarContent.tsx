import { useContext } from "react";
import { TextField, InputAdornment, List, Autocomplete } from "@mui/material";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { useSelector } from "react-redux";
import ItemChat from "./ItemChat";
import { MessagesContext } from "../../Context/MessagesContext";
import MUIAvatar from "../../MUI/Avatar";

function SidebarContent() {
  // const
  const user = useSelector((state: any) => state.auth.user);
  const { messages, listUser, chooseUserChatting } =
    useContext(MessagesContext);

  return (
    <div className="p-7 w-full">
      <div className="flex items-center justify-between">
        <MUIAvatar alt={user.name} src={user.avatar} />
        <div className="ml-5 text-4xl">
          <span>{user.name}</span>
        </div>
      </div>
      <Autocomplete
        onChange={(_, val: any) => {
          const currentUser = listUser.find((f) => f._id === val?.value);
          currentUser && chooseUserChatting(currentUser);
        }}
        freeSolo
        options={listUser.map((el) => {
          return {
            label: el.name,
            value: el._id,
          };
        })}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              mt: 2,
              mb: 1,
            }}
            label="Search name"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoToneIcon />
                </InputAdornment>
              ),
              type: "Search....",
            }}
          />
        )}
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
                  (element.messages &&
                    element.messages[element.messages.length - 1]?.msg) ||
                  ""
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
