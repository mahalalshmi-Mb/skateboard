import { useContext, useEffect, useRef, useState } from "react";
import { isDesktop } from "react-device-detect";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";
import callAPI from "../../../../commons/callAPI";
import config from "../../../../commons/config";
import { getAppConfig } from "../../../../commons/util/appConfigHelper";
import { device, formatPrice } from "../../../../commons/util/helperFunctions";
import Util from "../../../../commons/util/util";
import Text from "../../../../components/atoms/Text";
import Loader from "../../../../components/atoms/loader";
import PushAlert from "../../../../components/atoms/pushAlert";
import BottomDrawer from "../../../../components/molecules/BottomDrawer/BottomDrawer";
import CustomModal from "../../../../containers/customModal/customModal";
import { NavContext } from "../../../../context/navContext";
import CancelBlack from "../../assets/CancelBlack.svg";
import ETA from "../../assets/ETABlack.svg";
import ProductFallbackImg from "../../assets/Fallback Images/product-fallback-large.svg";
import { DietCategoryIcon } from "../../pages/config/config";
import AddToCartButton from "./AddToCartButton";
import { colors } from "theme/colors";

const ItemDetailModal = (props) => {
  const useNav = useContext(NavContext);
  const sheetRef = useRef();

  const [isLoading, setIsLoading] = useState(true);
  const [itemDetails, setItemDetails] = useState({});
  const [image, setImage] = useState("");

  const closeModal = () => {
    document.body.style.overflow = "auto";
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    props.setIsDrawerOpen(false);
  };

  useEffect(() => {
    useNav.hideAllNavs();

    return () => {
      if (props.isDineIn) {
        useNav.setShowDineInBottomTab(true);
        useNav.hideAllNavs();
      } else {
        useNav.setShowHeaderNav(true);
        useNav.setShowBottomNav(true);
        useNav.setShowFeedback(true);
        useNav.setShowFooter(true);

        if (props.reRender) {
          props.isReRender();
        }
      }
    };
  }, []);

  useEffect(() => {
    getProductDetails();
  }, []);

  useEffect(() => {
    if (itemDetails && Object.keys(itemDetails).length > 0) {
      Util.sendMessageToReactNative("product_viewed", itemDetails);
      Util.triggerMoEngageEvent("product_viewed", itemDetails, {
        trigger_modal: "item_detail",
      });
    }
  }, [itemDetails]);

  const getProductDetails = async () => {
    try {
      let productDetailResponse = await callAPI.post(
        config.api.products.productDetails,
        {
          itemId: props.selectedItemId,
          rule_id: [],
          tags: "",
          subCategory: "",
          bookingSource: getAppConfig("CALL_PROMO_API")
            ? Util.getBookingSource()
            : "",
        }
      );
      let regProductDetailResponse = await productDetailResponse.json();
      if (regProductDetailResponse.status === 200) {
        const details = regProductDetailResponse.data.pDetails;
        const recommendationList =
          regProductDetailResponse.data.recommendation || [];
        setImage(
          details?.productImageUrl?.filter(
            (x) =>
              (x.platform?.toLowerCase() === "web" ||
                x.platform?.toLowerCase() === "marketplace") &&
              x.type === "Large"
          )[0]?.imageUrl
        );
        if (props.selectedItem.pVariables) {
          details.pVariables = props.selectedItem.pVariables;
        }
        setItemDetails(details);
        setIsLoading(false);
        props.setRecommendationList(recommendationList);
      } else {
        PushAlert.error("Something went wrong. Please try again later.");
        closeModal();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getProductImage = () => {
    if (getAppConfig("SHOW_PRODUCT_IMAGES_V2")) {
      const found = itemDetails?.productImageUrl?.find(
        (x) =>
          (x?.type?.toLowerCase() || x?.imageType?.toLowerCase()) ===
            "regular" && x?.isActive?.toLowerCase() === "y"
      );
      if (found) {
        return found.imageUrl || found.imageURL || "";
      } else {
        return "";
      }
    } else {
      const found = itemDetails?.productImageUrl?.find(
        (x) =>
          (x?.platform?.toLowerCase() === "web" ||
            x?.platform?.toLowerCase() === "marketplace") &&
          (x?.type?.toLowerCase() || x?.imageType?.toLowerCase()) === "small" &&
          x?.isActive?.toLowerCase() === "y"
      );
      if (found) {
        return found.imageUrl || found.imageURL || "";
      } else {
        return "";
      }
    }
  };

  const renderContent = () => {
    return (
      <Wrapper>
        <ContentWrapper>
          <CancelButtonWrapper>
            <CancelImageButton onClick={() => closeModal()} src={CancelBlack} />
          </CancelButtonWrapper>
          <ContentContainer>
            {getProductImage() !== "" && (
              <BannerImageWrapper
                showV2Image={getAppConfig("SHOW_PRODUCT_IMAGES_V2")}
              >
                <BannerImage
                  src={getProductImage()}
                  onError={(e) => {
                    e.target.src = ProductFallbackImg;
                  }}
                  showV2Image={getAppConfig("SHOW_PRODUCT_IMAGES_V2")}
                />
              </BannerImageWrapper>
            )}

            <MetaDataContainer>
              <ShopDetailWrapper>
                <ShopNameWrapper>
                  <Text>{itemDetails?.shopName}</Text>
                </ShopNameWrapper>
              </ShopDetailWrapper>
              <ItemDetailWrapper>
                <ItemNameWrapper>
                  <Text type="bold">
                    {itemDetails?.title || itemDetails?.productName}
                  </Text>
                </ItemNameWrapper>
              </ItemDetailWrapper>
            </MetaDataContainer>
          </ContentContainer>
          <ItemDescriptionWrapper>
            <Text>
              {ReactHtmlParser(itemDetails?.description?.longDescription || "")}
            </Text>
          </ItemDescriptionWrapper>
        </ContentWrapper>
        <ModalFooterWrapper>
          <TotalPriceAndAddButtonWrapper>
            {itemDetails?.discountPct > 0 ? (
              <PriceWithDiscountWrapper>
                <StrikeOutPriceWrapper>
                  <Text type="bold">{formatPrice(itemDetails?.strikeout)}</Text>
                </StrikeOutPriceWrapper>
                <TotalPriceWrapper>
                  <Text type="bold">
                    {formatPrice(itemDetails?.offerPrice)}
                  </Text>
                </TotalPriceWrapper>
              </PriceWithDiscountWrapper>
            ) : (
              <TotalPriceWrapper>
                <Text type="bold">{formatPrice(itemDetails?.price)}</Text>
              </TotalPriceWrapper>
            )}
            <AddToCartButtonWrapper>
              <AddToCartButton
                addButtonStyle={{ marginTop: "0px" }}
                buttonWidth="114px"
                item={itemDetails}
                productId={itemDetails._id}
                product={itemDetails}
                reRender={props.reRender}
                setShowDetailModal={props.setShowDetailModal}
                setSelectedItemId={props.setSelectedItemId}
                setShowCustomisationModal={props.setShowCustomisationModal}
                setShowRepeatSelectionModal={props.setShowRepeatSelectionModal}
                setIsDrawerOpen={props.setIsDrawerOpen}
                setRecommendationModal={props.setRecommendationModal}
                setShowMultiStoreCheckModal={props.setShowMultiStoreCheckModal}
                setMultiStoreData={props?.setMultiStoreData}
                ageVerificationReq={itemDetails?.ageVerificationRequired}
              ></AddToCartButton>
            </AddToCartButtonWrapper>
          </TotalPriceAndAddButtonWrapper>
        </ModalFooterWrapper>
      </Wrapper>
    );
  };

  if (isDesktop) {
    return (
      <CustomModal
        isOpen={props.isDrawerOpen}
        boxStyle={{
          height: "90%",
          minHeight: "90%",
          maxWidth: "570px",
          backgroundColor: "#F4F5F5",
        }}
      >
        {isLoading ? (
          <LoaderWrapper>
            <Loader />
            <CancelButtonWrapper>
              <CancelImageButton
                onClick={() => closeModal()}
                src={CancelBlack}
              />
            </CancelButtonWrapper>
          </LoaderWrapper>
        ) : (
          <ModalContainer>
            <ModalContentContainer>{renderContent()}</ModalContentContainer>
          </ModalContainer>
        )}
      </CustomModal>
    );
  } else {
    return (
      <BottomDrawer
        sheetRef={sheetRef}
        isOpen={props.isDrawerOpen}
        setIsOpen={props.setIsDrawerOpen}
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F4F4F5",
          borderRadius: "8px 8px 0px 0px",
          height: "500px",
          maxHeight: "500px",
        }}
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag
        hideHeader={true}
        hideCloseIcon={true}
        handleClose={closeModal}
      >
        {isLoading ? (
          <LoaderWrapper>
            <Loader />
            <CancelButtonWrapper>
              <CancelImageButton
                onClick={() => closeModal()}
                src={CancelBlack}
              />
            </CancelButtonWrapper>
          </LoaderWrapper>
        ) : (
          <DrawerContainer>{renderContent()}</DrawerContainer>
        )}
      </BottomDrawer>
    );
  }
};

const ETAIcon = styled.img`
  width: 17px;
  height: 11px;
`;
const TotalPriceWrapper = styled.div`
  font-weight: 800;
  font-size: 18px;
  display: flex;
  align-items: center;
  line-height: 22px;
  color: ${colors?.text?.black200};
`;

const PriceWithDiscountWrapper = styled.div`
  display: flex;
  gap: 10px;
`;
const StrikeOutPriceWrapper = styled.div`
  font-weight: 800;
  font-size: 18px;
  display: flex;
  align-items: center;
  line-height: 21px;
  color: ${colors?.text?.black200};
  text-decoration: line-through;
  opacity: 0.7;
`;

const TotalPriceAndAddButtonWrapper = styled.div({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
});

const ItemDescriptionWrapper = styled.div`
  margin: 24px 0px 0px 0px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${colors?.text?.black900};
`;
const PrepTimeWrapper = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${colors?.text?.black900};
  margin-left: 4px;
  line-height: 18px;
`;

const ETAWrapper = styled.div({
  display: "flex",
  background: "rgba(4, 173, 170, 0.2)",
  borderRadius: "22.5px",
  width: "fit-content",
  padding: "2px 8px",
  marginTop: "13px",
  alignItems: "center",
});

const ItemNameWrapper = styled.div`
  font-weight: 700;
  font-size: 26px;
  line-height: 31px;
  overflow: hidden;
  color: ${colors?.text?.black200};
  word-break: break-word;

  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }
