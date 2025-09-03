import React from "react";
import Radio from "@mui/material/Radio";

const RadioButton = (props) => {
  return (
    <Radio
      checked={props.checked}
      onChange={props.onChange}
      value={props.value}
      name={props.name}
      inputProps={props.inputProps}
      sx={{
        color: "#D9D9D9",
        "&.Mui-checked": {
          color: "#04ADAA",
        },
        "& .MuiSvgIcon-root": {
          fontSize: 22,
        },
      }}
    />
  );
};

export default RadioButton;
