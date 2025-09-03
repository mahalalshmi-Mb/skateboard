/* eslint-disable default-case */
import { TextField } from "@mui/material";
import React from "react";
import styled from "styled-components";
import "./customTextField.css";

const CssTextField = styled(TextField)(({ error, success }) => ({
  "& label.Mui-focused": {
    color: `${error ? "##EDBEC4" : success ? "#04ADAA" : "#00103d"}`,
  },
  "& .MuiInput-underline:after": {
    // borderBottomColor: 'green',
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: `${error ? "##EDBEC4" : success ? "#04ADAA" : null}`,
    },
    "&:hover fieldset": {
      borderColor: `${error ? "##EDBEC4" : success ? "#04ADAA" : "#00103d"}`,
    },
    "&.Mui-focused fieldset": {
      borderColor: `${error ? "##EDBEC4" : success ? "#04ADAA" : "#00103d"}`,
    },
  },
}));

const CustomTextField = (props) => {
  const handleOnChange = async (e) => {
    let value = e.target.value;
    switch (props.type) {
      case "text":
        if (props.name === "referral") {
          value = value.replace(/[^a-zA-Z]+/gi, "");
        } else {
          value = value.replace(/[^ a-zA-Z]+/gi, "");
        }
        break;
      case "tel":
        value = value.replace(/[^0-9]+/gi, "");
        break;
    }
    props.setValue(value);
    if (props.onChangeCallback) {
      props.onChangeCallback();
    }
  };

  return (
    <div style={{ ...props.style }} className="custom-textField">
      <CssTextField
        value={props.value}
        onChange={handleOnChange}
        label="Custom CSS"
        id="custom-css-outlined-input"
        size="medium"
        fullWidth={props.fullWidth}
        inputProps={{
          ...{ maxLength: 30 },
          ...props.inputProps,
        }}
        {...props}
      />
    </div>
  );
};

export default CustomTextField;
