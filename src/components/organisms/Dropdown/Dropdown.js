import React, { useEffect, useRef, useState } from "react";
import useOutsideClick from "../../atoms/useOutsideClick";
import styled from "styled-components";
import DropdownDownArrowBlack from "./assets/dropdownDownArrowBlack.svg";
import DropdownDownArrowWhite from "./assets/dropdownDownArrowWhite.svg";
import DropdownMenu from "./DropdownMenu";
import Text from "../../atoms/Text";
const Dropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      props.onOpen && props.onOpen();
    } else {
      props.onClose && props.onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const triggerDropdown = () => {
    setIsOpen(!isOpen);
  };
  const dropRef = useRef();
  useOutsideClick(dropRef, () => {
    setIsOpen(false);
  });

  return (
    <DropdownWrapper
      ref={dropRef}
      onClick={!props.disableDropdown ? triggerDropdown : null}
      width={props.width}
      style={props.wrapperStyle}
      roundedCorners={props.roundedCorners}
    >
      <SelectedTextContainer
        darkMode={props.darkMode}
        style={props.containerStyle}
      >
        {props.children}
        <Text
          isEllipsis={true}
          width="90%"
          type={props.selectedTextFontWeight || "regular"}
        >
          {props.selected
            ? props.selected[props.primaryKey]
            : props.placeholder || ``}
        </Text>
        {props.data?.length > 1 && (
          <Arrow
            src={
              props.darkMode ? DropdownDownArrowWhite : DropdownDownArrowBlack
            }
            alt="down-arrow"
            isOpen={isOpen}
          />
        )}
      </SelectedTextContainer>

      {isOpen && (
        <DropdownMenu
          {...props}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          bgColor={props.darkMode ? "#273135" : "#ffffff"}
          textColor={props.darkMode ? "#ffffff" : "#273135"}
          hideSelectedElement={true}
          dropdownMenuWrapperStyle={{ padding: "0px" }}
        />
      )}
    </DropdownWrapper>
  );
};

const DropdownWrapper = styled.div`
  width: ${({ width }) => width || "100%"};
  position: relative;
  cursor: pointer;
`;
const SelectedTextContainer = styled.div`
  background: ${({ darkMode }) => (darkMode ? "#273135" : "#ffffff")};
  border: 1px solid #dcdcdc;
  border-radius: ${({ roundedCorners }) => (roundedCorners ? "8px" : "0px")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0px 16px;
  color: ${({ darkMode }) => (darkMode ? "#ffffff" : "#273135")};
  font-size: 16px;
  line-height: 22px;
`;

const Arrow = styled.img`
  transition: all 0.4s ease;
  transform: ${({ isOpen }) => isOpen && "rotateZ(-180deg)"};
`;

export default Dropdown;
