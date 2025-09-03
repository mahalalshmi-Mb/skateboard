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

const ImageHoverOverlay = (props) => {
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
    const desktopImage = item?.desktopImage?.data?.[0]?.attributes?.url;
    const mobileImage = item?.mobileImage?.data?.[0]?.attributes?.url;

    const style = {
      width: "100%",
      height: "100%",
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
      <ContentWrapper>
        <TitleText>
          <Text type="bold">{props?.data?.title}</Text>
        </TitleText>
        <SubTitleText>
          <Text type="regular">{props?.data?.description}</Text>
        </SubTitleText>
      </ContentWrapper>
      <ImagesRow>
        {Array.isArray(props?.data?.Card) &&
          props?.data?.Card?.map((item, index) => (
            <ImageContainer key={index}>
              {fetchImageURL(item)}
              <Overlay className="overlay">
                <OverlayText>
                  <Text type="bold">{item?.title}</Text>
                </OverlayText>
                <CenterButton
                  onClick={() =>
                    handleButtonClick(
                      item?.redirectLink,
                      item?.isExternal,
                      item?.isNewWindow
                    )
                  }
                >
                  <Text type="bold">{item?.redirectLinkLabel}</Text>
                </CenterButton>
              </Overlay>
            </ImageContainer>
          ))}
      </ImagesRow>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 0px 24px;

  @media ${device.laptop} {
    padding: 0px 54px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;

  @media ${device.tablet} {
    align-items: center;
    padding: 0px 32px;
  }

  @media ${device.laptop} {
    align-items: center;
    padding: 0px 160px;
  }
`;

const TitleText = styled.div`
  font-size: 34px;
  color: ${colors?.text?.black900};

  @media ${device.laptop} {
    font-size: 48px;
  }
`;

const SubTitleText = styled.div`
  color: ${colors?.text?.black900};
  text-align: left;
  font-size: 14px;

  @media ${device.laptop} {
    font-size: 18px;
    text-align: center;
  }
`;

const ImagesRow = styled.div`
  display: flex;
  gap: 24px;
  flex-direction: column;
  margin-top: 24px;

  @media ${device.tablet} {
    flex-direction: row;
    gap: 12px;
  }

  @media ${device.laptop} {
    flex-direction: row;
    gap: 24px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  flex: 1;
  height: 300px;
  overflow: hidden;
  border-radius: 10px;
  transition: flex 0.4s ease, transform 0.4s ease;

  @media ${device.tablet} {
    height: 250px;
  }

  @media ${device.laptop} {
    height: 300px;
    &:hover {
      flex: 1.5;
    }

    &:hover ~ div {
      flex: 1;
    }

    &:hover img {
      transform: scale(1);
    }

    &:hover .overlay {
      opacity: 1;
    }
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.4);
  transition: opacity 0.3s ease;
  border-radius: 10px;
  gap: 12px;

  @media ${device.laptop} {
    opacity: 0;
    gap: 16px;
  }
`;

const OverlayText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: ${colors?.text?.white900};
  font-size: 24px;
  text-align: center;
  padding: 0 10px;
  text-transform: capitalize;

  @media ${device.tablet} {
    font-size: 18px;
  }

  @media ${device.laptop} {
    font-size: 32px;
  }
`;

const CenterButton = styled.button`
  background: ${colors?.background};
  color: ${colors?.text?.actionTextColor};
  padding: 8px 16px;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  border: 2px solid ${colors?.primary};
  text-transform: uppercase;
  cursor: pointer;
  font-size: 14px;

  @media ${device.tablet} {
    font-size: 12px;
  }

  @media ${device.laptop} {
    font-size: 16px;
    &:hover {
      border: 2px solid ${colors?.primary};
      color: ${colors?.text?.white900};
      background-color: ${colors?.primary};
    }
  }
`;

export default ImageHoverOverlay;
