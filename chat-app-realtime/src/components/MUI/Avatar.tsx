import { Avatar, SxProps, Theme } from "@mui/material";
import React from "react";

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
      style={{ borderRadius: "50%", border: "solid 1.5px gray", ...style }}
      src={src}
      {...rest}
    />
  );
};

export default MUIAvatar;
