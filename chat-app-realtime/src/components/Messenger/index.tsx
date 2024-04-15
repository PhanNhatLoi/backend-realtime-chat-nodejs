import { useState } from "react";

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
  useTheme,
} from "@mui/material";
import { Colors } from "../../config/Color";
import Scrollbar from "../Scrollbar";

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
        background: ${Colors.Gray_01};
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <RootWrapper className="Mui-FixedWrapper">
      <DrawerWrapperMobile
        sx={{
          display: { lg: "none", xs: "inline-block" },
        }}
        variant="temporary"
        anchor={"right"}
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
        <Scrollbar>
          <SidebarContent />
        </Scrollbar>
      </Sidebar>
      <ChatWindow>
        <ChatTopBar
          sx={{
            display: { xs: "flex", lg: "inline-block" },
          }}
        >
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
          <TopBarContent />
        </ChatTopBar>
        <Scrollbar>
          <ChatContent />
        </Scrollbar>
        <Divider />
        <BottomBarContent />
      </ChatWindow>
    </RootWrapper>
  );
}

export default ApplicationsMessenger;
