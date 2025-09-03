import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Loader from "../../../../components/atoms/loader";
import Text from "../../../../components/atoms/Text";
import { NavContext } from "../../../../context/navContext";

import callAPI from "../../../../commons/callAPI";
import config from "../../../../commons/config";
import PushAlert from "../../../../components/atoms/pushAlert";
import ReadMore from "../../../../components/atoms/readMore";
import { CartContext } from "../../../../context/cartContext";
import ProductCard from "../../productComponents/molecules/ProductCard";
import HorzScrollContainer from "../../productComponents/organisms/HorzScrollContainer";
import "./ProductDetails.css";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import Slider from "react-slick";
import AllowanceDocArr from "../../../../assets/files/Duty_Free_Allowances_Arrival.pdf";
import AllowanceDocDep from "../../../../assets/files/Duty_Free_Allowances_Departure.pdf";
import { formatPrice } from "../../../../commons/util/helperFunctions";
import { getSessionStorage } from "../../../../util/storageUtil";
import AddToCartButton from "../../components/organism/AddToCartButton";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ProductDetails = (props) => {
  let query = useQuery();
  const useNav = useContext(NavContext);

  const [isLoading, setIsLoading] = useState(true);

  const getQueryParams = () => {
    let paramObj = {};
    for (var value of query.keys()) {
      paramObj[value] = query.get(value);
    }
    return paramObj;
  };

  const ClientCart = useContext(CartContext);
  const refItemQuantity =
    props.location.state && props.location.state.itemQty
      ? +props.location.state.itemQty
      : 1;

  let data = getSessionStorage("productsData");
  const [queryParams, setQueryParams] = useState(getQueryParams());
  const [itemId, setItemId] = useState(queryParams?.itemId);
  const [storecode] = useState(props.storecode);
  const [details, setDetails] = useState({});
  const [masterVariant, setMasterVariant] = useState({});
  const [defaults, setDefaults] = useState({});
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [isAdded, setIsAdded] = useState(false);
  const [counterValue, setCounterValue] = useState(refItemQuantity);
  const [spaceBetween, setSpaceBetween] = useState(null);
  const [addOnes, setAddOnes] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [additionalDetails, setAdditionalDetails] = useState([]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCustomisationModal, setShowCustomisationModal] = useState(false);
  const [showRepeatSelectionModal, setShowRepeatSelectionModal] =
    useState(false);
  const [selectedItemId, setSelectedItemId] = useState(queryParams?.itemId);
  const [selectedTab, setSelectedTab] = useState(0);
  const [rerender, setRerender] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    useNav.hideFooterNavs();
    useNav.showHeaderNavs();
    useNav.hideBottomNavs();
    useNav.showHeaderGoBack();

    return () => {
      useNav.showHeaderNavs();
      useNav.showFooterNavs();
      useNav.showBottomNavs();
      useNav.hideHeaderGoBack();
    };
  }, []);

  useEffect(() => {
    let cart = ClientCart.getCart();
    let updatedAddOns = addOnes;
    if (isAdded) {
      cart[storecode].items.forEach((x) => {
        if (x.itemId === itemId) {
          setCounterValue(x.itemQuantity);
          if (x.addOn.length > 0) {
            x.addOn.forEach((y) => {
              updatedAddOns.forEach((z) => {
                if (y.addonId === z.addonId) {
                  z.quantity = y.quantity;
                }
              });
            });
            setAddOnes([...updatedAddOns]);
          }
        }
      });
    }
  }, [isAdded]);

  useEffect(() => {
    async function getProductDetails() {
      let ruleId = [];

      try {
        let response = await callAPI.post(config.api.products.productDetails, {
          itemId: itemId,
          rule_id: ruleId,
        });
        let regResponse = await response.json();
        if (regResponse.status === 200) {
          let readOnlyAttrs = [];
          if (regResponse?.data?.masterVariants?.productVariants) {
            regResponse.data.masterVariants.productVariants =
              regResponse?.data?.masterVariants?.productVariants?.filter(
                (f) => f.isChoice === true
              );
          }
          readOnlyAttrs = regResponse?.data?.pDetails?.attributeList?.filter(
            (f) => f.isChoice === false
          );
          setAdditionalDetails(readOnlyAttrs);
          let ds = {};
          if (regResponse?.data?.pDetails?.attributeList) {
            regResponse.data.pDetails.attributeList =
              regResponse?.data?.pDetails?.attributeList?.filter(
                (f) => f.isChoice === true
              );

            regResponse?.data?.pDetails?.attributeList?.forEach((x) => {
              let arr = [];
              arr.push(x?.attributeValues[0]?.attributeValue);
              ds[x.attributeName] = arr;
            });
          }

          setDefaults(ds);
          setSelectedAttributes(ds);
          setSpaceBetween(
            regResponse?.data?.pDetails?.productImageUrl?.length > 1
              ? -40
              : null
          );
          setDetails(regResponse?.data?.pDetails);
          setMasterVariant(regResponse?.data?.masterVariants);
          setRecommendations(regResponse?.data?.recommendation);
          if (regResponse?.data?.pDetails?.addons) {
            regResponse?.data?.pDetails?.addons?.forEach(function (element) {
              element.quantity = 0;
            });
            setAddOnes(regResponse?.data?.pDetails?.addons);
            window.scrollTo(0, 0);
          } else setAddOnes([]);
          setIsLoading(false);

          let selectedAddOns = [];
          addOnes.forEach((x) => {
            if (x.quantity > 0) {
              selectedAddOns.push(x);
            }
          });

          setIsAdded(
            ClientCart.hasItem({
              storecode: props.storecode,
              productId: regResponse?.data?.pDetails?._id,
              addOn: regResponse?.data?.pDetails?.addons,
            })
          );
          // }
        }
      } catch (e) {
        PushAlert.error(`Oops!!! Item doesn't exist in records...`);
        console.log(e);
      }
    }

    itemId && getProductDetails();
  }, [storecode, itemId, rerender]);

  const getProductImage = () => {
    const image = details?.productImageUrl?.filter(
      (x) =>
        (x.platform?.toLowerCase() === "web" ||
          x.platform?.toLowerCase() === "marketplace") &&
        x.type === "Large"
    );
    return image;
  };

  const getImage = (imageArr, type) => {
    const image = imageArr?.filter(
      (x) =>
        (x.platform?.toLowerCase() === "web" ||
          x.platform?.toLowerCase() === "marketplace") &&
        x.type === type
    )[0]?.imageUrl;
    return image;
  };

  const handleAttributeSelection = async (type, valueItem) => {
    try {
      let ds = { ...selectedAttributes };
      let arr = [];
      if (ds[type]) {
        arr = ds[type];
      }
      arr[0] = valueItem.attributeValue;
      ds[type] = arr;
      setSelectedAttributes(ds);

      let ancestorArray = [];
      if (props?.data?.masterVariants) {
        ancestorArray.push(props?.data?.masterVariants?._id);
      }
      let apiURL = config.api.products.getProductId;
      let reqBody = {
        shopId: details.shopId,
        productId: itemId,
        ancestorsId: masterVariant?._id,
        attributes: getAttributes(ds),
      };

      const response = await callAPI.post(apiURL, reqBody);
      let regResponse = await response.json();

      if (
        !(
          void 0 === regResponse ||
          void 0 === regResponse.data ||
          void 0 === regResponse.data.productId ||
          "" === regResponse.data.productId ||
          " " === regResponse.data.productId
        )
      ) {
        if (itemId !== regResponse.data.productId) {
          setItemId(regResponse.data.productId);
          setRerender(!rerender);
        }
      } else {
        //insertAlertHere
        console.log("Item Variant not available...");
      }
    } catch (err) {
      //insertAlertHere
      console.log(err);
    }
  };

  function getAttributes(ds) {
    let arr = [];
    Object.keys(ds).map((key) => arr.push({ type: key, value: ds[key] }));
    return arr;
  }

  if (!isLoading) {
    return (
      <Wrapper className="product-details-page-container">
        <ImageCarouselContainer>
          <Slider settings={settings}>
            {getProductImage()?.map((item, index) => (
              <ImageContainer style={props.wrapperStyle} key={index}>
                <Image src={item.imageUrl} alt="promotion" />
              </ImageContainer>
            ))}
          </Slider>
        </ImageCarouselContainer>
        <ContentContainer>
          <ProductName>
            <Text type="bold">
              {details?.title || details?.productName || ""}
            </Text>
          </ProductName>
          <ProductPriceDetails>
            {details?.discountPct > 0 ? (
              <OriginalPrice>
                <Text>
                  Original Price : {formatPrice(details?.strikeout) || ""}
                </Text>
              </OriginalPrice>
            ) : (
              <OriginalPrice>
                <Text>
                  Original Price : {formatPrice(details?.price) || ""}
                </Text>
              </OriginalPrice>
            )}
            <ProductPricingWrapper>
              {details?.discountPct > 0 ? (
                <ProductDiscountedPrice>
                  <Text>{formatPrice(details?.strikeout)}</Text>
                </ProductDiscountedPrice>
              ) : null}
              {details?.discountPct > 0 ? (
                <ProductPrice>
                  <Text type="extra-bold">
                    {formatPrice(details?.offerPrice) || ""}
                  </Text>
                </ProductPrice>
              ) : (
                <ProductPrice>
                  <Text type="extra-bold">
                    {formatPrice(details?.price) || ""}
                  </Text>
                </ProductPrice>
              )}
              {details?.offers?.[0]?.description &&
              details?.offers?.[0]?.description !== "" ? (
                <ProductDiscount>
                  <Text type="extra-bold">
                    {details?.offers?.[0]?.description}
                  </Text>
                </ProductDiscount>
              ) : null}
            </ProductPricingWrapper>
          </ProductPriceDetails>
          {masterVariant?.productVariants?.length > 0 && (
            <HorizontalLineDivider />
          )}
          {masterVariant?.productVariants?.length > 0 &&
            masterVariant?.productVariants?.map((variant, index) => (
              <QuantitySelectionContainer key={index}>
                <SectionTitle>
                  <Text
                    type="bold"
                    style={{ textTransform: "capitalize" }}
                  >{`Select ${variant.attributeName}`}</Text>
                </SectionTitle>
                <QuantitySelectionWrapper>
                  <HorzScrollContainer style={{ gap: "8px" }}>
                    {variant.attributeValues.map((attr, attrIndex) => (
                      <QuantityCard
                        key={attrIndex}
                        selected={defaults[variant.attributeName]?.includes(
                          attr?.attributeValue
                        )}
                        onClick={() =>
                          handleAttributeSelection(variant.attributeName, attr)
                        }
                      >
                        <Text>{attr?.attributeValue}</Text>
                      </QuantityCard>
                    ))}
                  </HorzScrollContainer>
                </QuantitySelectionWrapper>
              </QuantitySelectionContainer>
            ))}
          <HorizontalLineDivider />
          <AllowanceContainer>
            <AllowanceText>
              <Text>
                To see Duty Free allowances for countries you may be visiting
                <a
                  href={
                    data?.movementType === "Departure"
                      ? AllowanceDocDep
                      : AllowanceDocArr
                  }
                  download="AllowanceDocument"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontFamily: "ManropeBold", color: "#04adaa" }}
                >
                  {` click here`}
                </a>
              </Text>
            </AllowanceText>
          </AllowanceContainer>
          <HorizontalLineDivider />
          <FeaturesContainer>
            <HorzScrollContainer>
              {additionalDetails.length > 0 && (
                <FeaturesTab
                  selected={selectedTab === 0}
                  onClick={() => setSelectedTab(0)}
                >
                  <Text type="extra-bold">Details</Text>
                </FeaturesTab>
              )}
              <FeaturesTab
                selected={selectedTab === 1}
                onClick={() => setSelectedTab(1)}
              >
                <Text type="extra-bold">Description</Text>
              </FeaturesTab>
            </HorzScrollContainer>
            {selectedTab === 0 && (
              <FeaturesContent>
                <DetailsContainer>
                  {additionalDetails?.map((item, index) => (
                    <>
                      <DetailsItemWrapper key={index}>
                        <DetailsTitle>
                          <Text type="bold">{item.attributeName}</Text>
                        </DetailsTitle>
                        <DetailsValue>
                          <Text>
                            {item?.attributeValues?.map(
                              (details, detailIndex) => {
                                return `${details.attributeValue}${
                                  detailIndex !==
                                  item?.attributeValues?.length - 1
                                    ? ", "
                                    : ""
                                }`;
                              }
                            )}
                          </Text>
                        </DetailsValue>
                      </DetailsItemWrapper>
                      {index !== additionalDetails?.length - 1 && (
                        <DetailsSeparator />
                      )}
                    </>
                  ))}
                </DetailsContainer>
              </FeaturesContent>
            )}
            {selectedTab === 1 && (
              <FeaturesContent>
                {details?.description?.longDescription &&
                details?.description?.longDescription.length > 90 ? (
                  <ReadMore
                    className="read-more-read-less"
                    lineClamp={2}
                    readMoreTextClassName="product-details-read-more-less-button"
                  >
                    <SpecificationsText>
                      <Text type="regular">
                        {details?.description?.longDescription}
                      </Text>
                    </SpecificationsText>
                  </ReadMore>
                ) : (
                  <SpecificationsText>
                    <Text type="regular">
                      {details?.description?.longDescription}
                    </Text>
                  </SpecificationsText>
                )}
              </FeaturesContent>
            )}
          </FeaturesContainer>
          {recommendations.length > 0 && (
            <RecentlyViewed>
              <SectionTitle>
                <Text type="bold">Recommended</Text>
              </SectionTitle>
              <ProductListingContainer>
                <HorzScrollContainer
                  style={{
                    paddingRight: "40px",
                    gap: "24px",
                    width: "100%",
                  }}
                >
                  {recommendations?.map((item, index) => (
                    <ProductCard
                      key={index}
                      image={getImage(item?.productImageUrl, "Small")}
                      imageStyle={{
                        height: "194px",
                        minHeight: "194px",
                        borderRadius: "4px",
                      }}
                      imageWrapperStyle={{ height: "fit-content" }}
                      item={item}
                      productId={item?._id}
                      title={item?.productName}
                      subTitle={item?.brand || ""}
                      price={item?.price || ""}
                      discountedPrice={item?.discountedPrice || ""}
                      discount={item?.discount || ""}
                      attributeList={item?.attributeList || []}
                      selectedItemId={itemId}
                      setSelectedItemId={setItemId}
                      doNotUpdateId={true}
                      handleAction={null}
                    />
                  ))}
                </HorzScrollContainer>
              </ProductListingContainer>
            </RecentlyViewed>
          )}
        </ContentContainer>
        <FooterWrapper>
          <PriceSummaryWrapper>
            {/* <ItemCountText>
              <Text type="extra-bold">1 item</Text>
            </ItemCountText> */}
            {details?.discountPct > 0 ? (
              <ItemPriceText>
                <Text type="bold">
                  {formatPrice(details?.offerPrice) || ""}
                </Text>
              </ItemPriceText>
            ) : (
              <ItemPriceText>
                <Text type="bold">{formatPrice(details?.price) || ""}</Text>
              </ItemPriceText>
            )}
          </PriceSummaryWrapper>
          <FooterButtonContainer>
            <AddToCartButton
              isModal
              noCustomisation={true}
              addButtonStyle={{ width: "159px", height: "40px" }}
              item={details}
              productId={itemId}
              product={details}
              setSelectedItemId={setSelectedItemId}
              setShowDetailModal={setShowDetailModal}
              setShowCustomisationModal={setShowCustomisationModal}
              setShowRepeatSelectionModal={setShowRepeatSelectionModal}
            />
          </FooterButtonContainer>
        </FooterWrapper>
      </Wrapper>
    );
  } else {
    return <Loader />;
  }
};

