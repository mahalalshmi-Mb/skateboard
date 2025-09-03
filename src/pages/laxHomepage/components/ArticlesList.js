import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  device,
  isDesktopDevice,
  isMobileDevice,
} from "../../../commons/util/helperFunctions";
import Text from "../../../components/atoms/Text";
import useCustomNavigation from "../../../hooks/useCustomNavigation";
import { colors } from "theme/colors";
import CustomPicture from "components/molecules/customPicture";

const ArticlesList = (props) => {
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
      objectFit: "cover",
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
      {Array.isArray(props?.data?.Card)
        ? props?.data?.Card?.map((item, index) => (
            <ContentContainer key={index}>
              <ImageContainer>{fetchImageURL(item)}</ImageContainer>
              <TextContainer>
                <Title>
                  <Text type="bold">{item?.title || ""}</Text>
                </Title>
                <Description>
                  <Text type="regular">{item?.description || ""}</Text>
                </Description>
                <Button
                  onClick={() =>
                    handleButtonClick(
                      item?.redirectLink,
                      item?.IsExternal,
                      item?.isNewWindow
                    )
                  }
                >
                  <Text type="bold">{item?.redirectLinkLabel || ""}</Text>
                </Button>
              </TextContainer>
            </ContentContainer>
          ))
        : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 24px;
`;
const ContentContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;

  @media ${device.tablet} {
    flex-direction: row;
    padding: 0px 24px;
  }

  @media ${device.laptop} {
    flex-direction: row;
    padding: 48px 24px;
  }
`;
const ImageContainer = styled.div`
  width: 100%;
  margin: 0;

  @media ${device.laptop} {
    width: 100%;
    height: auto;
  }
`;
const TextContainer = styled.div`
  width: 100%;
  padding: 24px;
  background-color: ${colors?.foreground};
  display: flex;
  align-items: start;
  flex-direction: column;
  justify-content: center;

  @media ${device.laptop} {
    padding: 0px 55px;
  }
`;
const Title = styled.div`
  font-size: 34px;
  line-height: 1.5;
  color: #fff;

  @media ${device.laptop} {
    font-size: 48px;
  }
`;
const Description = styled.div`
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #fff;
  text-align: start;

  @media ${device.laptop} {
    font-size: 18px;
  }
`;
const Button = styled.button`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0px 6px;
  background-color: ${({ disabled }) =>
    disabled ? "transparent" : `${colors?.background}`};
  border: ${({ disabled }) => (disabled ? "1px solid #a7a9ac" : "none")};
  padding: 12px 40px;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};
  cursor: pointer;
  margin-top: 24px;
  border-radius: 100px;
  font-size: 14px;
  color: ${({ disabled }) =>
    disabled ? "#a7a9ac" : `${colors?.text?.actionTextColor}`};
  border: 2px solid ${colors?.primary};

  @media ${device.laptop} {
    margin-top: 30px;
    font-size: 16px;

    &:hover {
      border: 2px solid ${colors?.background};
      color: ${colors?.text?.white900};
      background-color: ${colors?.primary};
    }
  }
`;
export default ArticlesList;
