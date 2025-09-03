import { CircularProgress } from "@mui/material";
import React from "react";
import { colors } from "../../theme/colors";
const ButtonLoader = (props) => {
  return (
    <CircularProgress
      size={20}
      sx={{ color: props.color ? props.color : colors.background }}
    />
  );
};

export default ButtonLoader;
