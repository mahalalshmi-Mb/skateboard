import React, { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";
import { device, size } from "../../../../commons/util/helperFunctions";
import Text from "../../../../components/atoms/Text";
import moment from "util/momentWrapper";
import ProductFallbackImg from "../../assets/Fallback Images/product-fallback-medium.svg";
import { colors } from "theme/colors";
import { AddButton, H4 } from "theme/globalStyleSheet";
import ShowMoreInfoModal from "../organism/ShowMoreInfoModal";
import { getAppConfig } from "commons/util/appConfigHelper";
import Timer from "../../assets/timer.svg";
import PreTimeIcon from "../../assets/pretime.svg";
import LocationIcon from "../../assets/LocateIconBlack.svg";

const DirectoryCard = (props) => {
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
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
      return categoryArr || [];
    } else {
      return "";
    }
  };

  const getStoreTimeForCurrentDay = (shopTimings) => {
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
        const startTime = `${timings?.startHour}:${timings?.startMin}`;
        const endTime = `${timings?.endHour}:${timings?.endMin}`;

        if (currTime >= shopStartTime && currTime <= shopEndTime) {
          if (startTime === "00:00" && endTime === "23:59") {
            return "Open all day";
          }
          const end12hr = convertTimeFormat(endTime);
          return `Open until ${end12hr}`;
        } else {
          const start12hr = convertTimeFormat(startTime);
          return `Closed - Opens at ${start12hr}`;
        }
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  const convertTimeFormat = (time) => {
    const [hour, minute] = time.split(":");
    let hour12 = parseInt(hour, 10);
    const period = hour12 >= 12 ? "pm" : "am";
    if (hour12 > 12) hour12 -= 12;
    if (hour12 === 0) hour12 = 12;
    return `${hour12}:${minute} ${period}`;
  };

  return (
    <Wrapper>
      <StoreImageWrapper>
        <StoreImage
          src={getStoreImage()}
          onError={(e) => {
            e.target.src = ProductFallbackImg;
          }}
        />
      </StoreImageWrapper>
      <ContentContainer>
        <ContentWrapper>
          <MetadataContainer>
            <MetadataWrapper>
              <StoreTitleWrapper>
                <StoreTitle>
                  <Text type="semi-bold" variant="heading">
                    {props?.data?.storeDisplayName}
                  </Text>
                </StoreTitle>
              </StoreTitleWrapper>
              <StoreLocation>
                <StoreLocationIcon src={LocationIcon} alt="store-location" />
                <StoreLocationTerminal>
                  <Text type="medium">
                    {`${
                      props?.data?.terminal?.displayLabel
                        ? `${props?.data?.terminal?.displayLabel?.trim()}`
                        : ``
                    }${
                      props?.data?.pickupLocation &&
                      props?.data?.terminal?.displayLabel
                        ? `, ${props?.data?.pickupLocation?.trim()}`
                        : props?.data?.pickupLocation
                        ? `${props?.data?.pickupLocation?.trim()}`
                        : ``
                    }
                  `}
                  </Text>
                </StoreLocationTerminal>
              </StoreLocation>
              <StoreTimeContainer>
                <TimerIcon src={Timer} alt="timer" />
                <StoreTime>
                  <Text>
                    {getStoreTimeForCurrentDay(props?.data?.shopTimings || [])}
                  </Text>
                </StoreTime>
              </StoreTimeContainer>
              {props?.data?.prepTime && props?.data?.orderingEnabled && (
                <StorePrepTimeContainer>
                  <TimerIcon src={PreTimeIcon} alt="pickup-time" />
                  <StorePrepTime>
                    <Text type="medium">{`Pickup - ${props?.data?.prepTime}`}</Text>
                  </StorePrepTime>
                </StorePrepTimeContainer>
              )}
              {props?.data?.isPresecurity && (
                <PreSecurityButton>
                  <Text type="medium">Pre-Security</Text>
                </PreSecurityButton>
              )}
              {getAppConfig("SHOW_SHOP_CATEGORY") &&
                props?.data?.shopCategory?.values?.length > 0 && (
                  <StoreCategoryContainer>
                    {getShopCategory()?.map((x, index) => (
                      <StoreCategoryButton key={index}>
                        <Text>{x}</Text>
                      </StoreCategoryButton>
                    ))}
                  </StoreCategoryContainer>
                )}
            </MetadataWrapper>
            {getAppConfig("SHOW_STORE_LOGO") &&
              props?.data?.shopBrandImageUrl &&
              props?.data?.shopBrandImageUrl !== "" && (
                <StoreLogo
                  src={props?.data?.shopBrandImageUrl}
                  alt="store-logo"
                  showInGrayscale={
                    getAppConfig("SHOW_STORE_LOGO_GRAYSCALE") || false
                  }
                />
              )}
          </MetadataContainer>
          {props?.data?.description && props?.data?.description !== "" && (
            <StoreDescription>
              <Text type="regular">
                {ReactHtmlParser(props?.data?.description || "")}
              </Text>
            </StoreDescription>
          )}
        </ContentWrapper>
        <StoreActionContainer>
          <StoreViewButton onClick={() => setShowMoreInfoModal(true)}>
            <Text type="medium">VIEW INFO</Text>
          </StoreViewButton>
          {props?.data?.orderingEnabled && (
            <StoreActionButton
              disabled={!isOrderNowEnabled(props?.data?.shopTimings || [])}
              onClick={() => props.handleStoreClick(props?.data)}
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
      {showMoreInfoModal && (
        <ShowMoreInfoModal
          data={props?.data || {}}
          isDrawerOpen={showMoreInfoModal}
          setIsDrawerOpen={setShowMoreInfoModal}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px 0px;

  @media ${device.laptop} {
    flex-direction: row;
    gap: 0px 16px;
  }
`;
const StoreImageWrapper = styled.div`
  width: 100%;
  height: 227px;
  border-radius: 8px;
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.02);
  }

  @media ${device.laptop} {
    width: 350px;
    min-width: 350px;
    max-width: 350px;
    height: 232px;
  }
`;
const StoreImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: contain;
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
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  position: relative;
`;
const MetadataWrapper = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
`;
const StoreTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;
const StoreTitle = styled(H4)`
  color: ${colors?.text?.black200};
  font-size: 22px;

  @media ${device.laptop} {
    font-size: 26px;
  }
`;
const StoreLocation = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${colors?.text?.black200};
  gap: 4px;
`;
const StoreLocationIcon = styled.img`
  width: 18px;
  height: 18px;
`;
const StorePrepTimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;
const StorePrepTime = styled.div`
  font-size: 16px;
  color: ${colors?.text?.gray200};
`;
const StoreDescription = styled.div`
  font-size: 14px;
  color: ${colors?.text?.gray200};
  padding-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media ${device.laptop} {
    font-size: 14px;
    padding-top: 12px;
  }
`;
const StoreActionContainer = styled.div`
  width: 100%;
  padding-top: 8px;
  display: flex;
  justify-content: space-between;
`;
const StoreActionButton = styled(AddButton)`
  width: fit-content;
  background-color: ${({ disabled }) =>
    disabled ? "transparent" : `${colors?.button?.primaryBackground}`};
  border: ${({ disabled }) =>
    disabled
      ? "2px solid #a7a9ac"
      : `2px solid ${colors?.text?.actionTextColor}`};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};
  padding: 12px 20px;
  cursor: pointer;

  font-size: 14px;
  color: ${({ disabled }) =>
    disabled ? "#a7a9ac" : `${colors?.button?.primaryText}`};
  text-transform: uppercase;
  @media ${device.laptop}, ${device.tablet} {
    width: fit-content;
  }
`;
const StoreLocationTerminal = styled.div`
  display: flex;
  font-size: 14px;
  color: ${colors?.text?.black200};
`;
const StoreViewButton = styled.button`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0px 6px;
  background-color: transparent;
  border: none;
  padding: 8px 16px 8px 0px;
  cursor: pointer;

  font-size: 14px;
  color: ${colors?.text?.actionTextColor};
  line-height: 18px;
  letter-spacing: 0.1px;
  text-transform: uppercase;

  &:hover {
    text-decoration: underline;
  }
`;
const PreSecurityButton = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0px 6px;
  border-radius: 36px;
  border: 1px solid ${colors?.primary};
  background-color: ${colors?.text?.white100};
  padding: 4px 12px;

  font-size: 12px;
  color: ${colors?.primary};
  line-height: 18px;
  letter-spacing: 0.1px;
`;
const StoreLogo = styled.img`
  position: absolute;
  top: 0px;
  right: 0px;
  display: flex;
  width: 75px;
  height: 75px;
  object-fit: cover;
  filter: ${({ showInGrayscale }) =>
    showInGrayscale ? "grayscale(100%)" : "none"};

  @media ${device.laptop} {
    width: 100px;
    height: 100px;
  }
`;
const StoreCategoryContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;
const StoreCategoryButton = styled.div`
  width: max-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0px 6px;
  border-radius: 36px;
  border: 1px solid #d5d5d5;
  background-color: ${colors?.text?.white100};
  padding: 4px 12px;

  font-size: 10px;
  color: ${colors?.text?.gray200};
  line-height: 18px;
`;
const StoreTimeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0px 4px;
`;
const StoreTime = styled.div`
  font-size: 14px;
  color: ${colors?.text?.gray200};
  line-height: 18px;
`;
const TimerIcon = styled.img`
  width: 18px;
  height: 18px;
`;

export default DirectoryCard;
