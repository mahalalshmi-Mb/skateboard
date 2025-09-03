import React, { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";
import moment from "util/momentWrapper";
import { device } from "../../../../commons/util/helperFunctions";
import Text from "../../../../components/atoms/Text";
import ProductFallbackImg from "../../assets/Fallback Images/product-fallback-medium.svg";
import PreTimeIcon from "../../assets/pretime.svg";
import { colors } from "theme/colors";
import { AddButton } from "theme/globalStyleSheet";
import FoundedInPhillyLogo from "../../../../assets/images/shops/FoundedInPhilly_Logo.svg";
import { getAppConfig } from "commons/util/appConfigHelper";

const ShopCard = (props) => {
  const isOrderNowEnabled = (shopTimings) => {
    const currMoment = moment();
    const currDay = currMoment.format("ddd");
    const currTime = currMoment.hours() * 60 + currMoment.minutes();

    if (shopTimings?.length > 0) {
      const timings = shopTimings?.find((x) => x?.dayOfWeek?.includes(currDay));
      if (timings) {
        const shopStartTime =
          parseInt(timings.startHour) * 60 + parseInt(timings.startMin);
        const shopEndTime =
          parseInt(timings.endHour) * 60 + parseInt(timings.endMin);
        return currTime >= shopStartTime && currTime <= shopEndTime;
      }
    }
    return false;
  };
  const getStoreImage = () => {
    const found = props?.data?.shopImage?.find(
      (x) =>
        x?.imageType === "medium" &&
        x?.isActive?.toLowerCase() === "y" &&
        (x?.platform?.toLowerCase() === "web" ||
          x?.platform?.toLowerCase() === "marketplace")
    );
    if (found) {
      return found?.imageURL || "";
    } else {
      return "";
    }
  };

  const getShopCategory = () => {
    let categoryArr = [];
    props?.data?.shopCategory?.values?.forEach((x) => {
      categoryArr?.push(x?.name);
    });
    if (categoryArr?.length > 0) {
      return categoryArr?.join(", ");
    } else {
      return "";
    }
  };

  const isFoundedInPhilly = () => {
    if (getAppConfig("SHOW_STORE_LOGO")) {
      const found = props?.data?.shopCategory?.values?.find(
        (x) => x?.name?.toLowerCase() === "founded in philly"
      );
      if (found) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <Wrapper
      onClick={
        props?.data?.orderingEnabled &&
        isOrderNowEnabled(props?.data?.shopTimings || [])
          ? props.onClick
          : null
      }
    >
      <StoreImageWrapper>
        <StoreImage
          src={getStoreImage()}
          onError={(e) => {
            e.target.src = ProductFallbackImg;
          }}
          loading="lazy"
        />
        {isFoundedInPhilly() && (
          <PhillyLogoWrapper>
            <PhillyLogo src={FoundedInPhillyLogo} />
          </PhillyLogoWrapper>
        )}
      </StoreImageWrapper>
      <ContentContainer>
        <ContentWrapper>
          <MetadataContainer>
            <MetadataWrapper>
              <SpacedOutRow>
                <StoreTitleWrapper>
                  <StoreTitle>
                    <Text type="bold">{props?.data?.storeDisplayName}</Text>
                  </StoreTitle>
                  <StoreDetailsContainer>
                    <StoreLocation>
                      <Text type="medium">
                        {`${
                          props?.data?.terminal?.displayLabel
                            ? `${props?.data?.terminal?.displayLabel?.trim()}`
                            : ``
                        }${
                          props?.data?.terminal?.displayLabel &&
                          props?.data?.pickupLocation
                            ? `, ${props?.data?.pickupLocation?.trim()}`
                            : props?.data?.pickupLocation
                            ? `${props?.data?.pickupLocation?.trim()}`
                            : ``
                        }
                  `}
                      </Text>
                    </StoreLocation>
                    {getAppConfig("SHOW_SHOP_CATEGORY") && (
                      <StoreCategory>
                        {props?.data?.shopCategory?.values?.length > 0 && (
                          <Text>{getShopCategory()}</Text>
                        )}
                      </StoreCategory>
                    )}
                    <StorePrepTimeContainer>
                      {props?.data?.prepTime &&
                        props?.data?.orderingEnabled && (
                          <>
                            <StorePrepTimeIcon src={PreTimeIcon} />
                            <StorePrepTime>
                              <Text>{`Pickup Time - ${props?.data?.prepTime}`}</Text>
                            </StorePrepTime>
                          </>
                        )}
                    </StorePrepTimeContainer>
                  </StoreDetailsContainer>
                </StoreTitleWrapper>
                {getAppConfig("SHOW_STORE_LOGO") &&
                  props?.data?.shopBrandImageUrl && (
                    <StoreLogoContainer>
                      <StoreLogo
                        src={props?.data?.shopBrandImageUrl}
                        alt="store-logo"
                        showInGrayscale={
                          getAppConfig("SHOW_STORE_LOGO_GRAYSCALE") || false
                        }
                      />
                    </StoreLogoContainer>
                  )}
              </SpacedOutRow>
            </MetadataWrapper>
          </MetadataContainer>
        </ContentWrapper>
        <StoreActionContainer>
          {props?.data?.orderingEnabled && (
            <StoreActionButton
              disabled={!isOrderNowEnabled(props?.data?.shopTimings || [])}
              onClick={props.onClick}
            >
              <Text type="medium">
                {isOrderNowEnabled(props?.data?.shopTimings || [])
                  ? "Order Now"
                  : "Order Now Unavailable"}
              </Text>
            </StoreActionButton>
          )}
        </StoreActionContainer>
      </ContentContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px 0px;
  background: white;
  padding: 14px;
  border-radius: 12px;

  @media ${device.tablet} {
    min-width: 300px;
    max-width: 300px;
    gap: 16px 0px;
  }

  @media ${device.laptop} {
    min-width: 300px;
    max-width: 300px;
    gap: 16px 0px;
    transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);

    &:hover {
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-5px);
    }
  }

  @media ${device.desktop} {
    min-width: 300px;
    max-width: 300px;
    gap: 16px 0px;
    transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);

    &:hover {
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-5px);
    }
  }
