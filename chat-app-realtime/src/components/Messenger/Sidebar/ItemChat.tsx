import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  styled,
} from "@mui/material";
import { useContext } from "react";
import { MessagesContext, userType } from "../../Context/MessagesContext";

const ListItemWrapper = styled(ListItemButton)(
  () => `
          &.MuiButtonBase-root {
              margin: 10px 0;
          }
    `
);

type Props = {
  selected?: boolean;
  user: userType;
  messageLasted?: string;
  messageUnread?: number;
};
const ItemChat = (props: Props) => {
  const { user, messageLasted = "", messageUnread = 0 } = props;

  const { currentUserChatting, setCurrentUserChatting } =
    useContext(MessagesContext);
  return (
    <ListItemWrapper
      selected={user._id === currentUserChatting?._id}
      onClick={() => {
        setCurrentUserChatting(user);
      }}
    >
      <ListItemAvatar>
        <Avatar src={user.avatar} />
      </ListItemAvatar>
      <ListItemText
        sx={{
          mr: 1,
        }}
        primaryTypographyProps={{
          color: "textPrimary",
          variant: "h5",
          noWrap: true,
        }}
        secondaryTypographyProps={{
          color: "textSecondary",
          noWrap: true,
        }}
        primary={user.name}
        secondary={messageLasted}
      />
      {messageUnread > 0 && (
        <div className="rounded bg-purple-200 w-7 h-7 flex items-center justify-center">
          <span>{messageUnread}</span>
        </div>
      )}
    </ListItemWrapper>
  );
};

export default ItemChat;
