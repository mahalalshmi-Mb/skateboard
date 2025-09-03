import React from "react";
import styled from "styled-components";
import chevronBlack from "../assets/chevron-black.svg";
import orderNow from "../assets/orderNow.svg";
import { Link } from "react-router-dom";
import { device } from "../../../commons/util/helperFunctions";
import Text from "../../../components/atoms/Text";
import parse from "html-react-parser";
import useCustomNavigation from "../../../hooks/useCustomNavigation";
import { colors } from "theme/colors";

const FeaturedRetailers = (props) => {
  const { pushHistory } = useCustomNavigation();

  const handleButtonClick = (url, isExternal, isNewWindow) => {
    if (isExternal) {
      if (isNewWindow) {
        window.open(url, "_blank");
      } else {
        window.open(url, "_self");
      }
    } else {
      pushHistory(url);
    }
  };
  return (
    <Wrapper>
      <TitleContainer>
        <Title>
          <Text type="medium">{props?.data?.attributes?.header || ""}</Text>
        </Title>
        <SubTitle>
          <Text>
            {props?.data?.attributes?.body
              ? parse(props?.data?.attributes?.body) || ""
              : ""}
          </Text>
        </SubTitle>
      </TitleContainer>
      <ButtonWrapper>
        <Image src={orderNow} alt="order-now" />
        <Button
          onClick={() =>
            handleButtonClick(
              props?.data?.attributes?.redirectLink,
              props?.data?.attributes?.isExternal
            )
          }
        >
          <Text type="medium">
            {props?.data?.attributes?.html
              ? parse(props?.data?.attributes?.html) || ""
              : ""}
          </Text>
          <ButtonIcon src="https://laxurwstage.wpengine.com/wp-content/themes/urw-marketplace/images/chevron-black.svg" />
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 auto 3.375rem;
  max-width: 1240px;
  padding: 0 1rem;

  @media ${device.laptop} {
    padding: 0px;
    justify-content: space-between;
  }
`;
const TitleContainer = styled.div`
  order: 0;
`;
const Title = styled.div`
  font-size: 36px;
`;
const SubTitle = styled.div`
  font-size: 14px;
`;
const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;

  @media ${device.laptop} {
    width: fit-content;
  }
`;
const Image = styled.img`
  display: none;

  @media ${device.laptop} {
    display: flex;
    width: 82px;
    height: 44px;
  }
`;
const Button = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0px 6px;
  background-color: ${({ disabled }) =>
    disabled ? "transparent" : `${colors?.button?.primaryBackground}`};
  border: ${({ disabled }) => (disabled ? "1px solid #a7a9ac" : "none")};
  padding: 8px 16px;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};
  cursor: pointer;
  margin-top: 16px;

  font-size: 18px;
  color: ${({ disabled }) => (disabled ? "#a7a9ac" : `${colors?.button?.primaryText}`)};
  text-transform: uppercase;

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? "transparent" : `${colors?.primaryHover}`};
  }

  @media ${device.laptop} {
    margin-top: 0px;
  }
`;
const ButtonIcon = styled.img`
  width: 12px;
  height: 12px;
`;

export default FeaturedRetailers;
