import React from "react";
import Rating from "../../assets/Rating.svg";
import Text from "../../../../components/atoms/Text";
import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";
import ProductFallbackImg from "../../assets/Fallback Images/product-fallback-medium.svg";
import ETA from "../../assets/ETABlack.svg";
import { colors } from "theme/colors";

const StoreImage = styled.img`
  width: 159px;
  height: 159px;
  border-radius: 8px;
  object-fit: contain;

  @media ${device.laptop} {
    width: 168px;
    height: 168px;
  }
`;
const StoreNameWrapper = styled.div`
  font-size: 18px;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 22px;
  color: ${colors?.text?.black300};

  @media ${device.laptop} {
    font-size: 20px;
  }
`;
const RatingWrapper = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  margin-top: 4px;
`;
const RatingIcon = styled.img``;
const RatingTextWrapper = styled.div`
  font-size: 14px;
  margin-left: 8px;
  line-height: 18px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
const CategoryTextWrapper = styled.div`
  font-size: 14px;
  color: ${colors?.text?.gray900};
  line-height: 16px;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 12px;

  @media ${device.laptop} {
    font-size: 16px;
    margin-top: 18px;
  }
`;
const LocationTextWrapper = styled.div`
  font-size: 14px;
  color: ${colors?.text?.gray900};
  line-height: 16px;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 4px;

  @media ${device.laptop} {
    font-size: 16px;
  }
`;

const StoreListItem = (props) => {
  const storeSource = props.store;
  const image =
    storeSource?.shopImage?.filter(
      (x) =>
        x.isActive?.toLowerCase() === "y" &&
        x.imageType?.toLowerCase() === "small" &&
        (x?.platform?.toLowerCase() === "web" ||
          x?.platform?.toLowerCase() === "marketplace")
    )[0]?.imageURL || "";

  const renderRatingSection = (rating) => {
    if (!rating) return null;

    const ratingValue =
      typeof rating === "string"
        ? rating
        : Array.isArray(rating)
        ? rating.find((item) => item.isActive)?.rating || ""
        : "";

    return (
      ratingValue &&
      ratingValue !== "" && (
        <RatingWrapper>
          <RatingIcon src={Rating} />
          <RatingTextWrapper>
            <Text type="bold">{ratingValue}</Text>
          </RatingTextWrapper>
        </RatingWrapper>
      )
    );
  };

  return (
    <Wrapper onClick={() => props.onClick()}>
      <StoreImage
        src={image}
        onError={(e) => {
          e.target.src = ProductFallbackImg;
        }}
      />
      <DetailWrapper>
        <DetailTextWrapper>
          <StoreNameWrapper>
            <Text type="bold">{storeSource?.storeDisplayName}</Text>
          </StoreNameWrapper>
          {/* {renderRatingSection(storeSource?.rating)} */}
          <StoreLocation>
            <Text>
              {`${
                storeSource?.terminal?.displayLabel
                  ? `${storeSource?.terminal?.displayLabel}`
                  : ``
              }`}
            </Text>
          </StoreLocation>
          {storeSource?.prepTime && (
            <PrepTimeWrapper>
              <PrepTimeImage src={ETA} />
              <PrepTimeValue>
                <Text>{storeSource?.prepTime}</Text>
              </PrepTimeValue>
            </PrepTimeWrapper>
          )}
          <CategoryTextWrapper>
            <Text>{storeSource?.shopCategory?.values?.[0]?.name || ""}</Text>
          </CategoryTextWrapper>
          <LocationTextWrapper>
            <Text>{storeSource?.location?.trim()}</Text>
          </LocationTextWrapper>
        </DetailTextWrapper>
        <CtaWrapper>
          <Text type="bold">View Menu</Text>
        </CtaWrapper>
      </DetailWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  cursor: pointer;
  gap: 16px;

  @media ${device.laptop} {
    width: 368px;
    min-width: 368px;
    max-width: 368px;
    height: 168px;
    min-height: 168px;
    max-height: 168px;
    gap: 24px;
  }
`;
const DetailWrapper = styled.div`
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const DetailTextWrapper = styled.div`
  width: 100%;
`;
const CtaWrapper = styled.div`
  width: 100%;
  font-size: 18px;
  line-height: 22px;
  color: ${colors?.text?.actionTextColor};
`;
const PrepTimeWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;
const PrepTimeValue = styled.div`
  font-size: 14px;
  color: ${colors?.text?.gray300};
  line-height: 16px;

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
const PrepTimeImage = styled.img``;
const StoreLocation = styled.div`
  font-size: 14px;
  color: ${colors?.text?.gray300};
  padding-top: 8px;
`;

export default StoreListItem;
