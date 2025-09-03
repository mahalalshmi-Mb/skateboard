import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import {
  device,
  isDesktopDevice,
  isMobileDevice,
} from "commons/util/helperFunctions";
import Text from "components/atoms/Text";
import { colors } from "theme/colors";
import CustomPicture from "components/molecules/customPicture";
import { getAppConfig } from "commons/util/appConfigHelper";

function ImageCarousel(props) {
  const imageData = Array.isArray(props?.data)
    ? props?.data
    : Array.isArray(props?.data?.attributes)
    ? props?.data?.attributes
    : Array.isArray(props?.data?.attributes?.images)
    ? props?.data?.attributes?.images
    : props?.data?.attributes?.images
    ? props?.data?.images && Array.isArray(props?.data?.images)
    : props?.data?.images;

  const { pushHistory } = useCustomNavigation();

  const handleRedirection = (redirectUrl, isExternal) => {
    if (isExternal) {
      window.open(redirectUrl, "_blank");
    } else {
      pushHistory(redirectUrl);
    }
  };

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
    const desktopImage = item?.desktopImage?.data?.[0]?.attributes?.url;
    const mobileImage = item?.mobileImage?.data?.[0]?.attributes?.url;

    const style = {
      width: "100%",
      height: "auto",
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
    <SliderWrapper {...props.settings} style={{ width: "auto" }}>
      <Slider {...props.settings}>
        {props.override && props.children}
        {props?.cardType === "BannerCarouselCard"
          ? Array.isArray(props?.data?.Banners) &&
            props?.data?.Banners?.map((item, index) => (
              <BannerWrapper bgColor={item?.bgColor} key={index}>
                <ContentContainer>
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
                          item?.IsExternal,
                          item?.isNewWindow
                        )
                      }
                    >
                      <Text type="bold">{item?.redirectLinkLabel}</Text>
                    </OrderButton>
                  </ContentSection>
                  <ImageSection>{fetchImageURL(item)}</ImageSection>
                </ContentContainer>
              </BannerWrapper>
            ))
          : props.cardType === "BannerCard"
          ? Array.isArray(props?.data?.attributes?.images) &&
            props?.data?.attributes?.images?.map((item, index) => (
              <BannerWrapper key={index}>
                <ImageSection>
                  <Banner
                    src={item?.image?.data?.attributes?.formats?.thumbnail?.url}
                  />
                </ImageSection>
              </BannerWrapper>
            ))
          : Array.isArray(imageData) &&
            imageData?.map((item, index) => (
              <ImageContainer
                style={props.wrapperStyle}
                key={index}
                isAutoscrollHorizontal={props?.isAutoscrollHorizontal || false}
                padding={props?.wrapperStyle?.padding}
                height={props?.wrapperStyle?.height}
              >
                <Image
                  src={item?.image?.data?.attributes?.url || item?.url || ""}
                  onClick={() => {
                    if (
                      item?.redirectLink &&
                      item?.redirectLink !== "" &&
                      item?.redirectLink !== null
                    )
                      handleRedirection(item?.redirectLink, item?.IsExternal);
                  }}
                  style={props.imageStyle}
                  alt="promotion"
                  isAutoscrollHorizontal={
                    props?.isAutoscrollHorizontal || false
                  }
                  height={props?.wrapperStyle?.height}
                  showInGrayscale={
                    getAppConfig("SHOW_STORE_LOGO_GRAYSCALE") || false
                  }
                />
              </ImageContainer>
            ))}
      </Slider>
    </SliderWrapper>
  );
}

const SliderWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  padding: ${({ isAutoscrollHorizontal }) =>
    isAutoscrollHorizontal ? "0px 30px" : "0px"};
`;

const ImageContainer = styled.div`
  width: ${({ isAutoscrollHorizontal }) =>
    isAutoscrollHorizontal ? "100px" : "100%"};
  height: ${({ isAutoscrollHorizontal, height }) =>
    isAutoscrollHorizontal ? "100px" : height ? height : "300px"};
  display: ${({ isAutoscrollHorizontal }) =>
    isAutoscrollHorizontal ? "flex" : "block"};
  justify-content: ${({ isAutoscrollHorizontal }) =>
    isAutoscrollHorizontal ? "center" : "unset"};
  align-items: ${({ isAutoscrollHorizontal }) =>
    isAutoscrollHorizontal ? "center" : "unset"};
  overflow: hidden;
  padding: ${({ isAutoscrollHorizontal, padding }) =>
    isAutoscrollHorizontal ? "0px 10px" : padding ? padding : "0px"};

  @media ${device.laptop} {
    height: ${({ isAutoscrollHorizontal, height }) =>
      isAutoscrollHorizontal ? "100px" : height ? height : "432px"};
  }
`;

const Image = styled.img`
  width: ${({ isAutoscrollHorizontal }) =>
    isAutoscrollHorizontal ? "100px" : "100%"};
  height: ${({ isAutoscrollHorizontal, height }) =>
    isAutoscrollHorizontal ? "100px" : height ? height : "300px"};
  object-fit: contain;
  filter: ${({ showInGrayscale }) =>
    showInGrayscale ? "grayscale(100%)" : "none"};

  @media ${device.laptop} {
    height: ${({ isAutoscrollHorizontal, height }) =>
      isAutoscrollHorizontal ? "100px" : height ? height : "432px"};
  }
`;

//Banner Style

const BannerWrapper = styled.div`
  height: fit-content;
  background-color: ${({ bgColor }) => bgColor || "transparent"};
  padding-top: 24px;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column-reverse;

  @media ${device.laptop}, ${device.tablet} {
    flex-direction: row;
    margin: 0px auto;
    max-width: 1030px;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;

  @media ${device.laptop}, ${device.tablet} {
    align-items: center;
  }
`;

const Banner = styled.img`
  width: 100%;
  height: auto;
`;

const ContentSection = styled.div`
  flex: 1;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px;
  text-align: left;
  width: 100%;

  @media ${device.laptop}, ${device.tablet} {
    padding: 0 40px;
  }
`;
const Title = styled.div`
  font-size: 26px;
  margin-bottom: 18px;
  color: ${colors?.text?.white900};

  @media ${device.laptop} {
    font-size: 48px;
  }
`;
const Description = styled.div`
  font-size: 14px;
  margin-bottom: 14px;
  color: ${colors?.text?.white900};

  @media ${device.laptop} {
    font-size: 18px;
  }
`;

const OrderButton = styled.button`
  background: ${colors?.background};
  color: ${colors?.text?.actionTextColor};
  padding: 12px 40px;
  border-radius: 50px;
  cursor: pointer;
  width: 100%;
  border: none;
  text-transform: uppercase;
  font-size: 14px;
  margin: 0 auto;
  border: 2px solid ${colors?.primary};

  @media ${device.laptop} {
    margin: unset;
    width: fit-content;
    font-size: 16px;

    &:hover {
      border: 2px solid ${colors?.background};
      color: ${colors?.text?.white900};
      background-color: ${colors?.primary};
    }
  }
`;

export default ImageCarousel;
