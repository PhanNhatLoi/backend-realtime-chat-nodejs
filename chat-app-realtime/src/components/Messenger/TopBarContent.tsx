import { useState, SyntheticEvent, useContext } from "react";
import { Box, IconButton, Tooltip, Avatar, styled } from "@mui/material";
import CallTwoToneIcon from "@mui/icons-material/CallTwoTone";
import VideoCameraFrontTwoToneIcon from "@mui/icons-material/VideoCameraFrontTwoTone";
import { MessagesContext } from "../Context/MessagesContext";

const RootWrapper = styled(Box)(
  () => `
        @media (min-width: 600px) {
          display: flex;
          align-items: center;
          justify-content: space-between;
      }
`
);

function TopBarContent() {
  const { currentUserChatting } = useContext(MessagesContext);
  return (
    <RootWrapper>
      <div className="w-full h-16 flex items-end">
        <Avatar
          variant="rounded"
          sx={{
            width: 60,
            height: 60,
          }}
          alt={currentUserChatting.name}
          src={currentUserChatting.avatar}
        />
        <div className="ml-2">
          <span className="text-3xl font-medium">
            {currentUserChatting.name}
          </span>
        </div>
      </div>
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
        }}
      >
        <Tooltip placement="bottom" title="Start a voice call">
          <IconButton color="primary">
            <CallTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip placement="bottom" title="Start a video call">
          <IconButton color="primary">
            <VideoCameraFrontTwoToneIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </RootWrapper>
  );
}

export default TopBarContent;
