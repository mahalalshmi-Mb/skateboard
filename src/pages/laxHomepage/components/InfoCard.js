import React from "react";
import styled from "styled-components";
import Text from "components/atoms/Text";
import { colors } from "theme/colors";
import {
  device,
  isDesktopDevice,
  isMobileDevice,
} from "commons/util/helperFunctions";
import useCustomNavigation from "../../../hooks/useCustomNavigation";
import CustomPicture from "components/molecules/customPicture";

const InfoCard = (props) => {
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

  const fetchImageURL = (item) => {
    const desktopImage =
      item?.desktopImage?.data && item.desktopImage.data.length > 0
        ? item.desktopImage.data[0].attributes.url
        : null;

    const mobileImage =
      item?.mobileImage?.data && item.mobileImage.data.length > 0
        ? item.mobileImage.data[0].attributes.url
        : null;

    const style = {
      width: "100%",
      height: isMobileDevice() ? "200px" : "400px",
      borderRadius: "15px",
    };

    return (
      <CustomPicture
        mobilePicture={mobileImage}
        desktopPicture={desktopImage}
        style={style}
      />
    );
  };

  return (
    <Wrapper>
      {Array.isArray(props?.data?.Card) &&
        props.data.Card.map((item, index) => (
          <ContentContainer key={index} reverse={index % 2 !== 0}>
            <ImageSection>{fetchImageURL(item)}</ImageSection>

            <ContentSection>
              <Title>
                <Text type="bold">{item?.title}</Text>
              </Title>
              <Description>
                <Text>{item?.description}</Text>
              </Description>
              <OrderButton
                onClick={() =>
                  handleButtonClick(
                    item?.redirectLink,
                    item?.isExternal,
                    item?.isNewWindow
                  )
                }
              >
                <Text type="bold">{item?.redirectLinkLabel}</Text>
              </OrderButton>
            </ContentSection>
          </ContentContainer>
        ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 84px;

  @media ${device.tablet} {
    gap: 48px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 48px;
  flex-direction: column;
  margin: 0px 24px;
  height: auto;

  @media ${device.tablet} {
    flex-direction: ${({ reverse }) => (reverse ? "row-reverse" : "row")};
    margin: 0px 24px;
    gap: 48px;
  }

  @media ${device.laptop} {
    flex-direction: ${({ reverse }) => (reverse ? "row-reverse" : "row")};
    margin: 0px 54px;
  }
`;

const ImageSection = styled.div`
  @media ${device.tablet} {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 34px;
  margin-bottom: 18px;
  color: ${colors?.text?.black900};
  text-align: left;

  @media ${device.tablet} {
    font-size: 24px;
  }

  @media ${device.laptop} {
    font-size: 48px;
  }
`;

const Description = styled.div`
  font-size: 14px;
  margin-bottom: 14px;
  color: ${colors?.text?.black900};
  text-align: left;

  @media ${device.laptop} {
    font-size: 18px;
  }
`;

const OrderButton = styled.button`
  background: ${colors?.primary};
  color: ${colors?.text?.white900};
  padding: 12px 40px;
  border-radius: 50px;
  cursor: pointer;
  width: fit-content;
  text-transform: uppercase;
  font-size: 14px;
  border: none;

  @media ${device.laptop} {
    font-size: 16px;
    &:hover {
      background-color: ${colors?.primary};
      opacity: 0.7;
    }
  }
`;

export default InfoCard;
