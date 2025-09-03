import React from "react";
import styled from "styled-components";
import Text from "components/atoms/Text";
import { colors } from "theme/colors";
import { device } from "commons/util/helperFunctions";
import useCustomNavigation from "../../../hooks/useCustomNavigation";
import CustomPicture from "components/molecules/customPicture";

const TrendingCard = (props) => {
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
      borderRadius: "100%",
      transition: "transform 0.3s ease",
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
      <CardContainer>
        {Array.isArray(props?.data?.Card) &&
          props?.data?.Card?.map((item, index) => (
            <Card key={index}>
              <Row style={{ background: item?.bgColor }}>
                <Circle>{fetchImageURL(item)}</Circle>
              </Row>
              <CardContent>
                <CardTitle>
                  <Text type="regular">{item?.title}</Text>
                </CardTitle>
                <CardDetail>
                  {item?.subtitle && (
                    <CardSubTitle>
                      <Text type="regular">{item?.subtitle}</Text>
                    </CardSubTitle>
                  )}
                  <ActionButton
                    onClick={() =>
                      handleButtonClick(
                        item?.redirectLink,
                        item?.IsExternal,
                        item?.isNewWindow
                      )
                    }
                  >
                    <Text type="bold">{item?.redirectLinkLabel}</Text>
                  </ActionButton>
                </CardDetail>
              </CardContent>
            </Card>
          ))}
      </CardContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 0px 24px;

  @media ${device.laptop} {
    padding: 24px 54px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;

  @media ${device.tablet} {
    align-items: center;
    text-align: center;
    padding: 0px 24px;
  }

  @media ${device.laptop} {
    align-items: center;
    text-align: center;
    padding: 0px 180px;
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
  font-size: 14px;
  color: ${colors?.text?.black900};

  @media ${device.laptop} {
    font-size: 18px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;

  @media ${device.tablet} {
    flex-direction: row;
    gap: 12px;
  }

  @media ${device.laptop} {
    flex-direction: row;
    padding: 0px 40px;
  }
`;

const Card = styled.div`
  width: 300px;
  background: ${colors?.background};
  border-radius: 0px 0px 12px 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 0.5px solid ${colors?.text?.black900};

  @media ${device.laptop} {
    &:hover img {
      transform: scale(1.1);
    }
  }
`;

const Row = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${colors?.text?.black900};

  @media ${device.tablet} {
    height: 250px;
  }

  @media ${device.laptop} {
    height: 300px;
  }
`;

const Circle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background: ${colors?.background};
  display: flex;
  justify-content: center;
  align-items: center;

  @media ${device.tablet} {
    width: 150px;
    height: 150px;
  }

  @media ${device.laptop} {
    width: 200px;
    height: 200px;
  }
`;

const CardContent = styled.div`
  height: 200px;
  max-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${colors?.secondaryHover};
`;

const CardTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${colors?.text?.black900};
  padding: 16px;
  text-align: center;

  @media ${device.tablet} {
    min-height: 76px;
    font-size: 18px;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @media ${device.laptop} {
    min-height: 94px;
    font-size: 24px;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const CardDetail = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-top: 1px solid ${colors?.text?.black900};
  align-items: center;
  justify-content: center;
`;

const CardSubTitle = styled.div`
  font-size: 14px;
  color: ${colors?.text?.black900};
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 4px;
  margin: 8px 0px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: center;
`;
const ActionButton = styled.button`
  background: ${colors?.background};
  color: ${colors?.text?.actionTextColor};
  padding: 8px 16px;
  border-radius: 50px;
  cursor: pointer;
  width: 90%;
  border: 1px solid ${colors?.primary};
  font-size: 14px;

  @media ${device.laptop} {
    font-size: 16px;
    &:hover {
      border: 1px solid ${colors?.primary};
      color: ${colors?.text?.white900};
      background-color: ${colors?.primary};
    }
  }
`;
export default TrendingCard;
