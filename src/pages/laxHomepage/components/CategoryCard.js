import React from "react";
import styled from "styled-components";
import Text from "../../../components/atoms/Text";
import useCustomNavigation from "../../../hooks/useCustomNavigation";
import Arrow from "../../../assets/images/arrows/backArrowBlack.svg";
import { device } from "commons/util/helperFunctions";
import { colors } from "theme/colors";

const CategoryCard = (props) => {
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
    <Wrapper
      onClick={() =>
        handleButtonClick(
          props?.data?.attributes?.RedirectLink,
          props?.data?.attributes?.IsExternal,
          props?.data?.attributes?.isNewWindow
        )
      }
      isExperience={props?.isExperience}
    >
      <Title isExperience={props?.isExperience}>
        <Text type="medium">{props?.data?.attributes?.Header || ""}</Text>
      </Title>
      <ImageContainer>
        <Image
          src={props?.data?.attributes?.Image?.data?.[0]?.attributes?.url}
          alt={
            props?.data?.attributes?.Image?.data?.[0]?.attributes
              ?.alternativeText
          }
          isExperience={props?.isExperience}
        />
        <ArrowWrapper isExperience={props?.isExperience}>
          <ArrowRight src={Arrow} />
        </ArrowWrapper>
        {props?.data?.attributes?.RedirectLinkLabel && (
          <Title>
            <Text type="medium">
              {props?.data?.attributes?.RedirectLinkLabel}
            </Text>
          </Title>
        )}
      </ImageContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 275px;
  max-width: 275px;
  min-width: 275px;
  cursor: pointer;
  padding-bottom: 32px;
  transition: transform 0.4s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media ${device.tablet} {
    width: ${({ isExperience }) => (isExperience ? "200px" : "275px")};
    min-width: ${({ isExperience }) => (isExperience ? "200px" : "275px")};
    max-width: ${({ isExperience }) => (isExperience ? "200px" : "275px")};
  }

  @media ${device.laptop} {
    width: ${({ isExperience }) => (isExperience ? "300px" : "275px")};
    min-width: ${({ isExperience }) => (isExperience ? "300px" : "275px")};
    max-width: ${({ isExperience }) => (isExperience ? "300px" : "275px")};
  }

  @media ${device.mobileL} {
    padding-bottom: 0px;
  }

  @media ${device.mobileS} {
    padding-bottom: 0px;
  }
`;
const Title = styled.div`
  font-size: 28px;
  color: ${colors?.text?.black200};
  text-align: center;
  padding: 18px;
  height: ${({ isExperience }) => (isExperience ? "100px" : "60px")};
`;
const ImageContainer = styled.div`
  width: 100%;
  max-width: 100%;
  position: relative;
  margin-top: 8px;
`;
const Image = styled.img`
  width: 100%;
  border-radius: ${({ isExperience }) => (isExperience ? "0px" : "12px")};
`;
const ArrowWrapper = styled.div`
  position: absolute;
  left: 40%;
  bottom: -32px;
  background-color: #eef3fb;
  height: 48px;
  width: 48px;
  display: ${({ isExperience }) => (isExperience ? "none" : "flex")};
  justify-content: center;
  align-items: center;
  z-index: 9;
  border-radius: 50%;
`;
const ArrowRight = styled.img`
  width: 16px;
  height: 16px;
  transform: rotate(180deg);
`;

export default CategoryCard;
