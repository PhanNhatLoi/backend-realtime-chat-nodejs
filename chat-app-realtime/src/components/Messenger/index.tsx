import { useContext, useState } from "react";

import TopBarContent from "./TopBarContent";
import BottomBarContent from "./BottomBarContent";
import SidebarContent from "./Sidebar/SidebarContent";
import ChatContent from "./ChatContent/ChatContent";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";

import {
  Box,
  styled,
  Divider,
  Drawer,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Colors } from "../../config/Color";
import Scrollbar from "../Scrollbar";
import { MessagesContext } from "../Context/MessagesContext";

const RootWrapper = styled(Box)(
  () => `
       height: calc(100vh);
       display: flex;
`
);

const Sidebar = styled(Box)(
  () => `
        width: 400px;
        border-right: solid 1px ${Colors.Gray_02};
        height: 100vh;
`
);

const ChatWindow = styled(Box)(
  () => `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
`
);

const ChatTopBar = styled(Box)(
  () => `
        border-bottom: ${Colors.Gray_02} solid 1px;
        padding: 10px;
        align-items: center;
`
);

const IconButtonToggle = styled(IconButton)(
  () => `
  width: 2px;
  height: 2px;
  background: white;
`
);

const DrawerWrapperMobile = styled(Drawer)(
  () => `
    width: 340px;
    flex-shrink: 0;

  & > .MuiPaper-root {
        width: 340px;
        z-index: 3;
  }
`
);

function ApplicationsMessenger() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { currentUserChatting, updateMessageById } =
    useContext(MessagesContext);

  return (
    <RootWrapper className="Mui-FixedWrapper">
      <DrawerWrapperMobile
        sx={{
          display: { lg: "none", xs: "inline-block" },
        }}
        variant="temporary"
        anchor={"left"}
        open={mobileOpen}
        onClose={handleDrawerToggle}
      >
        <SidebarContent />
      </DrawerWrapperMobile>

      <Sidebar
        sx={{
          display: { xs: "none", lg: "inline-block" },
        }}
      >
        <SidebarContent />
      </Sidebar>
      <ChatWindow className="relative">
        <ChatTopBar
          sx={{
            display: { xs: "flex", lg: "inline-block" },
            height: "85px",
            justifyContent: "space-between",
            background: "white",
          }}
        >
          {currentUserChatting ? <TopBarContent /> : <div></div>}
          <IconButtonToggle
            sx={{
              display: { lg: "none", xs: "flex" },
              mr: 2,
            }}
            color="primary"
            onClick={handleDrawerToggle}
            size="small"
          >
            <MenuTwoToneIcon />
          </IconButtonToggle>
        </ChatTopBar>

        <div
          className="h-full w-full bg-cover bg-no-repeat bg-center absolute "
          style={{
            zIndex: -10,
            backgroundImage: "url('/images/background_02.jpg')",
          }}
        />
        <Scrollbar
          autoScroll={autoScroll}
          onScrollTop={() => {
            setLoading(true);
            setAutoScroll(false);
            updateMessageById().finally(() => {
              setTimeout(() => {
                setLoading(false);
                setAutoScroll(true);
              }, 1000);
            });
          }}
        >
          {loading && (
            <div
              style={{
                marginTop: "10px",
                width: "100%",
                display: "flex",
                justifyItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </div>
          )}

          <ChatContent />
        </Scrollbar>
        <Divider />
        {currentUserChatting && <BottomBarContent />}
      </ChatWindow>
    </RootWrapper>
  );
}

export default ApplicationsMessenger;
