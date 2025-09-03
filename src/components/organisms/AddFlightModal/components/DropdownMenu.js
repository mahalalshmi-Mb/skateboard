import React, { Fragment } from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import { device } from "../../../../commons/util/helperFunctions";

const DropdownMenu = (props) => {
  const handleOptionClick = (item) => {
    props.setSelected && props.setSelected(item);
    props.setIsOpen && props.setIsOpen(false);
    props.onSelectionCallback && props.onSelectionCallback(item);
  };
  return (
    <Wrapper isOpen={props.isOpen} ref={props.ref}>
      {props.data.map((item, index) => (
        <Fragment>
          {index < 3 && (
            <DropdownItemWrapper
              key={item}
              isSelected={item === props.selected ? true : false}
              onClick={() => handleOptionClick(item)}
            >
              <DropdownText type={"regular"} isEllipsis={true}>
                {`${item.airportname}(${item.airportcode})`}
              </DropdownText>
            </DropdownItemWrapper>
          )}
        </Fragment>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  background-color: #ffffff;
  position: absolute;
  top: 60px;
  left: 0px;
  z-index: 999999;
  border-radius: 8px;
  border: 1px solid #27313533;
  box-shadow: 0px 0px 20px 0px #00000014;
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  gap: 8px;

  max-height: 250px;
  overflow-y: auto;
  width: 100%;
  @media ${device.laptop} {
    max-height: 300px;
  }
`;

const DropdownItemWrapper = styled.div`
  padding: 12px 16px;
  font-size: 16px;
  line-height: 22px;
  align-items: center;
  color: ${({ textColor }) => textColor || "#273135"};
  background-color: ${({ isSelected }) => (isSelected ? "#F4F4F4" : "#ffffff")};
  border-radius: 8px;
  width: 100%;

  cursor: pointer;

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || "#f4f4f4"};
  }
`;

const DropdownText = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  line-height: 19.12px;
`;

export default DropdownMenu;
