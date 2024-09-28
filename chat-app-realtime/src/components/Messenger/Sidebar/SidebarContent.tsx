import { useContext, useState } from "react";
import { List, Box } from "@mui/material";
import { useSelector } from "react-redux";
import ItemChat from "./ItemChat";
import { MessagesContext } from "../../Context/MessagesContext";
import AccountMenu from "./AccountMenu";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import MUITextField from "../../MUI/MUITextField";
import Scrollbar from "../../Scrollbar";

function SidebarContent() {
  // const
  const user = useSelector((state: any) => state.auth.user);
  const { messages, listUser } = useContext(MessagesContext);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchGroup, setSearchGroup] = useState<string>("");
  const groups = user?.groupIds || [];

  const [tab, setTab] = useState<"recent" | "friends" | "groups">("recent");
  return (
    <div className="p-7 w-full">
      <div
        className="flex items-center justify-between pb-4"
        style={{ borderBottom: "solid 0.5px gray" }}
      >
        <AccountMenu source={user?.avatar} />
        <div className="ml-5 text-4xl">
          <span>{user?.name}</span>
        </div>
      </div>
      <Box sx={{ width: "100%" }}>
        <TabContext value={tab}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <TabList
              onChange={(_, tab) => {
                setTab(tab as "recent" | "friends");
              }}
              aria-label="lab API tabs example"
            >
              <Tab label="Recents" value="recent" />
              <Tab label="Friends" value="friends" />
              <Tab label="Groups" value="groups" />
            </TabList>
          </Box>
          <TabPanel value="recent" style={{ padding: 0 }}>
            <div
              className="mt-2"
              style={{
                height: "75vh",
              }}
            >
              <Scrollbar>
                <List disablePadding component="div">
                  {messages
                    .filter((f) => f.user)
                    .map((element) => {
                      return (
                        <ItemChat
                          key={element._id}
                          user={element.user}
                          messageUnread={
                            element.messages.filter(
                              (f) =>
                                !["seen", "deleted"].includes(f.status) &&
                                f.from !== user?._id
                            ).length
                          }
                          messageLasted={
                            (element.messages &&
                              element.messages[element.messages.length - 1]
                                ?.msg) ||
                            ""
                          }
                        />
                      );
                    })}
                  {!messages.filter((f) => f.user)?.length && (
                    <div className="text-center text-slate-300">
                      <span className="">Start chatting message first</span>
                    </div>
                  )}
                </List>
              </Scrollbar>
            </div>
          </TabPanel>
          <TabPanel value="friends" style={{ padding: 0 }}>
            <MUITextField
              value={searchValue}
              placeholder="Search name"
              onChange={(val) => {
                setSearchValue(val as string);
              }}
            />
            <div
              className="mt-2"
              style={{
                height: "70vh",
              }}
            >
              <Scrollbar>
                <List disablePadding component="div">
                  {listUser
                    .filter((f: any) =>
                      f.name.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((user) => {
                      return <ItemChat key={user._id} user={user} />;
                    })}
                </List>
              </Scrollbar>
            </div>
          </TabPanel>
          <TabPanel value="groups" style={{ padding: 0 }}>
            <MUITextField
              value={searchGroup}
              placeholder="Search name"
              onChange={(val) => {
                setSearchGroup(val as string);
              }}
            />
            <div
              className="mt-2"
              style={{
                height: "70vh",
              }}
            >
              <Scrollbar>
                <List disablePadding component="div">
                  {groups
                    .filter((f: any) =>
                      f.name.toLowerCase().includes(searchGroup.toLowerCase())
                    )
                    .map((group: any) => {
                      return <ItemChat key={group._id} user={group} />;
                    })}
                </List>
              </Scrollbar>
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default SidebarContent;
