import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import { Delete, MoreVert } from "@mui/icons-material";
import axios from "axios";
import { SERVER_URL } from "../../../config/constant";
import { useSelector } from "react-redux";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { messageType } from "../../Context/MessagesContext";

export default function ActionMenu({
  transform = "left",
  msg,
  owner,
}: {
  transform?: "left" | "right";
  msg: messageType;
  owner: boolean;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const auth = useSelector((state: any) => state.auth);
  const { token } = auth;
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveMsg = React.useCallback(async () => {
    axios
      .delete(`${SERVER_URL}/message/remove-msg/${msg._id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })

      .catch((err) => {
        console.log(err);
      });
  }, [msg]);

  const handleReactMsg = React.useCallback(
    async (emoji: EmojiClickData) => {
      axios
        .post(
          `${SERVER_URL}/message/react-msg/${msg._id}`,
          {
            react: `${emoji.unified}|${emoji.names[0]}`,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )

        .catch((err) => {
          console.log(err);
        });
    },
    [msg]
  );

  return (
    <React.Fragment>
      <Tooltip title="Account settings">
        <>
          <div className="cursor-pointer">
            <div className="action">
              {!owner && (
                <EmojiPicker
                  reactionsDefaultOpen={true}
                  allowExpandReactions={false}
                  onReactionClick={handleReactMsg}
                />
              )}
              {owner && (
                <div onClick={handleClick}>
                  <MoreVert />
                </div>
              )}
            </div>
          </div>
        </>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: transform === "left" ? 30 : "",
              right: transform === "right" ? 14 : "",
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: transform, vertical: "top" }}
        anchorOrigin={{ horizontal: transform, vertical: "bottom" }}
      >
        <MenuItem onClick={handleRemoveMsg}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
