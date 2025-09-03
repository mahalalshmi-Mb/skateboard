import React from "react";
import styled from "styled-components";
import { device } from "../../commons/util/helperFunctions";
import { H6, StyledButton } from "../../theme/globalStyleSheet";
import backArrowWhite from "../../assets/images/arrows/backArrow.svg";
import backArrowBlack from "../../assets/images/arrows/backArrowBlack.svg";
import { useHistory } from "react-router-dom";
import Text from "../../components/atoms/Text";

const GoBack = (props) => {
  const history = useHistory();
  return (
    <BackWrapper
      onClick={props.onBack ? () => props.onBack() : () => history.goBack()}
      style={props.style}
    >
      <Back
        src={props.color === "black" ? backArrowBlack : backArrowWhite}
        alt="back-arrow-image-not-found"
      />
      <TextWrapper
        color={props.color}
        marginLeft={props.marginLeft}
        fontWeight={props.fontWeight}
        fontSize={props.fontSize}
        lineHeight={props.lineHeight}
      >
        <Text>{props.goBackText ? props.goBackText : "Go Back"}</Text>
      </TextWrapper>
    </BackWrapper>
  );
};

export default GoBack;

export const BackWrapper = styled(StyledButton)`
  background-color: transparent;
  display: flex;
  align-items: center;

  @media ${device.tablet} {
    padding-left: calc(48px - 24px);
  }

  @media ${device.laptop} {
    padding-left: calc(72px - 24px);
  }

  @media ${device.laptopL} {
    padding-left: calc(136px - 24px);
  }
`;
export const Back = styled.img``;

export const TextWrapper = styled(H6)`
  font-family: ManropeRegular;
  margin-left: ${(props) => props.marginLeft || "7px"};
  font-weight: ${(props) => props.fontWeight || "400"};
  font-size: ${(props) => props.fontSize || "18px"};
  line-height: ${(props) => props.lineHeight || "25px"};
  color: ${(props) => (props.color === "black" ? "#1E1E1E" : "#ffffff")};
`;
