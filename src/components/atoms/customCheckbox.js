import React from "react";
import Checkbox from "@mui/material/Checkbox";

function CustomCheckbox(props) {
  return (
    <Checkbox
      checked={props.checked}
      onChange={props.handleChange}
      disabled={props.disabled}
      sx={{
        padding: "0px",
        color: props.unCheckedColor || "#273135",
        "&.Mui-checked": {
          color: props.checkedColor || "#037B79",
        },
        ...props.style,
      }}
      inputProps={{ "aria-label": props.ariaLabel || "" }}
    />
  );
}

export default CustomCheckbox;