const Wrapper = styled.div`
  width: 100vw;
  position: relative;
  padding-bottom: calc(50px + 44px);
`;
const ImageCarouselContainer = styled.div`
  width: 100%;
`;
const ContentContainer = styled.div`
  width: 100%;
  padding: 32px 24px 20px 24px;
`;
const ProductName = styled.div`
  color: #273135;
  font-size: 24px;
  font-weight: 700;
`;
const ProductPriceDetails = styled.div`
  width: 100%;
  padding-top: 19px;
`;
const OriginalPrice = styled.div`
  color: #273135;
  font-size: 14px;
  font-weight: 500;
`;
const ProductPricingWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const ProductPrice = styled.div`
  color: #273135;
  font-size: 21px;
  font-weight: 800;
`;
const ProductDiscountedPrice = styled.div`
  color: #273135;
  font-size: 21px;
  font-weight: 400;
  text-decoration-line: line-through;
  opacity: 0.6;
  padding-right: 8px;
`;
const ProductDiscount = styled.div`
  display: inline-flex;
  padding: 4px 8px;
  gap: 10px;
  border-radius: 2px;
  background: #f8cf46;

  color: #273135;
  font-size: 12px;
  margin-left: 14px;
`;
const SavingsWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 12px 16px;
  gap: 10px;
  border-radius: 4px;
  background: rgba(255, 236, 187, 0.5);
  margin-top: 20px;

  color: #273135;
  font-size: 12px;
  font-weight: 500;
