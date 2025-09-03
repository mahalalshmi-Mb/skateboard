import React from "react";
import styled from "styled-components";
import Text from "../../atoms/Text";

const DropdownMenu = (props) => {
  return (
    <Wrapper
      bgColor={props.bgColor}
      roundedCorners={props.roundedCorners}
      style={props.dropdownMenuWrapperStyle}
    >
      {props.data.map((item) => (
        <DropdownItemWrapper
          textColor={props.textColor}
          key={item[props.idKey]}
          onClick={() => {
            props.setSelected(item);
            props.onSelectionCallback && props.onSelectionCallback(item);
          }}
          style={props.dropdownMenuItemStyle}
          hideSelectedElement={
            props.hideSelectedElement &&
            item[props.primaryKey] === props.selected[props.primaryKey]
          }
        >
          <Text type={props.textFontWeight || "regular"} isEllipsis={true}>
            {item[props.primaryKey]}
          </Text>
        </DropdownItemWrapper>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  background-color: ${({ bgColor }) => bgColor || "#ffffff"};
  position: absolute;
  top: 50px;
  z-index: 9999;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  border-radius: ${({ roundedCorners }) =>
    roundedCorners ? "0px 0px 8px 8px" : "0px"};
  padding: 10px 0px;
`;

const DropdownItemWrapper = styled.div`
  height: 50px;
  padding: 0px 24px;
  font-size: 16px;
  line-height: 22px;
  display: ${({ hideSelectedElement }) =>
    hideSelectedElement ? "none" : "flex"};
  align-items: center;
  color: ${({ textColor }) => textColor || "#273135"};
`;

export default DropdownMenu;
