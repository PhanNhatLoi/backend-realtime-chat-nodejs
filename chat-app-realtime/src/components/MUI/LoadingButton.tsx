import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";

type LoadingButtonProps = {
  loading?: boolean; // loadding for Indicator default false
  children?: React.ReactNode;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  color?:
    | "error"
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning";
};
const MUILoadingButton = (props: LoadingButtonProps) => {
  const {
    loading = false,
    children = <></>,
    onClick,
    color = "primary",
    variant = "contained",
  } = props;
  return (
    <LoadingButton
      onClick={onClick}
      loading={loading}
      color={color}
      variant={variant}
    >
      {children}
    </LoadingButton>
  );
};

export default MUILoadingButton;