`;

const ItemCategoryWrapper = styled.img({
  width: "16px",
  height: "16px",
  marginLeft: "13px",
});

const ItemDetailWrapper = styled.div({
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
});
const ShopNameWrapper = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-left: 6px;
  line-height: 16px;
  letter-spacing: 0.1em;
  color: ${colors?.text?.black200};
`;

const ShopImageWrapper = styled.img({
  width: "16px",
  height: "16px",
});

const ShopDetailWrapper = styled.div({
  display: "flex",
  alignItems: "center",
  marginTop: "26px",
});

const CancelButtonWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 36px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CancelImageButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  z-index: 99;
`;
const BannerImage = styled.img`
  width: ${({ showV2Image }) => (showV2Image ? "141px" : "146px")};
  height: ${({ showV2Image }) => (showV2Image ? "93px" : "146px")};
  object-fit: contain;
  border-radius: ${({ showV2Image }) => (showV2Image ? "12px" : "0px")};
`;

const BannerImageWrapper = styled.div`
  width: ${({ showV2Image }) => (showV2Image ? "141px" : "146px")};
  height: ${({ showV2Image }) => (showV2Image ? "93px" : "146px")};
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: calc(100% - 77px);
  max-height: calc(100% - 77px);
  overflow-y: scroll;
  padding-bottom: 85px;
  scrollbar-width: none;
  padding: 24px;
  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }
`;

const Wrapper = styled.div({
  width: "100%",
  height: "100%",
  position: "relative",
});
const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 24px;
`;
const MetaDataContainer = styled.div``;
const AddToCartButtonWrapper = styled.div`
  width: 114px;
  height: 45px;
`;

const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ModalFooterWrapper = styled.div`
  width: 100%;
  height: 77px;
  padding: 0px 24px;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0px;
  background-color: #ffffff;
  box-shadow: 0px 1px 12px rgba(5, 32, 61, 0.05);

  @media ${device.laptop} {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }
`;
const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const ModalContentContainer = styled.div`
  width: 100%;
  height: 100%;
`;
const DrawerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
export default ItemDetailModal;
