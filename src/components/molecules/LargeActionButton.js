import React from "react";
import styled from "styled-components";
import Text from "../atoms/Text";
import { Image, StyledButton } from "../../theme/globalStyleSheet";

const renderImage = (source) => {
  if (source.includes(".")) {
    try {
      return require(`../../assets/images/LargeActionButton/${source}`);
    } catch (error) {
      return source;
    }
  }
};

const LargeActionButton = (props) => {
  return (
    <Wrapper onClick={props.onClick} hide={props.hide}>
      <ImageWrapper disabled={props.disabled}>
        <Image src={renderImage(`${props.image}.svg`)} alt="action" />
      </ImageWrapper>
      <TextWrapper disabled={props.disabled}>
        <Text type="semi-bold">{props.label}</Text>
      </TextWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(StyledButton)`
  display: ${({ hide }) => (hide ? "none" : "flex")};
  flex-direction: column;
  height: 70px;
  background-color: #ecf5f6;
  align-items: center;
  justify-content: center;
  width: 100px;
  border-radius: 4px;
`;
const ImageWrapper = styled.div`
  opacity: ${({ disabled }) => disabled && 0.3};
`;
const TextWrapper = styled.div`
  font-family: Manrope;
  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
  opacity: ${({ disabled }) => disabled && 0.3};
  color: #5f6d7e;
`;

export default LargeActionButton;
