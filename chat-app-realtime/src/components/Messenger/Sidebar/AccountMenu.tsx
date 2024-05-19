import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import MUIAvatar from "../../MUI/Avatar";
import { useDispatch } from "react-redux";
import { dispatchLogout } from "../../../redux/actions/authAction";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../routerPath";
import { ChatBubbleTwoTone, Lock, PersonOutline } from "@mui/icons-material";

export default function AccountMenu({
  source,
  transform = "left",
}: {
  source: string;
  transform?: "left" | "right";
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <Tooltip title="Account settings">
        <div onClick={handleClick} className="cursor-pointer">
          <MUIAvatar alt={"avatar"} src={source} />
        </div>
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
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            navigate(PATH.CHAT);
          }}
        >
          <ListItemIcon>
            <ChatBubbleTwoTone fontSize="small" />
          </ListItemIcon>
          Chat
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(PATH.PROFILE);
          }}
        >
          <ListItemIcon>
            <PersonOutline fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(PATH.CHANGE_PASSWORD);
          }}
        >
          <ListItemIcon>
            <Lock fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(dispatchLogout());
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
