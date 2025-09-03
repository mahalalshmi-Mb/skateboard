import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import RectangularImage from "../atoms/RectangularImage";
import Text from "../../../../components/atoms/Text";
import AddToCartButton from "../../components/organism/AddToCartButton";
import { formatPrice } from "../../../../commons/util/helperFunctions";
import { getSessionStorage } from "../../../../util/storageUtil";
import DisclaimerPrompt from "../organisms/DisclaimerPrompt";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import { triggerProductViewed } from "../../../../util/analytics/cdp/DutyFree";
import { colors } from "theme/colors";

function ProductCard(props) {
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();
  const [showAgeVerificationPrompt, setShowAgeVerificationPrompt] =
    useState(false);
  const handleCardClick = (e) => {
    if (props.setSelectedItemId) {
      props.setSelectedItemId(props.productId);
    }
    if (props.ageVerificationReq && !getSessionStorage("isAgeDeclared")) {
      setShowAgeVerificationPrompt(true);
    } else {
      if (props.handleAction) {
        props.handleAction();
      } else {
        triggerProductViewed(props);
        const itemDetails = `${props?.product?.productName?.replaceAll(
          " ",
          "-"
        )}-${props?.product?.productCategory?.categoryName?.replaceAll(
          " ",
          "-"
        )}-${props?.product?._id}`;
        const redirectLink = `/product/info/${itemDetails}?itemId=${props.productId}`;
        pushHistory(redirectLink);
      }
    }
  };

  const getItemSize = () => {
    const found = props?.attributeList?.find(
      (x) => x?.attributeName?.toLowerCase() === "size"
    );
    if (found) {
      return found?.attributeValues?.[0]?.attributeValue || "";
    } else {
      return "";
    }
  };

  return (
    <>
      <Wrapper style={props.wrapperStyle}>
        <CardContainer onClick={(e) => handleCardClick(e)}>
          <CardImageWrapper style={props.imageContainerStyle}>
            <RectangularImage
              image={props.image}
              imageText={props.imageText}
              imageStyle={props.imageStyle}
              wrapperStyle={props.imageWrapperStyle}
            />
            {props?.product?.offers?.[0]?.description &&
              props?.product?.offers?.[0]?.description !== "" &&
              props.showDiscount && (
                <ItemDiscountWrapper>
                  <Text type="bold">
                    {props?.product?.offers?.[0]?.description}
                  </Text>
                </ItemDiscountWrapper>
              )}
          </CardImageWrapper>
          <ContentContainer>
            <MetaDataWrapper>
              <Title>
                <Text type="bold">{props.subTitle}</Text>
              </Title>
              <SubTitle>
                <Text>
                  {`${props.title}${
                    getItemSize() !== "" ? `, ${getItemSize()}` : ``
                  }`}
                </Text>
              </SubTitle>
            </MetaDataWrapper>
            <PriceWrapper>
              {props.discountPct > 0 && (
                <DiscountedPrice>
                  <Text type="extra-bold">{formatPrice(props.strikeout)}</Text>
                </DiscountedPrice>
              )}
              {props.discountPct > 0 ? (
                <Price>
                  <Text type="extra-bold">{formatPrice(props.offerPrice)}</Text>
                </Price>
              ) : (
                <Price>
                  <Text type="extra-bold">{formatPrice(props.price)}</Text>
                </Price>
              )}
            </PriceWrapper>
          </ContentContainer>
        </CardContainer>
        <AddButtonContainer>
          <AddToCartButton
            addButtonStyle={{
              height: "40px",
              backgroundColor: "#fff",
              marginTop: "11px",
            }}
            item={props.item}
            productId={props.productId}
            product={props.product}
            setSelectedItemId={props.setSelectedItemId}
            setShowDetailModal={props.setShowDetailModal}
            setShowCustomisationModal={props.setShowCustomisationModal}
            setShowRepeatSelectionModal={props.setShowRepeatSelectionModal}
            ageVerificationReq={props.ageVerificationReq}
            doNotUpdateId={props.doNotUpdateId}
            setRecommendationModal={props?.setRecommendationModal}
          ></AddToCartButton>
        </AddButtonContainer>
      </Wrapper>
      {showAgeVerificationPrompt && (
        <DisclaimerPrompt
          isDrawerOpen={showAgeVerificationPrompt}
          setIsDrawerOpen={setShowAgeVerificationPrompt}
          successHandler={handleCardClick}
        ></DisclaimerPrompt>
      )}
    </>
  );
}

const Wrapper = styled.div`
  width: 160px;
  min-width: 160px;
`;
const CardImageWrapper = styled.div`
  position: relative;
`;
const ItemDiscountWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;

  display: inline-flex;
  padding: 4px 8px;
  gap: 6px;
  border-radius: 2px;
  background: #f8cf46;

  color: ${colors?.text?.black200};
  font-size: 10px;
`;
const CardContainer = styled.div`
  width: 100%;
`;
const ContentContainer = styled.div`
  width: 100%;
  padding-top: 12px;
`;
const MetaDataWrapper = styled.div`
  width: 100%;
  min-height: 63px;
  max-height: 63px;
`;
const Title = styled.div`
  color: ${colors?.text?.black200};
  font-size: 14px;
  font-weight: 700;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const SubTitle = styled.div`
  color: ${colors?.text?.black200};
  font-size: 12px;
  font-weight: 400;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 4px;
  min-height: 44px;
`;
const Price = styled.div`
  color: ${colors?.text?.black200};
  font-size: 14px;
  font-weight: 800;
`;
const DiscountedPrice = styled.div`
  color: ${colors?.text?.black200};
  font-size: 12px;
  font-weight: 400;
  text-decoration-line: line-through;
  opacity: 0.6;
  padding-right: 7px;
`;
const Discount = styled.div`
  color: #db1e49;
  font-size: 12px;
  font-weight: 700;
  opacity: 0.6;
  padding-left: 3px;
`;
const AddButtonContainer = styled.div`
  width: 100%;
`;
export default ProductCard;
