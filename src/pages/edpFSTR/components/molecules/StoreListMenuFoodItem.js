import {
  useContext,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";
import {
  device,
  formatPrice,
  isValidPrice,
} from "../../../../commons/util/helperFunctions";
import ReadMore from "../../../../components/atoms/readMore";
import Text from "../../../../components/atoms/Text";
import { CartContext } from "../../../../context/cartContext";
import ProductFallbackImg from "../../assets/Fallback Images/product-fallback-medium.svg";
import AddToCartButton from "../organism/AddToCartButton";
import { colors } from "theme/colors";
import { getAppConfig } from "commons/util/appConfigHelper";

const StoreListMenuFoodItem = (props) => {
  const ClientCart = useContext(CartContext);
  const descRef = useRef(null);

  const [itemQty, setItemQty] = useState(1);
  const storeId = props.item.shopId;
  const productId = props.item._id;
  const [isAdded, setIsAdded] = useState(
    ClientCart.isAlreadyAdded({ storeId: props.item.shopId, productId })
  );
  const [showReadMore, setShowReadMore] = useState(false);

  useEffect(() => {
    setItemQty(ClientCart.getItemQunatity({ storeId, productId }));
    setIsAdded(
      ClientCart.isAlreadyAdded({ storeId: props.item.shopId, productId })
    );
  });

  const getProductImage = (imageArray) => {
    if (getAppConfig("SHOW_PRODUCT_IMAGES_V2")) {
      const found = imageArray?.find(
        (x) =>
          x?.type?.toLowerCase() === "regular" &&
          x?.isActive?.toLowerCase() === "y"
      );
      return found?.imageUrl || "";
    } else {
      const found = imageArray?.find(
        (x) =>
          (x.platform?.toLowerCase() === "web" ||
            x.platform?.toLowerCase() === "marketplace") &&
          x?.type?.toLowerCase() === "small" &&
          x?.isActive?.toLowerCase() === "y"
      );
      return found?.imageUrl || "";
    }
  };

  const checkDescriptionOverflow = () => {
    const el = descRef.current;
    if (el) {
      const style = window.getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight);
      const height = el.offsetHeight;
      if (lineHeight && height) {
        const lines = Math.round(height / lineHeight);
        setShowReadMore(lines > 3);
      }
    }
  };

  useLayoutEffect(() => {
    const handleResizeOrScroll = () => {
      requestAnimationFrame(() => {
        checkDescriptionOverflow();
      });
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll);

    handleResizeOrScroll();

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, []);

  useEffect(() => {
    setShowReadMore(false);
    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => {
        checkDescriptionOverflow();
      });
    });

    const node = descRef.current;
    if (node) {
      observer.observe(node, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      requestAnimationFrame(() => checkDescriptionOverflow());
    }

    return () => {
      observer.disconnect();
    };
  }, [props?.item?._id]);

  return (
    <Wrapper style={props.lastItem ? { borderBottom: "none" } : {}}>
      <ContentWrapper>
        <ItemDetailsWrapper
          onClick={() => props.setSelectedItem(productId, props.item)}
        >
          <ItemNameAndCategoryWrapper>
            <ItemTitleTextWrapper>
              <Text type="bold">{props.item.productName}</Text>
            </ItemTitleTextWrapper>
          </ItemNameAndCategoryWrapper>
          <ItemDescriptionWrapper ref={descRef}>
            {showReadMore ? (
              <ReadMore
                className="read-more-read-less"
                lineClamp={3}
                readMoreTextClassName="grand-ancestor-read-more-less-button"
              >
                <Text>
                  {ReactHtmlParser(
                    props.item.description?.longDescription || ""
                  )}
                </Text>
              </ReadMore>
            ) : (
              <Text>
                {ReactHtmlParser(props.item.description?.longDescription || "")}
              </Text>
            )}
          </ItemDescriptionWrapper>
          {props?.item?.discountPct > 0 ? (
            <PriceWithDiscountWrapper>
              <StrikeOutPriceWrapper>
                <Text type="bold">{formatPrice(props.item.strikeout)}</Text>
              </StrikeOutPriceWrapper>
              <ItemPriceTextWrapper>
                <Text type="bold">{formatPrice(props.item.offerPrice)}</Text>
              </ItemPriceTextWrapper>
            </PriceWithDiscountWrapper>
          ) : (
            <ItemPriceTextWrapper>
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
            </ItemPriceTextWrapper>
          )}
        </ItemDetailsWrapper>
        <ItemImageAndAddButtonWrapper>
          <ItemImage
            src={getProductImage(props.item?.productImageUrl)}
            style={
              getProductImage(props.item?.productImageUrl) === ""
                ? { display: "none" }
                : {}
            }
            showV2Image={getAppConfig("SHOW_PRODUCT_IMAGES_V2")}
          />
          <AddToCartButtonContainer>
            <AddToCartButton
              item={props.item}
              storeDetails={props.storeDetails}
              productId={productId}
              product={props.item}
              setSelectedItemId={props.setSelectedItemId}
              setShowDetailModal={props.setShowDetailModal}
              setShowCustomisationModal={props.setShowCustomisationModal}
              setShowRepeatSelectionModal={props.setShowRepeatSelectionModal}
              setRecommendationModal={props.setRecommendationModal}
              setRecommendationList={props.setRecommendationList}
              setShowMultiStoreCheckModal={props?.setShowMultiStoreCheckModal}
              setMultiStoreData={props?.setMultiStoreData}
              ageVerificationReq={props?.item?.ageVerificationRequired}
              setChangeRepeatSelectionItem={props?.setChangeRepeatSelectionItem}
            ></AddToCartButton>
          </AddToCartButtonContainer>
        </ItemImageAndAddButtonWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

const ItemPriceTextWrapper = styled.div`
  margin-top: 12px;
  font-size: 14px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 20px;
  }
`;

const PriceWithDiscountWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const StrikeOutPriceWrapper = styled.div`
  margin-top: 12px;
  font-size: 14px;
  color: ${colors?.text?.black200};
  text-decoration: line-through;
  opacity: 0.7;

  @media ${device.laptop} {
    font-size: 20px;
  }
`;
const ItemImage = styled.img`
  width: 141px;
  height: 93px;
  border-radius: ${({ showV2Image }) => (showV2Image ? "12px" : "5px")};
  object-fit: contain;
`;

const ItemImageAndAddButtonWrapper = styled.div({
  alignSelf: "flex-start",
  position: "relative",
  paddingTop: "5px",
  width: "141px",
});

const ItemDescriptionWrapper = styled.div`
  font-size: 10px;
  margin-top: 6px;
  color: ${colors?.text?.gray200};

  @media ${device.laptop} {
    font-size: 14px;
  }
`;

const ItemTitleTextWrapper = styled.div`
  font-size: 14px;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${colors?.text?.black200};
  position: relative;

  @media ${device.laptop} {
    font-size: 18px;
  }
`;

const MenuItemTypeImage = styled.img`
  width: 12px;
  height: 12px;

  @media ${device.laptop} {
    width: 16px;
    height: 16px;
  }
`;

const ItemNameAndCategoryWrapper = styled.div({
  display: "flex",
  alignItems: "center",
});

const ItemDetailsWrapper = styled.div`
  width: calc(100% - 170px);
  margin-right: 24px;
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 24px 0px;
  border-bottom: 1px solid var(--border-primary);
`;

const MarginWrapper = styled.div`
  display: block;
  border: 2px solid rgba(223, 223, 226, 0.3);
  margin: 24px 0px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const AddToCartButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;
const PrepTimeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0px 2px;
  margin-top: 4px;
`;
const PrepTimeIcon = styled.img`
  width: 18px;
  height: 18px;
`;
const PrepTimeText = styled.div`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: normal;
`;

export default StoreListMenuFoodItem;
