import { TextField, TextFieldProps } from "@mui/material";

type TextFieldPropsMUI = {
  onChange: (val: string) => void;
} & TextFieldProps;
const MUITextField = (props: TextFieldPropsMUI) => {
  const { onChange, ...rest } = props;
  return (
    <TextField
      fullWidth
      onChange={(e) => {
        onChange(e.target.value);
      }}
      {...rest}
    />
  );
};

export default MUITextField;
