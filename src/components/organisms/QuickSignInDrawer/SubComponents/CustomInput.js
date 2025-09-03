import React from "react";
import styled from "styled-components";
import { colors } from "theme/colors";

function Input(props) {
  return (
    <CustomInput
      {...props}
      style={props.style}
      type="text"
      value={props.value}
      onChange={props.onChange}
      maxLength={props.maxLength}
      manLength={props.minLength}
      placeholder={props.placeholder}
      readOnly={props.readOnly}
      autoComplete={props.autoComplete || "off"}
      autoFocus={props.autoFocus}
      disabled={props.disabled}
      width={props.width}
      height={props.height}
    />
  );
}

export const CustomInput = styled.input`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "100%"};
  border: ${(props) => props.border || "none"};
  outline: none;
  &:focus {
    outline: none;
  }
  &::placeholder {
    font-family: ${colors?.font?.primary};
    font-weight: 300;
    font-size: 14px;
    color: #888888;
    opacity: 1;
  }
`;

export default Input;
