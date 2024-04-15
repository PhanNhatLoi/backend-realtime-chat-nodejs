import { useState, ChangeEvent, useEffect } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  TextField,
  IconButton,
  InputAdornment,
  Avatar,
  List,
  Divider,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  styled,
} from "@mui/material";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import CheckTwoToneIcon from "@mui/icons-material/CheckTwoTone";
import { useSelector } from "react-redux";
import ItemChat from "./ItemChat";
import { userType } from "../../Context/MessagesContext";
import axios from "axios";
import { SERVER_URL } from "../../../config/constant";

const AvatarSuccess = styled(Avatar)(
  () => `
          background-color: red;
          color: black;
          width: 20px;
          height: 20px;
          margin-left: auto;
          margin-right: auto;
    `
);

const ListItemWrapper = styled(ListItemButton)(
  () => `
        &.MuiButtonBase-root {
            margin: 10px 0;
        }
  `
);

const TabsContainerWrapper = styled(Box)(
  () => `
        .MuiTabs-indicator {
            min-height: 4px;
            height: 4px;
            box-shadow: none;
            border: 0;
        }

        .MuiTab-root {
            &.MuiButtonBase-root {
               

                .MuiTouchRipple-root {
                    display: none;
                }
            }

            &.Mui-selected:hover,
            &.Mui-selected {
            }
        }
  `
);

function SidebarContent() {
  // const
  const user = useSelector((state: any) => state.auth.user);
  const [listUser, setListUser] = useState<userType[]>([]);

  const [currentTab, setCurrentTab] = useState<string>("all");

  const tabs = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  useEffect(() => {
    try {
      axios
        .get(`${SERVER_URL}/user/all_infor`, {
          headers: { Authorization: "Bearer " + user.token },
        })
        .then((res) => {
          console.log(res);
        });
    } catch (error) {
      setListUser([]);
    }
  }, []);

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

      <TabsContainerWrapper>
        <Tabs
          onChange={handleTabsChange}
          value={currentTab}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </TabsContainerWrapper>

      <div className="mt-2">
        {currentTab === "all" && (
          <List disablePadding component="div">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((element) => {
              return (
                <ItemChat
                  key={element}
                  user={{
                    _id: "661a276a55c015162f87d945",
                    name: "nhatloi",
                    email: "nhatloi123@gmail.com",
                    state: "Offline",
                    socketId: "",
                  }}
                  messageUnread={element}
                  messageLasted="Hey there, how are you today? Is it ok if I call you?"
                />
              );
            })}
          </List>
        )}
        {currentTab === "unread" && (
          <List disablePadding component="div">
            {[1, 2, 7].map((element, key) => {
              return (
                <ItemChat
                  key={key}
                  user={{
                    _id: "661a276a55c015162f87d945",
                    name: "nhatloi",
                    email: "nhatloi123@gmail.com",
                    state: "Offline",
                    socketId: "",
                  }}
                  messageUnread={element}
                  messageLasted="Hey there, how are you today? Is it ok if I call you?"
                />
              );
            })}
          </List>
        )}
      </div>
    </div>
  );
}

export default SidebarContent;
