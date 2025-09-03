import { TextField } from "@mui/material";
import React from "react";
import styled from "styled-components";

const CustomTextField = (props) => {
  const handleOnChange = async (e) => {
    let value = e.target.value;

    props.setValue(value);
    props.setError && props.setError(false);
    if (props.onChangeCallback) {
      props.onChangeCallback();
    }
  };

  return (
    <TextFieldWrapper style={{ ...props.style }}>
      <CssTextField
        error={props.error}
        value={props.value}
        label={props.label}
        placeholder={`${props.placeholder}${props.mandatory ? "*" : ""}`}
        fullWidth={props.fullWidth || true}
        type={props.type}
        id="custom-css-outlined-input"
        size="medium"
        onChange={handleOnChange}
        inputProps={{
          ...{ maxLength: props.maxLength || null },
          ...props.inputProps,
        }}
        InputLabelProps={{
          style: { color: "#222222", opacity: 0.3 },
        }}
        disabled={props.disabled}
        multiline={props.multiline}
        minRows={props.minRows}
        maxRows={props.maxRows}
        maxLength={props.maxLength}
      />
    </TextFieldWrapper>
  );
};

const TextFieldWrapper = styled.div``;

const CssTextField = styled(TextField)(({ error, success }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "8px",
    fontFamily: "ManropeRegular",
  },
  "& label.Mui-focused": {
    color: `${error ? "##EDBEC4" : success ? "#04ADAA" : "#222222"}`,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: `${error ? "##EDBEC4" : success ? "#04ADAA" : "#dcdcdc"}`,
    },
    "&:hover fieldset": {
      borderColor: `${error ? "##EDBEC4" : success ? "#04ADAA" : "#dcdcdc"}`,
    },
    "&.Mui-focused fieldset": {
      borderColor: `${error ? "##EDBEC4" : success ? "#04ADAA" : "#dcdcdc"}`,
    },
  },
}));

export default CustomTextField;
