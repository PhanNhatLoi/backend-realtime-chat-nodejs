import { FC, ReactNode, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Scrollbars } from "react-custom-scrollbars-2";

import { Box } from "@mui/material";

interface ScrollbarProps {
  className?: string;
  children?: ReactNode;
  autoScroll?: boolean;
}

const Scrollbar: FC<ScrollbarProps> = ({
  className,
  children,
  autoScroll = false,
  ...rest
}) => {
  const scrollbarsRef = useRef<Scrollbars>(null);

  useEffect(() => {
    if (autoScroll && scrollbarsRef.current) {
      scrollbarsRef.current.scrollToBottom();
    }
  }, [scrollbarsRef.current?.getScrollHeight()]);

  return (
    <Scrollbars
      ref={scrollbarsRef}
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
