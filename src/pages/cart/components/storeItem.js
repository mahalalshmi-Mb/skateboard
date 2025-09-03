import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Text from "../../../components/atoms/Text";
import { device } from "../../../commons/util/helperFunctions";
import RaiseIssueIcon from "../../profile/subPages/MyBookings/assets/raiseIssueIcon.svg";
import moment from "util/momentWrapper";
import { getAppConfig } from "../../../commons/util/appConfigHelper";
import { colors } from "../../../theme/colors";
import { getSessionStorage } from "../../../util/storageUtil";
import DelToGateIcon from "../../profile/subPages/MyBookings/assets/del_to_gate_icon.svg";
import PickUpAtStoreIcon from "../../profile/subPages/MyBookings/assets/pickup_from_store_icon.svg";
import InvoiceIcon from "../../profile/subPages/MyBookings/assets/invoice.png";
import config from "commons/config";
import { useConfig } from "context/configContext";

function StoreItem(props) {
  const { isPinVerificationRequired } = useConfig();
  const [showReportIssueOption, setShowReportIssueOption] = useState(false);
  const [showTippingOption, setShowTippingOption] = useState(false);
  const [isTipAdded, setIsTipAdded] = useState(false);

  useEffect(() => {
    handleRaiseIssueDisplay();
    checkIfTipAdded();
  }, []);

  const handleRaiseIssueDisplay = () => {
    if (
      moment(props.storeData?.delivery?.itemEstimatedDeliveryTime).isAfter(
        moment()
      )
    ) {
      setShowReportIssueOption(true);
    } else {
      // Parse the item delivery time from the flightData and format it using moment
      const estimatedDateTime = moment(
        props.storeData?.delivery?.itemEstimatedDeliveryTime
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

  const checkIfTipAdded = () => {
    const found = props?.masterTipData?.find(
      (x) => x?.storeId === props?.storeId && x?.tip?.length > 0
    );
    if (found) {
      setShowTippingOption(true);
    }
    let data = getSessionStorage("tipData") || [];
    const tipFound = data?.find((x) => x?.storeId === props?.storeId);
    if (tipFound) {
      setIsTipAdded(true);
    }
  };

  const handleAddTip = () => {
    const found = props?.masterTipData?.find(
      (x) => x?.storeId === props?.storeId
    );
    if (found) {
      props?.setTipData(found);
    }
    props?.setAddTipModalOpen(true);
  };

  return (
    <>
      <Wrapper>
        <Row>
          {props?.storeLogo && props?.storeLogo !== "" && (
            <StoreLogoContainer>
              <StoreLogoWrapper>
                <StoreLogo
                  src={props?.storeLogo || ""}
                  alt="store-logo"
                  showInGrayscale={
                    getAppConfig("SHOW_STORE_LOGO_GRAYSCALE") || false
                  }
                />
              </StoreLogoWrapper>
            </StoreLogoContainer>
          )}
          <StoreDetailsContainer>
            <StoreNameWrapper>
              <StoreName>
                <Text type="medium">{props.storeName}</Text>
              </StoreName>
            </StoreNameWrapper>
            {showReportIssueOption &&
              getAppConfig("SHOW_MY_BOOKINGS_RAISE_REQUEST") &&
              props?.caller === "bookingDetails" && (
                <RaiseIssueWrapper
                  onClick={() => {
                    props.setShowReportIssueModal(true);
                    props.setSelectedSuborderId(props.subOrderId);
                  }}
                >
                  <RaiseIssueLogo src={RaiseIssueIcon} />
                  <RaiseIssueText>
                    <Text type="medium">Raise issue</Text>
                  </RaiseIssueText>
                </RaiseIssueWrapper>
              )}
            {props?.caller === "cart" && showTippingOption && (
              <RaiseIssueWrapper onClick={() => handleAddTip()}>
                <AddTipText>
                  <Text type="semi-bold">
                    {isTipAdded ? `Edit Tip` : `Add Tip`}
                  </Text>
                </AddTipText>
              </RaiseIssueWrapper>
            )}
            <StoreLocationWrapper>
              <Text>
                {`${
                  props?.terminal?.displayLabel
                    ? `${props?.terminal?.displayLabel?.trim()}`
                    : ``
                }${
                  props?.pickupLocation && props?.terminal?.displayLabel
                    ? `, ${props?.pickupLocation?.trim()}`
                    : props?.pickupLocation
                    ? `${props?.pickupLocation?.trim()}`
                    : ``
                }
                  `}
              </Text>
            </StoreLocationWrapper>
            {!props?.showPreOrderTime &&
              props?.data?.storeDetails?.prepTime && (
                <PrepTimeLocationWrapper>
                  <PrepTimeTextLocationWrapper>
                    <Text>Pickup : </Text>
                  </PrepTimeTextLocationWrapper>
                  <PrepTimeTextLocationWrapper>
                    <Text>{props?.data?.storeDetails?.prepTime}</Text>
                  </PrepTimeTextLocationWrapper>
                </PrepTimeLocationWrapper>
              )}
          </StoreDetailsContainer>
        </Row>
      </Wrapper>
      <StoreMetaDataWrapper>
        {props?.caller === "bookingDetails" && (
          <MyBookingsData>
            <ETAContainer
              style={{
                marginBottom:
                  props?.item?.ancestors === "Flight Booking" ? "12px" : "0px",
              }}
            >
              <ETAText>
                <Text>
                  <span style={{ fontFamily: "ManropeBold" }}>ETA:</span>{" "}
                  {` ${moment(
                    props.storeData?.delivery?.itemEstimatedDeliveryTime
                  ).format("lll")}`}
                </Text>
              </ETAText>
            </ETAContainer>
            {props.storeData?.storeDetails?.domain !== "Flight Booking" && (
              <DeliveryOptionsContainer>
                <DeliveryOptionsWrapper>
                  <SpacedOutRow>
                    <Row>
                      <DeliveryOptionsIcon
                        src={
                          props.storeData?.delivery?.itemDeliveryOption ===
                          config?.deliveryOptions?.deliveryAtGate
                            ? DelToGateIcon
                            : PickUpAtStoreIcon
                        }
                      />
                      <DeliveryOptionsTextContainer>
                        <DeliveryOptionsTextWrapper>
                          <Text type="bold">
                            {props.storeData?.delivery?.itemDeliveryOption}
                          </Text>
                        </DeliveryOptionsTextWrapper>
                        {isPinVerificationRequired && (
                          <ItemPinWrapper>
                            {props.storeData?.storeDetails?.domain?.toLowerCase() ===
                            "duty free" ? (
                              props.storeData?.partnerOrderId &&
                              props.storeData?.partnerOrderId !== "" && (
                                <Text type="bold">{`Ext. Order ID: ${props.storeData?.partnerOrderId}`}</Text>
                              )
                            ) : (
                              <Text type="bold">{`PIN: ${props.storeData?.verificationCode}`}</Text>
                            )}
                          </ItemPinWrapper>
                        )}
                      </DeliveryOptionsTextContainer>
                    </Row>
                  </SpacedOutRow>
                </DeliveryOptionsWrapper>
              </DeliveryOptionsContainer>
            )}
            {props.showDelAgentDetails &&
              props.storeData?.delivery?.valet &&
              Object.keys(props.storeData?.delivery?.valet)?.length > 0 && (
                <DelAgentDetailsContainer>
                  <DelAgentDetailsWrapper>
                    <DelAgentDetailsLabel>
                      <Text>Delivery Personnel</Text>
                    </DelAgentDetailsLabel>
                    <DelAgentName>
                      <Text type="semi-bold">
                        {props.storeData?.delivery?.valet?.name}
                      </Text>
                    </DelAgentName>
                  </DelAgentDetailsWrapper>
                  <DelAgentDetailsWrapper>
                    <DelAgentDetailsLabel>
                      <Text>Phone No.</Text>
                    </DelAgentDetailsLabel>
                    <DelAgentPhNo
                      href={`tel:${props.storeData?.delivery?.valet?.mobile}`}
                    >
                      <Text type="semi-bold">
                        {props.storeData?.delivery?.valet?.mobile}
                      </Text>
                    </DelAgentPhNo>
                  </DelAgentDetailsWrapper>
                </DelAgentDetailsContainer>
              )}
            <DashedBorder />
          </MyBookingsData>
        )}
        {/* <DashedBorder /> */}
      </StoreMetaDataWrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
const StoreLogoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;
const StoreLogoWrapper = styled.div`
  width: 60px;
  height: 60px;
`;
const StoreLogo = styled.img`
  width: 100%;
  height: 100%;
  filter: ${({ showInGrayscale }) =>
    showInGrayscale ? "grayscale(100%)" : "none"};
`;
const StoreDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const StoreNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const PrepTimeIcon = styled.img``;
const RaiseIssueWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const StoreName = styled.div`
  font-size: 20px;
  line-height: 25px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 24px;
  }
`;
const RaiseIssueLogo = styled.img`
  width: 24px;
  height: 24px;
`;
const RaiseIssueText = styled.div`
  font-size: 16px;
  line-height: 25px;
  color: ${colors?.text?.black200};
  padding-left: 4px;

  @media ${device.laptop} {
    font-size: 20px;
  }
`;
const AddTipText = styled.div`
  font-size: 16px;
  line-height: 25px;
  color: ${colors.text.actionTextColor};
  padding-left: 4px;
  cursor: pointer;

  @media ${device.laptop} {
    font-size: 20px;
  }
`;
const StoreMetaDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
`;
const StoreLocationWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 16px;
  color: ${colors.text.gray900};
`;
const PrepTimeLocationWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const PrepTimeTextLocationWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 16px;
  margin-right: 4px;
  color: ${colors.text.gray900};
`;
const MyBookingsData = styled.div`
  width: 100%;
  margin-top: 4px;
`;
const ETAContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ETAText = styled.div`
  font-size: 13px;
  line-height: 16px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
const DeliveryOptionsContainer = styled.div`
  width: 100%;
  border-radius: 4px;
  padding: 8px;
  background-color: #fff4e0;
  margin: 12px 0px;
`;
const DeliveryOptionsWrapper = styled.div`
  width: 100%;
`;
const DeliveryOptionsIcon = styled.img`
  width: 24px;
  height: 24px;
`;
const DeliveryOptionsTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const DeliveryOptionsTextWrapper = styled.div`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: ${colors?.text?.black200};
  text-transform: uppercase;
`;
const ItemPinWrapper = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${colors?.text?.black200};
`;
const DelAgentDetailsContainer = styled.div`
  width: calc(100% + 48px);
  padding: 10px 24px;
  margin-top: 16px;
  margin-left: -24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 0.5px solid #f4e4c8;
  border-bottom: 0.5px solid #f4e4c8;
  background-color: #fffcf5;
`;
const DelAgentDetailsWrapper = styled.div``;
const DelAgentDetailsLabel = styled.div`
  color: ${colors?.text?.black200};
  font-size: 12px;
  line-height: 18px;
`;
const DelAgentName = styled.div`
  color: ${colors?.text?.black200};
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  padding-top: 4px;
`;
const DelAgentPhNo = styled.a`
  color: ${colors?.text?.black200};
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  padding-top: 4px;
  text-decoration: underline !important;
`;
const SpacedOutRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Invoice = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;
const DashedBorder = styled.div`
  margin-left: -24px;
  width: calc(100% + 48px);
  height: 1px;
  border: 0.5px dashed #000000;
  opacity: 0.3;
`;

export default StoreItem;
