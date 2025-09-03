import React from "react";
import styled from "styled-components";
import { colors } from "theme/colors";

export const SearchContainer = styled.div`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "50px"};
  background-color: ${(props) => props.bgColor || "rgba(39,49,53,0.05)"};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 16px;
  border-radius: 5px;
  gap: 0px 10px;
`;

export const SearchIcon = styled.img`
  width: ${(props) => props.iconWidth || "40px"};
  height: ${(props) => props.iconHeight || "20px"};
`;

export const SearchTextInput = styled.input`
  width: 100%;
  border: none;
  display: flex;
  flex-grow: 1;
  font-family: ${colors?.font?.primary};
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  border-radius: 8px;
  background-color: transparent;
  color: ${colors?.text?.black200};

  &:focus {
    outline: none;
  }

  ::placeholder,
  ::-webkit-input-placeholder {
    color: ${colors?.text?.black200};
    opacity: 0.3;
  }
`;

const SearchInput = (props) => {
  return (
    <SearchContainer
      width={props.width}
      height={props.height}
      bgColor={props.bgColor}
      style={props.style}
    >
      {props.searchIcon && (
        <SearchIcon
          src={props.searchIcon}
          iconWidth={props.iconWidth}
          iconHeight={props.iconHeight}
        />
      )}
      <SearchTextInput
        style={props.textInputStyle}
        ref={props.inputRef}
        type="text"
        placeholder={props.placeholder || "Search..."}
        autoComplete="off"
        spellCheck="false"
        value={props.searchValue}
        onClick={(e) => props.handleClick(e)}
        onChange={(e) => props.handleChange(e)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            props.handleChange(e);
          }
        }}
      />
    </SearchContainer>
  );
};

export default SearchInput;
