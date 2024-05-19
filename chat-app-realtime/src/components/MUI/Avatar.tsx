import { Avatar, SxProps, Theme } from "@mui/material";
import React from "react";
import { SERVER_URL } from "../../config/constant";

type Props = {
  style?: React.CSSProperties;
  src: string;
  alt?: string;
  sx?: SxProps<Theme>;
};
const MUIAvatar = (props: Props) => {
  const { style, src, alt, ...rest } = props;
  return (
    <Avatar
      variant="rounded"
      style={{ borderRadius: "50%", ...style }}
      src={
        src.startsWith("/")
          ? `/images/avatars${src || "/cat-image-1.png"}`
          : `${SERVER_URL}/file/${src}`
      }
      {...rest}
    />
  );
};

export default MUIAvatar;