`;
const HorizontalLineDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #dfe1e1;
  margin-top: 24px;
`;
const QuantitySelectionContainer = styled.div`
  width: 100%;
  padding-top: 24px;
`;
const QuantitySelectionWrapper = styled.div`
  width: 100%;
  padding-top: 16px;
`;
const QuantityCard = styled.div`
  display: flex;
  height: 35px;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  border-radius: 18px;
  background: ${(props) =>
    props.selected ? "rgba(4, 173, 170, 0.04)" : "#f4f5f5"};
  border: ${(props) => (props.selected ? "1.4px solid #04ADAA" : "none")};

  color: #273435;
  font-size: 14px;
  font-weight: 500;
`;
const FeaturesContainer = styled.div`
  width: 100%;
  padding-top: 24px;
`;
const FeaturesTab = styled.div`
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: ${(props) =>
    props.selected ? "rgba(231, 242, 243, 0.80)" : "none"};
  border-radius: ${(props) => (props.selected ? "8px" : "0px")};

  color: #273135;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.3px;
  opacity: ${(props) => (props.selected ? "1" : "0.4")};
  text-transform: uppercase;
`;
const FeaturesContent = styled.div`
  width: 100%;
  padding-top: 24px;
`;
const SpecificationsText = styled.div`
  color: #273135;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
`;
const RecentlyViewed = styled.div`
  width: 100%;
  padding-top: 32px;
`;
const ProductListingContainer = styled.div`
  width: 100%;
  padding-top: 24px;
`;
const SectionTitle = styled.div`
  color: #273135;
  font-family: Manrope;
  font-size: 18px;
  font-weight: 700;
`;
const FooterWrapper = styled.div`
  width: 100%;
  height: 79px;
  position: fixed;
  bottom: 0px;
  left: 0px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 24px;
`;
const PriceSummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const ItemPriceText = styled.div`
  color: #273135;
  font-size: 18px;
`;
const FooterButtonContainer = styled.div`
  width: 159px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 331px;
`;
const Image = styled.img`
  width: 100%;
  height: 331px;
  background-size: cover;
  object-fit: contain;
`;

const DetailsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 0px;
`;
const DetailsItemWrapper = styled.div`
  display: flex;
  width: 100%;
`;
const DetailsTitle = styled.div`
  color: #273135;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  width: 40%;
  padding-right: 10px;
`;
const DetailsValue = styled.div`
  color: #273135;
  font-size: 13px;
  line-height: 20px;
  width: 60%;
`;
const DetailsSeparator = styled.div`
  width: 100%;
  height: 1px;
  background: #dfe1e1;
`;
const AllowanceContainer = styled.div`
  width: 100%;
  padding-top: 24px;
`;
const AllowanceText = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: #273135;
`;
export default ProductDetails;
