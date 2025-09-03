import React from "react";
import styled from "styled-components";
import { colors } from "theme/colors";
import Text from "components/atoms/Text";
import {
  device,
  isDesktopDevice,
  isMobileDevice,
} from "commons/util/helperFunctions";
import useCustomNavigation from "../../../hooks/useCustomNavigation";
import CustomPicture from "components/molecules/customPicture";

const OrderSection = (props) => {
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

  const phoneStyle = {
    width: "200px",
    height: "400px",
  };
  const fetchBgImage = (item, style) => {
    const desktopImage =
      item?.desktopImage?.data?.[0]?.attributes?.formats?.medium?.url;
    const mobileImage =
      item?.mobileImage?.data?.[0]?.attributes?.formats?.medium?.url;

    return (
      <CustomPicture
        mobilePicture={mobileImage}
        desktopPicture={desktopImage}
        style={style}
      />
    );
  };

  return (
    Array.isArray(props?.data?.Card) &&
    props?.data?.Card?.map((item, index) => {
      const sectionBgImage =
        props?.data?.desktopImage?.data?.[0]?.attributes?.formats?.medium?.url;

      return (
        <SectionWrapper key={index} backgroundImg={sectionBgImage}>
          <ContentContainer>
            <ImageSection>{fetchBgImage(item, phoneStyle)}</ImageSection>
            <ContentSection>
              <Overlay />
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
                    item?.IsExternal,
                    item?.isNewWindow
                  )
                }
              >
                <Text type="bold">{item?.redirectLinkLabel}</Text>
              </OrderButton>
            </ContentSection>
          </ContentContainer>
        </SectionWrapper>
      );
    })
  );
};

const SectionWrapper = styled.section`
  position: relative;
  background-image: url(${(props) => props.backgroundImg});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  gap: 24px;

  @media ${device.laptop}, ${device.tablet} {
    flex-direction: row;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  @media ${device.tablet} {
    margin-top: 32px;
  }

  @media ${device.laptop} {
    margin-top: 80px;
  }
`;

const ContentSection = styled.div`
  flex: 1;
  position: relative;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 24px;
  text-align: left;
  overflow: hidden;
  justify-content: center;

  @media ${device.laptop}, ${device.tablet} {
    padding: 0 40px;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    ${colors.background} 100%
  );
  z-index: 0;
`;

const Title = styled.div`
  position: relative;
  z-index: 1;
  font-size: 34px;
  margin-bottom: 10px;
  color: ${colors?.text?.black900};

  @media ${device.laptop} {
    font-size: 48px;
  }
`;

const Description = styled.div`
  position: relative;
  z-index: 1;
  font-size: 14px;
  margin-bottom: 10px;
  color: ${colors?.text?.black900};

  @media ${device.laptop} {
    font-size: 18px;
  }
`;

const OrderButton = styled.button`
  position: relative;
  z-index: 1;
  background: ${colors?.primary};
  color: ${colors?.text?.white900};
  padding: 12px 40px;
  border-radius: 50px;
  cursor: pointer;
  width: fit-content;
  border: 2px solid ${colors?.primary};
  text-transform: uppercase;
  font-size: 14px;
  margin-left: 0;
  margin-right: auto;

  @media ${device.laptop} {
    margin: unset;
    font-size: 16px;

    &:hover {
      border: 2px solid ${colors?.primary};
      color: ${colors?.text?.actionTextColor};
      background-color: ${colors?.background};
    }
  }
`;

export default OrderSection;
