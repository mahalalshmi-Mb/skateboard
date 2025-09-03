import { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import moment from "util/momentWrapper";
import callAPI from "../../../../../commons/callAPI";
import config from "../../../../../commons/config";
import { getAppConfig } from "../../../../../commons/util/appConfigHelper";
import {
  decode,
  device,
  formatPrice,
} from "../../../../../commons/util/helperFunctions";
import Util from "../../../../../commons/util/util";
import Text from "../../../../../components/atoms/Text";
import useCustomNavigation from "../../../../../hooks/useCustomNavigation";
import { Image } from "../../../../../theme/globalStyleSheet";
import DirectionsIcon from "../../../../../assets/images/cabs/Directions.svg";
import ProductFallbackImg from "../../../../edpFSTR/assets/Fallback Images/product-fallback-medium.svg";
import { checkoutToDreamfolks } from "components/molecules/checkoutToDreamfolks/checkoutToDreamfolks";
import qrIcon from "../assets/qr-icon.svg";
import RightArrowGreen from "../assets/rightArrowGreen.svg";
import CloseIcon from "../assets/x.svg";
import {
  PreviewCloseIcon,
  PreviewCloseIconWrapper,
  PreviewImageContainer,
  PreviewImageWrapper,
} from "../pages/BookingDetails/style";
import ItemCancellationModal from "./ItemCancellationModal";
import ReportIssueModal from "./ReportIssueModal";
import { colors } from "theme/colors";

function OrderItem(props) {
  const { pushHistory } = useCustomNavigation();
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [cabOrderDetails, setCabOrderDetails] = useState();
  const [flightOrderDetails, setFlightOrderDetails] = useState();
  const [isDFQrPreviewOpen, setIsDFQrPreviewOpen] = useState(false);
  const [showReportIssueOption, setShowReportIssueOption] = useState(false);
  const [allAttributes, setAllAttributes] = useState([]);
  const [allPreferences, setAllPreferences] = useState([]);

  useEffect(() => {
    if (props?.item?.ancestors === "Airport cabs") {
      getActiveOrder(props.orderInfo._id, props.storeData._id);
    }
    if (props?.item?.ancestors === "Flight Booking") {
      getActiveOrder(props.orderInfo._id);
    }
    handleRaiseIssueDisplay();
    handleItemPreferences();
  }, []);

  const handleRaiseIssueDisplay = () => {
    if (
      moment(props.storeData?.delivery?.itemEstimatedDeliveryTimeLocal).isAfter(
        moment()
      )
    ) {
      setShowReportIssueOption(true);
    } else {
      // Parse the item delivery time from the flightData and format it using moment
      const estimatedDateTime = moment(
        props.storeData?.delivery?.itemEstimatedDeliveryTimeLocal
      );
      // Get the current time using moment
      const currentTime = moment();

      // Calculate the difference in hours between the item delivery time and the current time
      const differenceInHours = estimatedDateTime.diff(currentTime, "hours");
      if (Math.abs(differenceInHours) < 48) {
        setShowReportIssueOption(true);
      } else {
        setShowReportIssueOption(false);
      }
    }
  };

  const handleItemPreferences = () => {
    let attributes = [];
    let preferences = [];
    if (props?.item?.attributeList?.length > 0) {
      props?.item?.attributeList?.forEach((attr) => {
        attr?.attributeValues?.forEach((attrVal) => {
          attributes.push(attrVal?.attributeValue?.trim());
        });
      });
    }
    if (props?.item?.preferences?.length > 0) {
      props?.item?.preferences?.forEach((pref) => {
        pref?.selection?.forEach((prefVal) => {
          preferences.push(prefVal?.name?.trim());
        });
      });
    }
    setAllAttributes(attributes);
    setAllPreferences(preferences);
  };

  const getItemName = () => {
    if (props?.item?.itemType !== "product") {
      if (props?.item?.ancestors === "Airport cabs") {
        return `${props.storeData?.storeDetails?.vendorCode || ""} ${
          props?.item?.description?.shortDescription || ""
        }`;
      } else {
        return `${
          props?.item?.description?.shortDescription &&
          props?.item?.description?.shortDescription !== "unknown"
            ? props?.item?.description?.shortDescription
            : ""
        }`;
      }
    } else {
      if (props?.item?.title) {
        return `${props?.item?.title} ${
          allAttributes?.length > 0 ? `(${allAttributes?.join(", ")})` : ``
        }`;
      }
    }
    return "";
  };

  const getProductImage = () => {
    const found = props?.item?.itemImageUrl?.find(
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
  };

  const handleDocuments = (e, url) => {
    if (url) {
      e.stopPropagation();
      window.open(url);
    }
  };

  const getOrderStatusBgColor = (status) => {
    let color = "#DAFFE2";
    switch (status.toLowerCase()) {
      case "collected":
        color = "#DAFFE2";
        break;
      case "accepted":
        color = "#D4EDFE";
        break;
      case "delivered":
        color = "#DAFFE2";
        break;
      case "aborted":
        color = "#FFC3C3";
        break;
      case "cancelled":
        color = "#FFC3C3";
        break;
      default:
        return "#DAFFE2";
    }
    return color;
  };

  const getActiveOrder = async (orderId, subOrderId) => {
    try {
      let apiURL = `${config.api.myOrders.activeOrders}/${orderId}${
        subOrderId ? `/${subOrderId}` : ""
      }`;
      let apiResponse = await callAPI.get(apiURL, {
        isSelf: "Y",
      });
      let regResponse = await apiResponse.json();

      if (regResponse.status === 200) {
        if (props?.item?.ancestors === "Flight Booking") {
          setFlightOrderDetails(regResponse.data.children[0].children[0]);
        }
        if (props?.item?.ancestors === "Airport cabs") {
          setCabOrderDetails(regResponse.data.children[0]);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleTrackCab = async () => {
    if (cabOrderDetails) {
      pushHistory(`/cabs/booking-details`, {
        orderId: props.orderInfo._id,
        type: "activeBooking",
        details: cabOrderDetails,
        vendorContact: props?.storeData?.storeDetails?.contacts?.[0],
      });
    }
  };

  const handleFlightDetail = async () => {
    if (flightOrderDetails) {
      pushHistory(`/travellers/profile/myOrders/${props.orderInfo._id}`, {
        orderId: props.orderInfo._id,
        details: flightOrderDetails,
        orderStatus: props?.item?.orderStatus,
      });
    }
  };

  const handleTakeMeThereClick = (e, poiId, storeId) => {
    if (poiId && Util.isWebView()) {
      const data = {
        storeCode: poiId,
        terminal: { label: "Location", value: "Terminal2" },
        id: storeId,
      };
      Util.sendMessageToReactNative(`TAKEME_CLICKED, ${JSON.stringify(data)}`);
      e.stopPropagation();
    }
  };

  const decodeString = (encodedStr) => {
    try {
      return decode(encodedStr);
    } catch (e) {
      console.log(e);
      return encodedStr;
    }
  };

  const checkCancellationPolicy = (item, delivery) => {
    if (
      !item?.cancellation?.isCancelled &&
      item?.policy?.cancellation?.cancellable
    ) {
      const differenceInMinutes = getDifferenceInMinutes(
        delivery?.itemCollectionTimeLocal
      );
      return item?.policy?.cancellation?.cancellation.some((policyItem) => {
        const isBetweenStartEndValue =
          differenceInMinutes >= policyItem?.startValue &&
          differenceInMinutes <= policyItem?.endValue;
        return policyItem?.cancellable && isBetweenStartEndValue;
      });
    }
    return false;
  };

  const getDifferenceInMinutes = (estimatedDeliveryDateTime) => {
    const currentDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const differenceInMilliseconds =
      new Date(estimatedDeliveryDateTime) - new Date(currentDateTime);
    const differenceInMinutes = Math.floor(
      differenceInMilliseconds / 1000 / 60
    );
    return differenceInMinutes;
  };

  const getDocuments = () => {
    const docs = props?.storeData?.invoice?.documents?.filter(
      (x) => !x?.code?.includes("invoice")
    );
    return docs || [];
  };

  return (
    <>
      <Wrapper>
        <ContentContainer>
          {getProductImage() !== "" && (
            <ProductImageWrapper>
              <ProductImage
                src={getProductImage()}
                onError={(e) => {
                  e.target.src = ProductFallbackImg;
                }}
              />
            </ProductImageWrapper>
          )}
          <ProductDetailsWrapper>
            <ItemDetailsWrapper>
              <ItemName>
                <Text type="medium">{getItemName()}</Text>
              </ItemName>
              {allPreferences?.length > 0 && (
                <ItemPreferences>
                  <Text type="medium">{allPreferences?.join(", ")}</Text>
                </ItemPreferences>
              )}
              <StoreName>
                <Text>
                  {props.storeData?.storeDetails?.storeName ||
                    props?.item?.ancestors}
                </Text>
              </StoreName>
              <SpacedOutRow>
                <Col>
                  <ItemPriceWrapper>
                    {props?.item?.price?.reference?.priceToPay &&
                      props?.item?.price?.reference?.priceToPay !== "NaN" && (
                        <FinalPrice>
                          <Text type="medium">
                            {formatPrice(
                              props?.item?.price?.reference?.priceToPay
                            )}
                          </Text>
                        </FinalPrice>
                      )}
                    {props?.item?.price?.reference?.discounts > 0 && (
                      <DiscountedPrice>
                        <Text>
                          {formatPrice(
                            props?.item?.price?.reference?.strikeout
                          )}
                        </Text>
                      </DiscountedPrice>
                    )}
                  </ItemPriceWrapper>
                  <ItemMetaDetails>
                    <Text type="medium">{`Qty: ${props?.item?.quantity}`}</Text>
                  </ItemMetaDetails>
                </Col>
                <Col>
                  <ItemStatusWrapper
                    style={{
                      backgroundColor: getOrderStatusBgColor(
                        props?.item?.orderStatus
                      ),
                    }}
                  >
                    <Text type="bold">{props?.item?.orderStatus}</Text>
                  </ItemStatusWrapper>
                </Col>
              </SpacedOutRow>
            </ItemDetailsWrapper>
          </ProductDetailsWrapper>
        </ContentContainer>
        {props?.item?.ancestors !== "Airport cabs" &&
          props?.storeData?.storeDetails?.contacts?.[0] &&
          (props?.storeData?.storeDetails?.contacts?.[0]?.contactNo ||
            props?.storeData?.storeDetails?.contacts?.[0]?.email) && (
            <SupportDetailsContainer>
              <SupportDetailsLabel>
                <Text>*Want to connect with the Vendor support?</Text>
              </SupportDetailsLabel>
              <SupportDetailsWrapper>
                <SupportEmailWrapper>
                  <DelAgentDetailsLabel>
                    <Text>Email Id</Text>
                  </DelAgentDetailsLabel>
                  <DelAgentEmail
                    href={`mailto:${decodeString(
                      props?.storeData?.storeDetails?.contacts?.[0]?.email
                    )}`}
                  >
                    <Text type="semi-bold">
                      {decodeString(
                        props?.storeData?.storeDetails?.contacts?.[0]?.email
                      ) || "NA"}
                    </Text>
                  </DelAgentEmail>
                </SupportEmailWrapper>
                <SupportPhNoWrapper>
                  <DelAgentDetailsLabel>
                    <Text>Phone No.</Text>
                  </DelAgentDetailsLabel>
                  <DelAgentPhNo
                    href={`tel:${decodeString(
                      props?.storeData?.storeDetails?.contacts?.[0]?.contactNo
                    )}`}
                  >
                    <Text type="semi-bold">
                      {decodeString(
                        props?.storeData?.storeDetails?.contacts?.[0]?.contactNo
                      ) || "NA"}
                    </Text>
                  </DelAgentPhNo>
                </SupportPhNoWrapper>
              </SupportDetailsWrapper>
            </SupportDetailsContainer>
          )}
        {!props.showDelAgentDetails &&
          props?.storeData?.storeDetails?.contacts?.[0]?.contactNo === "" &&
          props?.storeData?.storeDetails?.contacts?.[0]?.email === "" && (
            <ItemDivider />
          )}
        {props.showCancelOption &&
          checkCancellationPolicy(props?.item, props?.storeData?.delivery) && (
            <CancelButtonContainer
              onClick={() => setShowCancellationModal(true)}
            >
              <Text type="bold">Cancel Order</Text>
              <TrackCabArrow src={RightArrowGreen} />
            </CancelButtonContainer>
          )}
        {props?.item?.ancestors === "Airport cabs" && (
          <>
            <TrackCabDivider />
            <TrackCabContainer onClick={handleTrackCab}>
              <TrackCabText>
                <Text type="bold">Ride Details</Text>
              </TrackCabText>
              <TrackCabArrow src={RightArrowGreen} />
            </TrackCabContainer>
          </>
        )}
        {props?.item?.ancestors === "Flight Booking" && (
          <>
            <TrackCabDivider />
            <TrackCabContainer onClick={handleFlightDetail}>
              <TrackCabText>
                <Text type="bold">More Details</Text>
              </TrackCabText>
              <TrackCabArrow src={RightArrowGreen} />
            </TrackCabContainer>
          </>
        )}
        {getDocuments()?.length > 0 &&
          getDocuments()?.map((item, index) => (
            <>
              <TrackCabDivider key={index} />
              {item.type === "link" ? (
                <CancelButtonContainer
                  onClick={(e) => handleDocuments(e, item?.reference)}
                >
                  <Text type="bold">{`Download ${item.title}`}</Text>
                  <TrackCabArrow src={RightArrowGreen} />
                </CancelButtonContainer>
              ) : item.type === "image" ? null : (
                <CancelButtonContainer>
                  <Text style={{ color: "#273135" }}>{item.reference}</Text>
                </CancelButtonContainer>
              )}
            </>
          ))}
        {props?.orderInfo?.shipping?.find(
          (item) => item._id === props.storeData?._id
        ).merchantId === "dreamfolks" && (
          <Fragment>
            {props?.storeData?.invoice?.documents?.find(
              (doc) => doc.type === "image" && doc.code === "suborder.QRCODE"
            ) ? (
              <>
                <TrackCabDivider />
                <CancelButtonContainer
                  onClick={() => setIsDFQrPreviewOpen(true)}
                >
                  <Text type="bold">Show QR Code</Text>
                  <TrackCabArrow src={qrIcon} alt="open-qr" />
                </CancelButtonContainer>
                {isDFQrPreviewOpen &&
                  props?.storeData?.invoice?.documents?.find(
                    (doc) =>
                      doc.type === "image" && doc.code === "suborder.QRCODE"
                  )?.reference && (
                    <PreviewImageWrapper>
                      <PreviewImageContainer>
                        <PreviewCloseIconWrapper
                          onClick={() => setIsDFQrPreviewOpen(false)}
                        >
                          <PreviewCloseIcon src={CloseIcon} />
                        </PreviewCloseIconWrapper>
                        <ImagePreview
                          src={
                            props?.storeData?.invoice?.documents?.find(
                              (doc) =>
                                doc.type === "image" &&
                                doc.code === "suborder.QRCODE"
                            )?.reference
                          }
                          alt="qr-image"
                        />
                      </PreviewImageContainer>
                    </PreviewImageWrapper>
                  )}
              </>
            ) : (
              <>
                <TrackCabDivider />
                <CancelButtonContainer onClick={checkoutToDreamfolks}>
                  <Text type="bold">Re-generate QR code</Text>
                  <TrackCabArrow src={qrIcon} alt="open-qr" />
                </CancelButtonContainer>
              </>
            )}
          </Fragment>
        )}

        {props.showTakeMeThere &&
          props.storeData?.storeDetails?.domain?.toLowerCase() ===
            "duty free" &&
          props.storeData?.storeDetails?.poiId &&
          props.storeData?.storeDetails?.poiId !== "" && (
            <>
              <TrackCabDivider />
              <CancelButtonContainer
                onClick={(e) =>
                  handleTakeMeThereClick(
                    e,
                    props.storeData?.storeDetails?.poiId,
                    props.storeData?.storeDetails?.storeId
                  )
                }
              >
                <DirectionsToPickupWrapper>
                  <TrackCabArrow
                    src={DirectionsIcon}
                    style={{ width: "20px", height: "20px" }}
                  />
                  <Text type="bold">Directions to the store</Text>
                </DirectionsToPickupWrapper>
                <TrackCabArrow src={RightArrowGreen} />
              </CancelButtonContainer>
            </>
          )}
        {props.showItemDivider && <ItemDivider />}
      </Wrapper>
      <ItemCancellationModal
        isDrawerOpen={showCancellationModal}
        setIsDrawerOpen={setShowCancellationModal}
        type={props.orderData.domain || "Others"}
        orderId={props?.orderInfo?._id}
        subOrderId={props.storeData?._id}
        itemKey={props.item?._id}
        itemId={props.item?.productId}
        itemSKU={props.item?.productSKU}
      />
      <ReportIssueModal
        isDrawerOpen={props.showReportIssueModal}
        setIsDrawerOpen={props.setShowReportIssueModal}
        orderId={props?.orderInfo?._id}
        subOrderId={props.selectedSuborderId}
        domain={props?.orderData?.domain || "Common"}
      />
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;
const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
`;
const ProductImageWrapper = styled.div`
  width: 105px;
  min-width: 105px;
  height: 133px;
  border-radius: 4px;
`;
const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  object-fit: contain;
`;
const ProductDetailsWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const ItemDetailsWrapper = styled.div`
  width: 100%;
`;
const ItemName = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: ${colors?.text?.black200};
  word-break: break-word;

  @media ${device.laptop} {
    font-size: 20px;
  }
`;
const ItemPreferences = styled.div`
  font-size: 12px;
  color: ${colors?.text?.gray200};

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
const StoreName = styled.div`
  font-size: 13px;
  line-height: 18px;
  padding-top: 4px;

  @media ${device.laptop} {
    font-size: 16px;
    padding-top: 8px;
  }
`;
const ItemPriceWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding-top: 8px;
`;
const FinalPrice = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${colors?.text?.black300};

  @media ${device.laptop} {
    font-size: 22px;
  }
`;
const DiscountedPrice = styled.div`
  font-size: 13px;
  line-height: 18px;
  color: ${colors?.text?.black200};
  padding-left: 8px;
  text-decoration: line-through;

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
const ItemMetaDetails = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: ${colors?.text?.black200};
  gap: 2px 0px;
  padding-bottom: 16px;

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
const ItemStatusWrapper = styled.div`
  padding: 5px 10px;
  border-radius: 2px;
  background-color: #caecd6;

  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1em;
  color: ${colors?.text?.black200};
  text-transform: uppercase;

  @media ${device.laptop} {
    font-size: 14px;
  }
`;

const CancelButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0px;

  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: ${colors?.text?.actionTextColor};
  cursor: pointer;
`;
const ItemDivider = styled.div`
  width: calc(100% + 48px);
  margin-left: -24px;
  height: 0.5px;
  background-color: #dedddd;
`;
const TrackCabContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0px;
  cursor: pointer;
`;
const TrackCabDivider = styled.div`
  width: calc(100% + 32px);
  height: 0.5px;
  background-color: #dedddd;
  margin-left: -16px;
`;
const TrackCabText = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: ${colors?.text?.actionTextColor};
`;
const TrackCabArrow = styled.img`
  width: 15px;
  height: 15px;
`;
const DelAgentDetailsLabel = styled.div`
  color: ${colors?.text?.black200};
  font-size: 12px;
  line-height: 18px;
`;
const DelAgentEmail = styled.a`
  display: block;
  width: 100%;
  word-wrap: break-word;
  color: ${colors?.text?.black200};
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  padding-top: 4px;
  text-decoration: underline !important;
`;
const DelAgentPhNo = styled.a`
  color: ${colors?.text?.black200};
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  padding-top: 4px;
  text-decoration: underline !important;
`;
const SupportDetailsContainer = styled.div`
  width: calc(100% + 48px);
  padding: 10px 24px;
  margin-left: -24px;
  border-top: 0.5px solid #f4e4c8;
  border-bottom: 0.5px solid #f4e4c8;
  background-color: #fffcf5;
`;
const SupportDetailsLabel = styled.div`
  color: ${colors?.text?.black200};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`;
const SupportDetailsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`;
const SupportEmailWrapper = styled.div`
  width: 70%;
  padding-right: 16px;
`;
const SupportPhNoWrapper = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
const DirectionsToPickupWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;
const ImagePreview = styled(Image)``;
const SpacedOutRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Col = styled.div``;

export default OrderItem;