`;
const StoreImageWrapper = styled.div`
  width: 100%;
  height: 156px;
  cursor: pointer;
  border-radius: 8px;
  position: relative;

  @media ${device.laptop} {
    transition: transform 0.5s ease;

    &:hover {
      transform: scale(1.02);
    }
  }
`;

const StoreImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
`;
const PhillyLogoWrapper = styled.div`
  position: absolute;
  top: -14px;
  right: -14px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${device.laptop} {
    top: -18px;
    right: -18px;

    width: 56px;
    height: 56px;
  }
`;
const PhillyLogo = styled.img`
  width: 48px;
  height: 48px;

  @media ${device.laptop} {
    width: 56px;
    height: 56px;
  }
`;
const StoreLogoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;
const StoreLogo = styled.img`
  display: flex;
  width: 75px;
  height: 75px;
  object-fit: cover;
  filter: ${({ showInGrayscale }) =>
    showInGrayscale ? "grayscale(100%)" : "none"};
`;
const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const ContentWrapper = styled.div`
  width: 100%;
`;
const MetadataContainer = styled.div`
  width: 100%;
`;
const MetadataWrapper = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
const StoreIconContainer = styled.div`
  width: 80px;
  height: 22px;
`;
const StoreIcon = styled.img`
  width: 100%;
  height: 100%;
  display: inline-block;
  max-width: 100%;
  height: auto !important;
  vertical-align: middle;
  cursor: pointer;
`;
const StoreTitleWrapper = styled.div`
  width: 100%;
`;
const StoreTitle = styled.div`
  font-size: 20px;
  color: ${colors?.text?.actionTextColor};
  cursor: pointer;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media ${device.laptop}, ${device.tablet} {
    height: 60px;
  }
`;
const StoreDetailsContainer = styled.div`
  width: 100%;
`;
const StoreLocation = styled.div`
  font-size: 16px;
  color: ${colors?.text?.black800};
  line-height: 18px;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-top: 4px;

  @media ${device.laptop}, ${device.tablet} {
    height: 24px;
  }
`;
const StoreCategory = styled.div`
  font-size: 16px;
  color: ${colors?.text?.gray200};
  line-height: 18px;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-top: 4px;

  @media ${device.laptop}, ${device.tablet} {
    height: 24px;
  }
`;
const StorePrepTimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding-top: 4px;

  @media ${device.laptop}, ${device.tablet} {
    height: 24px;
  }
`;
const StorePrepTimeIcon = styled.img`
  width: 16px;
  height: 16px;
`;
const StorePrepTimeLabel = styled.div`
  font-size: 14px;
  color: ${colors?.text?.black200};
`;
const StorePrepTime = styled.div`
  font-size: 16px;
  color: ${colors?.text?.gray200};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;
const StoreActionContainer = styled.div`
  width: 100%;
  margin-top: 12px;
`;
const StoreActionButton = styled(AddButton)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0px 6px;
  background-color: ${({ disabled }) =>
    disabled ? "transparent" : `${colors?.primary}`};
  border: ${({ disabled }) =>
    disabled
      ? "1px solid #a7a9ac"
      : `2px solid ${colors?.text?.actionTextColor}`};
  padding: 8px 16px;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};
  cursor: pointer;
  border-radius: 50px;

  font-size: 14px;
  color: ${({ disabled }) =>
    disabled ? "#a7a9ac" : `${colors?.text?.tertiaryText}`};
  text-transform: uppercase;
  float: right;
  letter-spacing: 1px;

  @media ${device.laptop}, ${device.tablet} {
    width: fit-content;
  }
`;
const StoreActionButtonIcon = styled.img`
  width: 12px;
  height: 12px;
`;
const StoreDescContainer = styled.div`
  width: 100%;
`;
const DescriptionWrapper = styled.div`
  font-size: 14px;
  color: ${colors?.text?.gray200};
  padding-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media ${device.laptop}, ${device.tablet} {
    height: 50px;
  }
`;
const SpacedOutRow = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;
export default ShopCard;
