import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Text from "../../../components/atoms/Text";
import logoWithServy from "../assets/LAXOrderNowLogoWB_withServy.webp";
import { device } from "../../../commons/util/helperFunctions";
import useCustomNavigation from "../../../hooks/useCustomNavigation";
import { colors } from "theme/colors";

const BannerSlider = (props) => {
  const { pushHistory } = useCustomNavigation();

  const handleButtonClick = (url) => {
    pushHistory(url);
  };

  return (
    <Wrapper
      backgroundColor={
        props?.sectionData?.sectionComponent?.cardComponent?.backgroundColor
      }
    >
      <ContentContainer>
        <ContentWrapper>
          <Title>
            <Text>{props?.data?.attributes?.title || ""}</Text>
          </Title>
          {/* <Logo src={logoWithServy} alt="servy" /> */}
          <Description>
            <Text>{props?.data?.attributes?.description || ""}</Text>
          </Description>
          <Button
            onClick={() =>
              handleButtonClick(props?.data?.attributes?.buttonLink || "")
            }
          >
            <Text>{props?.data?.attributes?.buttonTitle || ""}</Text>
          </Button>
        </ContentWrapper>
        <ImageContainer>
          <Image src={props?.data?.attributes?.imageUrl || ""}></Image>
        </ImageContainer>
      </ContentContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  background: ${({ backgroundColor }) => backgroundColor};
  padding: 24px 16px;
  margin-top: 14px;
  justify-content: center;
  display: flex;

  @media ${device.laptop} {
    padding: 100px 205px;
  }
`;
const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media ${device.laptop} {
    flex-direction: row;
  }
`;
const ContentWrapper = styled.div`
  width: 100%;
`;
const Title = styled.div`
  font-size: 20px;
  color: ${colors?.text?.white900};
`;
const Logo = styled.img`
  width: 300px;
  margin-top: 20px;
`;
const Description = styled.div`
  font-size: 22px;
  margin-top: 16px;
  color: ${colors?.text?.white900};

  @media ${device.laptop} {
    font-size: 28px;
  }
`;
const Button = styled.div`
  color: ${colors?.button?.primaryText};
  padding: 12px 16px;
  max-width: 650px;
  background-color: transparent;
  border: 3px solid #ffffff;
  border-radius: 4px;
  line-height: 32px;
  font-size: 18px;
  text-align: center;
  margin-top: 32px;
  cursor: pointer;
`;
const ImageContainer = styled.div`
  width: 100%;
`;
const Image = styled.img`
  width: 100%;
`;

export default BannerSlider;
