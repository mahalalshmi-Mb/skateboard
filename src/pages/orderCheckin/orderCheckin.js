import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import config, { S3_URL } from "commons/config";
import callAPI from "commons/callAPI";
import Text from "components/atoms/Text";
import { H1, H6 } from "theme/globalStyleSheet";
import { device } from "commons/util/helperFunctions";
import { colors } from "theme/colors";
import HorizontalLoader from "components/atoms/horizontalLoader";
import { useConfig } from "context/configContext";
import { getAppConfig } from "commons/util/appConfigHelper";
import { NavContext } from "context/navContext";

function OrderCheckin() {
  const { appConfig } = useConfig();
  const useNav = useContext(NavContext);
  const { search } = useLocation();
  const orderId = new URLSearchParams(search).get("orderId") || "";
  const suborderIdStr = new URLSearchParams(search).get("suborderId") || "";
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [cdnUrl, setCdnUrl] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    handleNavs();
    checkinOrder();
  }, []);

  const handleNavs = () => {
    useNav.hideFooterNavs();
  };

  const checkinOrder = async () => {
    try {
      const suborderId = suborderIdStr?.split(",");
      const apiURL = config.api.order.orderCheckin;
      const response = await callAPI.put(apiURL, {
        orderId,
        subOrders: suborderId,
      });
      const regResponse = await response.json();

      if (regResponse?.status?.toString()?.startsWith("20")) {
        const platform = getAppConfig("platform");
        const locationBaseURL = `${S3_URL}/${appConfig.locationId}/${platform}/images/check-in/${regResponse?.metadata?.processedShops?.[0]?.shopId}`;
        setCdnUrl(locationBaseURL);
        setUserName(regResponse?.metadata?.userName || "");
        setIsLoading(false);
      } else {
        setError(true);
        setIsLoading(false);
      }
    } catch (e) {
      setError(true);
      setIsLoading(false);
      console.log(e);
    }
  };

  if (isLoading) {
    return (
      <LoaderWrapper>
        <HorizontalLoader wrapperStyle={{ height: "100px" }} />
        <Text type="bold">Please wait as we process your order</Text>
      </LoaderWrapper>
    );
  } else {
    return (
      <Wrapper>
        <ContentWrapper isError={isError}>
          {!isError && (
            <StoreLogoContainer>
              <StoreLogo src={`${cdnUrl}/store-logo.jpg`} />
            </StoreLogoContainer>
          )}
          {!isError && (
            <StoreImageContainer>
              <StoreImage src={`${cdnUrl}/store-image.jpg`} />
            </StoreImageContainer>
          )}
          <Title isError={isError}>
            <Text type="bold">
              {isError ? "Something went wrong!" : "You're all set!"}
            </Text>
          </Title>
          <SubTitle>
            <Text>
              {isError
                ? "Please try again later."
                : userName !== ""
                ? `Hi ${userName}. We'll have your order ready as soon as we can.`
                : `We'll have your order ready as soon as we can.`}
            </Text>
          </SubTitle>
        </ContentWrapper>
        {!isError && (
          <FooterWrapper>
            <FooterText>
              <Text>Powered by</Text>
            </FooterText>
            <FooterLogo src="https://d10sbcma66shuy.cloudfront.net/strapi-assets/servy_logo_3819909970.jfif" />
          </FooterWrapper>
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 146px);
  position: relative;
`;
const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 136px 0px;
`;
const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${({ isError }) => (isError ? "136px" : "24px")};
`;
const Title = styled(H1)`
  font-size: ${({ isError }) => (isError ? "24px" : "36px")};
  color: ${({ isError }) => (isError ? colors?.state?.error : "#ce2d41")};

  @media ${device.laptop} {
    font-size: 42px;
  }
`;
const SubTitle = styled(H6)`
  text-align: center;
  max-width: 80%;
  padding-top: 8px;
`;
const StoreLogoContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StoreLogo = styled.img`
  height: 50px;
`;
const StoreImageContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StoreImage = styled.img``;
const FooterWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;
const FooterText = styled.div`
  font-size: 14px;
  color: ${colors?.text?.black200};
`;
const FooterLogo = styled.img`
  height: 50px;
`;

export default OrderCheckin;
