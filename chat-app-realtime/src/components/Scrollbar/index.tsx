import { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { Scrollbars } from "react-custom-scrollbars-2";

import { Box } from "@mui/material";

interface ScrollbarProps {
  className?: string;
  children?: ReactNode;
  setRef?: (ref: Scrollbars | null) => void;
}

const Scrollbar: FC<ScrollbarProps> = ({
  className,
  children,
  setRef = () => {},
  ...rest
}) => {
  return (
    <Scrollbars
      ref={(c) => {
        setRef(c);
      }}
      autoHide
      renderThumbVertical={() => {
        return (
          <Box
            sx={{
              width: 5,
            }}
          />
        );
      }}
      {...rest}
    >
      {children}
    </Scrollbars>
  );
};

Scrollbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Scrollbar;
