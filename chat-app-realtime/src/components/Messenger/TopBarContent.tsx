import { useContext } from "react";
import { Box, styled } from "@mui/material";
import { MessagesContext } from "../Context/MessagesContext";
import MUIAvatar from "../MUI/Avatar";

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
        <MUIAvatar
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
          }}
          alt={currentUserChatting?.name}
          src={currentUserChatting?.avatar || ""}
        />
        <div className="ml-2">
          <span className="text-3xl font-medium">
            {currentUserChatting?.name}
          </span>
        </div>
      </div>
    </RootWrapper>
  );
}

export default TopBarContent;
