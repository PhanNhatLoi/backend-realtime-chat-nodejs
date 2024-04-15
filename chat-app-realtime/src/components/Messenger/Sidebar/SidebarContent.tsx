import { useState, ChangeEvent, useEffect, useContext } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Avatar,
  List,
  styled,
} from "@mui/material";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { useSelector } from "react-redux";
import ItemChat from "./ItemChat";
import { MessagesContext, userType } from "../../Context/MessagesContext";
import axios from "axios";
import { SERVER_URL } from "../../../config/constant";

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
  const { messages } = useContext(MessagesContext);

  const [currentTab, setCurrentTab] = useState<string>("all");

  const tabs = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

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
        <List disablePadding component="div">
          {messages
            .filter((f) =>
              currentTab === "all"
                ? f
                : f.messages.some((s) => s.status !== "seen")
            )
            .map((element) => {
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
