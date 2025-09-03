import React, { useRef } from "react";
import styled from "styled-components";
import Text from "../../../atoms/Text";
import useOutsideClick from "../../../atoms/useOutsideClick";

import { device } from "../../../../commons/util/helperFunctions";

const DesktopDateTextField = (props) => {
  const { setDesktopPickerIsOpen, InputProps: { ref: desktopPickerRef } = {} } =
    props;

  const dropdownRef = useRef(null);
  useOutsideClick(dropdownRef, () => props.setIsOpen(false));

  const handleOnClick = () => {
    if (props.desktopPicker && setDesktopPickerIsOpen) {
      setDesktopPickerIsOpen?.((prev) => !prev);
    }
  };

  return (
    <ParentWrapper
      ref={
        props.dropdown
          ? dropdownRef
          : props.desktopPicker
          ? desktopPickerRef
          : null
      }
    >
      <Wrapper onClick={handleOnClick} disabled={props.disabled}>
        <ImageLabelWrapper>
          <LabelContainer style={props.labelStyle} isEllipsis={false}>
            {props.disabled
              ? props.label
              : `${props.desktopPicker ? props.valueLabel : props.value} ${
                  props.unit || ""
                }`}
          </LabelContainer>
        </ImageLabelWrapper>
        <Image src={props.logo} alt="img-not-found" />
      </Wrapper>
      {props.children}
    </ParentWrapper>
  );
};

export const ParentWrapper = styled.div`
  position: relative;

  @media ${device.laptop} {
    width: 100%;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  min-height: 54px;
  padding: 0px 16px;
  gap: 5px;

  @media ${device.laptop} {
    cursor: pointer;
  }

  /* Styling for the disabled state */
  ${({ disabled }) =>
    disabled &&
    `
      cursor: not-allowed;
      border-radius: 8px;
      border: 1px solid rgba(39, 49, 53, 0.20);
      opacity: 0.4;
      background-color: #F4F4F4;
      pointer-events:none;
    `}
`;

export const ImageLabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Image = styled.img``;

export const LabelContainer = styled(Text)`
  margin-left: 12px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  @media ${device.laptop} {
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
`;

export const ValueContainer = styled(Text)`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-align: right;

  @media ${device.laptop} {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

export const ModalWrapper = styled.div`
  height: 450px;
  background-color: #ffffff;
  border-radius: 12px 12px 0px 0px;
`;

export const ActionText = styled(Text)`
  color: #0a6b71;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
export default DesktopDateTextField;
