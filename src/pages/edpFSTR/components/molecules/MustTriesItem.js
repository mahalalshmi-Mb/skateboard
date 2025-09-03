import React from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import Rating from "../../assets/Rating.svg";
import { device } from "../../../../commons/util/helperFunctions";
import ProductFallbackImg from "../../assets/Fallback Images/product-fallback-medium.svg";
import { colors } from "theme/colors";

const MustTriesItem = (props) => {
  const image = props.store?.shopImage?.filter(
    (x) =>
      x.isActive?.toLowerCase() === "y" &&
      x.imageType?.toLowerCase() === "thumbnail" &&
      (x?.platform?.toLowerCase() === "web" ||
        x?.platform?.toLowerCase() === "marketplace")
  )[0]?.imageURL;

  return (
    <Wrapper number={props.number} onClick={props.onClick}>
      <TerminalAndBackgroundImageWrapper>
        <TerminalWrapper>
          <TerminalTextWrapper>
            <Text type="bold">
              {props.store?.terminal?.value === "Terminal1" ? "T1" : "T2"}
            </Text>
          </TerminalTextWrapper>
        </TerminalWrapper>
        <BackgroundImageWrapper
          src={image}
          onError={(e) => {
            e.target.src = ProductFallbackImg;
          }}
        />
      </TerminalAndBackgroundImageWrapper>
      <StoreNameAndRatingWrapper>
        <StoreNameWrapper>
          <Text type="bold">{props.store?.storeDisplayName}</Text>
        </StoreNameWrapper>
        {/* <RatingWrapper>
          <RatingImage src={Rating} />
          <RatingTextWrapper>
            <Text type="bold">{props.store?.rating?.rating}</Text>
          </RatingTextWrapper>
        </RatingWrapper> */}
      </StoreNameAndRatingWrapper>
      <ShopCategoryTextWrapper>
        <Text>{props.store?.shopCategory.value[0]}</Text>
      </ShopCategoryTextWrapper>
    </Wrapper>
  );
};

const TerminalAndBackgroundImageWrapper = styled.div`
  width: 100%;
  height: 132px;
  position: relative;

  @media ${device.laptop} {
    height: 380px;
  }
`;

const Wrapper = styled.div`
  width: 102px;
  min-width: 102px;

  @media ${device.laptop} {
    width: 268px;
    min-width: 268px;
  }
`;
const TerminalWrapper = styled.div`
  right: 0;
  width: 28px;
  display: flex;
  border-radius: 0px 8px;
  background: ${colors?.text?.black200};
  position: absolute;
  padding: 4px;
  justify-content: space-evenly;
`;

const BackgroundImageWrapper = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

const TerminalTextWrapper = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: #f8cf46;
`;

const RatingWrapper = styled.div({
  display: "flex",
  alignContent: "center",
  alignItems: "center",
  marginTop: "4px",
});

const StoreNameAndRatingWrapper = styled.div`
  width: 100%;
  min-height: 66px;
  max-height: 66px;
`;

const StoreNameWrapper = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-top: 12px;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: ${colors?.text?.black300};
  line-height: 22px;
`;

const RatingTextWrapper = styled.div`
  font-size: 13px;
  font-weight: 700;
  margin-left: 8px;
  line-height: 18px;
  color: ${colors?.text?.black200};
`;
const ShopCategoryTextWrapper = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${colors?.text?.gray300};
  line-height: 16px;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 4px;
`;

const RatingImage = styled.img``;

export default MustTriesItem;
