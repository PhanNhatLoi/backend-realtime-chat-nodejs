import React from "react";
import { Divider, styled } from "@mui/material";
const DividerWrapperStyled = styled(Divider)(
  () => `
        margin-top: 20px;
        .MuiDivider-wrapper {
            border-radius: gray;
            text-transform: none;
            font-size: 18px;
            color: black;
        }
        `
);
const DividerWrapper = ({ children }: { children: React.ReactNode }) => {
  return <DividerWrapperStyled>{children}</DividerWrapperStyled>;
};

export default DividerWrapper;
