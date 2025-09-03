import styled from "styled-components";
import {
  device,
  formatPrice,
  isMobileDevice,
  isValidPrice,
} from "../../../../commons/util/helperFunctions";
import Text from "../../../../components/atoms/Text";
import ProductFallbackImg from "../../assets/Fallback Images/product-fallback-small.svg";
import AddToCartButton from "../organism/AddToCartButton";
import PrepTimeImage from "../../assets/ETABlack.svg";
import { colors } from "theme/colors";

const MenuItem = (props) => {
  const image =
    props.item?.productImageUrl?.filter(
      (x) =>
        (x.platform?.toLowerCase() === "web" ||
          x.platform?.toLowerCase() === "marketplace") &&
        x.type === "Thumbnail"
    )[0]?.imageUrl || "";

  return (
    <Wrapper index={props.index} onClick={props.setSelectedItem}>
      <FoodETAImageWrapper>
        <MenuItemImage
          src={
            image !== undefined
              ? image
              : props.item?.productImageUrl[0]?.imageUrl
          }
          onError={(e) => {
            e.target.src = ProductFallbackImg;
          }}
        />
      </FoodETAImageWrapper>
      <MenuItemContentWrapper>
        {/* {props?.item?.dietCategory !== "" && (
          <MenuItemTypeImage
            src={
              props.item?.dietCategory === "Veg"
                ? DietCategoryIcon.veg
                : DietCategoryIcon.nonVeg
            }
          />
        )} */}
        <ShopDetailsWrapper>
          <ShopNameWrapper>
            <Text>{props.item?.shopName}</Text>
          </ShopNameWrapper>
        </ShopDetailsWrapper>
        <TitleAndPriceWrapper>
          <MenuItemNameWrapper>
            <Text type="bold">{props.item?.productName}</Text>
          </MenuItemNameWrapper>
          {props?.item?.discountPct > 0 ? (
            <PriceWithDiscountWrapper>
              <StrikeOutPriceWrapper>
                <Text type="bold">{formatPrice(props?.item?.strikeout)}</Text>
              </StrikeOutPriceWrapper>
              <PriceWrapper>
                <Text type="bold">{formatPrice(props?.item?.offerPrice)}</Text>
              </PriceWrapper>
            </PriceWithDiscountWrapper>
          ) : (
            <PriceWrapper>
              <Text type="bold">
                {props?.item?.itemWithPreference &&
                isValidPrice(props.item?.priceRange?.minPrice) &&
                isValidPrice(props.item?.priceRange?.maxPrice) &&
                props.item?.priceRange?.minPrice !==
                  props.item?.priceRange?.maxPrice
                  ? `${formatPrice(
                      props.item?.priceRange?.minPrice
                    )} - ${formatPrice(props.item?.priceRange?.maxPrice)}`
                  : formatPrice(props?.item?.price)}
              </Text>
            </PriceWrapper>
          )}
        </TitleAndPriceWrapper>
        <AddButtonContainer>
          <AddToCartButton
            addButtonStyle={{
              height: "40px",
              width: isMobileDevice() ? "100%" : "auto",
            }}
            item={props.item}
            productId={props.productId}
            product={props.product}
            setSelectedItemId={props.setSelectedItemId}
            setShowDetailModal={props.setShowDetailModal}
            setShowCustomisationModal={props.setShowCustomisationModal}
            setShowRepeatSelectionModal={props.setShowRepeatSelectionModal}
            setChangeRepeatSelectionItem={props.setChangeRepeatSelectionItem}
            ageVerificationReq={props.ageVerificationReq}
            isReRender={props?.isReRender}
            reRender={props?.reRender}
            setRecommendationModal={props?.setRecommendationModal}
            setRecommendationList={props?.setRecommendationList}
            setShowMultiStoreCheckModal={props?.setShowMultiStoreCheckModal}
            setIsRecommendation={props?.setIsRecommendation}
          ></AddToCartButton>
        </AddButtonContainer>
      </MenuItemContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 160px;
  height: 300px;
  min-width: 160px;
  min-height: 300px;
  margin-right: 8px;
  padding-bottom: 40px;
  cursor: pointer;
  position: relative;
  background: #ffffff;
  border-radius: 12px;

  @media ${device.tablet} {
    width: 300px;
    min-width: 300px;
    height: 280px;
    min-height: 280px;
    margin-right: 0px;
  }

  @media ${device.laptop} {
    width: 300px;
    min-width: 300px;
    height: 340px;
    min-height: 340px;
    margin-right: 0px;
    transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);

    &:hover {
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-5px);
    }
  }
`;

const FoodETAImageWrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
`;
const MenuItemContentWrapper = styled.div`
  filter: drop-shadow(-4px 4px 30px rgba(0, 0, 0, 0.05));
  border-radius: 0px 0px 8px 8px;
  padding: 8px 16px 12px 16px;
  min-height: 174px;
  border-radius: 0px 0px 12px 12px;
  position: relative;

  @media ${device.laptop}, ${device.tablet} {
    padding: 12px 16px 16px 16px;
    min-height: 150px;
  }
`;

const MenuItemImage = styled.img`
  height: 95px;
  width: -webkit-fill-available;
  border-radius: 6px;
  background-color: #fff;
  object-fit: contain;
  margin: 12px;

  @media ${device.laptop} {
    height: 162px;
    transition: transform 0.5s ease;

    &:hover {
      transform: scale(1.02);
    }
  }
`;

const TitleAndPriceWrapper = styled.div`
  width: 100%;
  min-height: 69px;
  max-height: 69px;
`;

const MenuItemNameWrapper = styled.div`
  font-weight: 700;
  font-size: 14px;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: ${colors?.text?.actionTextColor};
  padding-top: 8px;

  @media ${device.laptop} {
    font-size: 16px;
  }
`;

const MenuItemTypeImage = styled.img`
  width: 12px;
  height: 12px;
`;

const PriceWrapper = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${colors?.text?.black300};
  margin-top: 4px;
`;

const PriceWithDiscountWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const StrikeOutPriceWrapper = styled.div`
  font-weight: 700;
  font-size: 13px;
  color: ${colors?.text?.black300};
  margin-top: 4px;
  text-decoration: line-through;
  opacity: 0.7;
`;

const ShopDetailsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 6px;
  min-height: 32px;
  max-height: 32px;
`;

const ShopImage = styled.img`
  width: 18px;
  height: 18px;
`;

const ShopNameWrapper = styled.div`
  font-weight: 500;
  font-size: 12px;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: 0.1em;
  color: ${colors?.text?.gray800};
`;
const AddButtonContainer = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  bottom: 8px;
  right: 0px;
  padding: 0px 12px;

  @media ${device.laptop}, ${device.tablet} {
    width: auto;
    font-size: 16px;
    right: 0;
    padding: 0px 16px;
  }
`;
const DescWrapper = styled.div`
  width: 100%;
  font-size: 12px;
  color: ${colors?.text?.black200};
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 8px;
`;
const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
`;
const PrepTimeIcon = styled.img``;
const PrepTimeText = styled.div`
  font-size: 12px;
  color: ${colors?.text?.black200};
  margin-top: 8px;
`;

export default MenuItem;
