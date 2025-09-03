import { useContext, useEffect, useState, useRef, Fragment } from "react";
import { isMobile } from "react-device-detect";
import { useParams } from "react-router-dom";
import ArrowBlack from "../../../../../../assets/images/cart/arrowUpBlack.svg";
import callAPI from "../../../../../../commons/callAPI";
import config from "../../../../../../commons/config";
import Util from "../../../../../../commons/util/util";
import Loader from "../../../../../../components/atoms/loader";
import Text from "../../../../../../components/atoms/Text";
import { NavContext } from "../../../../../../context/navContext";
import Accordian from "../../../../../cart/components/Accordian";
import StoreItem from "../../../../../cart/components/storeItem";
import OrderItem from "../../components/orderItem";
import InfoIcon from "../../../../../../assets/infoIcon.svg";
import NoActiveBooking from "../../assets/no-active-orders.svg";

import {
  AccordianContentContainer,
  ContentContainer,
  ContentWrapper,
  DashedBorder,
  ItemCardContainer,
  OrderListingContainer,
  OrderNumberContainer,
  OrderNumberLabel,
  OrderNumberValue,
  OrderNumberWrapper,
  OrderTotalContainer,
  OrderTotalTitle,
  OrderTotalTitleDesktop,
  OrderTotalWrapper,
  PageTitle,
  PageWrapper,
  PriceSummaryItemWrapper,
  PriceSummaryLabel,
  PriceSummaryValue,
  TaxDownArrow,
  SubOrderNumberContainer,
  SubOrderNumberLabel,
  SubOrderNumberValue,
  OrderNumberText,
  DownloadReceipt,
  ChargeWrapper,
  InfoEmployeeIcon,
  TooltipBox,
  IconWithTooltipWrapper,
  NoDataContainer,
  NoDataImg,
  NoDataText,
  Row,
  GoBackContainer,
} from "./style";
import { formatPrice, isMobileDevice } from "commons/util/helperFunctions";
import GoBack from "pages/edpFSTR/components/molecules/GoBack";

function BookingDetails(props) {
  const { orderId, orderType } = useParams();

  const useNav = useContext(NavContext);
  const tooltipRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState({});
  const [showTaxSummary, setShowTaxSummary] = useState(false);
  const [showOtherChargesSummary, setShowOtherChargesSummary] = useState([]);
  const [activeAccordian, setActiveAccordian] = useState([]);
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [selectedSuborderId, setSelectedSuborderId] = useState("");
  const [showTaxBreakup, setShowTaxBreakup] = useState(false);
  const [isShowEWB, setIsShowEWB] = useState(false);
  const [hasWaiveOff, setHasWaiveOff] = useState(false);

  useEffect(() => {
    getOrderDetails();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsShowEWB(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobile) {
      useNav.showAllNavs();
      useNav.hideFooterNavs();
      useNav.showHeaderGoBack();
    } else {
      useNav.showHeaderNavs();
      useNav.showHeaderGoBack();
      useNav.hideFooterNavs();
    }

    return () => {
      useNav.showFooterNavs();
    };
  });

  const getOrderDetails = () => {
    if (orderType === "active") {
      getActiveOrder(orderId);
    } else {
      getPastOrder(orderId);
    }
  };

  const getActiveOrder = async (orderId) => {
    try {
      let apiURL = `${config.api.myOrders.activeOrders}/${orderId}`;
      let apiResponse = await callAPI.get(apiURL, {
        isSelf: "Y",
        flatresponse: "N",
        neatresponse: "Y",
      });
      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        const data = convertData(regResponse);
        let domains = [];
        data?.data?.forEach((x) => {
          domains.push(x.domain);
        });
        setActiveAccordian(domains);
        setOrderData(data);
        let chargesObj = {};
        if (data?.info?.cart?.summary?.charges?.length > 0) {
          data?.info?.cart?.summary?.charges?.forEach((x) => {
            chargesObj[x.name] = true;
          });
        }
        setShowOtherChargesSummary(chargesObj);
        if (
          data?.info?.cart?.summary?.offers?.[0]?.additionalCharges?.length > 0
        ) {
          setHasWaiveOff(true);
        }
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getPastOrder = async (orderId) => {
    try {
      let apiURL = `${config.api.myOrders.pastOrders}/${orderId}`;
      let apiResponse = await callAPI.get(apiURL, {
        pageNo: 0,
        limit: 1,
        isSelf: "Y",
        flatresponse: "N",
        neatresponse: "Y",
      });
      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        const data = convertData(regResponse);
        let domains = [];
        data?.data?.forEach((x) => {
          domains.push(x.domain);
        });
        setActiveAccordian(domains);
        setOrderData(data);
        let chargesObj = {};
        if (data?.info?.invoice?.misc?.charges?.length > 0) {
          data?.info?.invoice?.misc?.charges?.forEach((x) => {
            chargesObj[x.name] = true;
          });
        }
        if (
          data?.info?.cart?.summary?.offers?.[0]?.additionalCharges?.length > 0
        ) {
          setHasWaiveOff(true);
        }
        setShowOtherChargesSummary(chargesObj);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const convertData = (response) => {
    let data = [];
    let metadata = {};
    let responseData = [];
    let finalData = {};

    metadata = response.metadata;
    responseData = response?.data;

    if (data.length === 0) {
      responseData?.shipping?.forEach((x) => {
        const domainFound = data.find(
          (dom) =>
            dom.domain === x?.partnerInfo?.domain ||
            dom.domain === x?.items[0]?.ancestors
        );
        if (!domainFound) {
          data.push({
            domain: x?.partnerInfo?.domain || x?.items[0]?.ancestors,
            store: [],
          });
        }
      });
    }

    data?.forEach((localData) => {
      responseData?.shipping?.forEach((respData) => {
        if (
          localData.domain &&
          (localData?.domain === respData?.partnerInfo?.domain ||
            localData?.domain === respData?.items[0]?.ancestors)
        ) {
          const storeFound = localData?.store.find(
            (storeFound) =>
              storeFound.storeName === respData?.partnerInfo?.partnerName ||
              storeFound.storeName === respData?.partnerInfo?.vendorName
          );
          if (!storeFound) {
            localData?.store?.push({
              storeName: respData?.partnerInfo?.partnerName,
              storeDetails: respData?.partnerInfo,
              address: respData?.address || {},
              delivery: respData?.delivery || {},
              flight: respData?.flight || {},
              invoice: respData?.invoice || {},
              verificationCode: respData?.verificationCode || "",
              partnerOrderId: respData?.partnerOrderId || "",
              _id: respData?._id || "",
              items: [],
            });
          }
          localData?.store?.forEach((str) => {
            if (str.storeName === respData?.partnerInfo?.partnerName) {
              str.items = str?.items?.concat(respData.items);
            }
          });
        }
      });
    });

    finalData.data = data;
    finalData.info = responseData;
    finalData.metadata = metadata;

    return finalData;
  };

  const handleAccordianToggle = (domain) => {
    let data = JSON.parse(JSON.stringify(activeAccordian));
    if (data.includes(domain)) {
      data.splice(data.indexOf(domain), 1);
    } else {
      data.push(domain);
    }
    setActiveAccordian([...data]);
  };

  const getItemsLength = (storeArray) => {
    let len = 0;
    storeArray.forEach((x) => (len += x?.items?.length));
    return len?.toString();
  };

  const handleOtherCharges = (name) => {
    let obj = JSON.parse(JSON.stringify(showOtherChargesSummary));
    if (obj[name] === true) {
      obj[name] = false;
    } else {
      obj[name] = true;
    }
    setShowOtherChargesSummary(obj);
  };

  const getInvoice = () => {
    const found = orderData?.data?.[0]?.store?.[0]?.invoice?.documents?.find(
      (x) => x?.code?.includes("invoice")
    );
    if (found) {
      return true;
    } else {
      return false;
    }
  };

  const handleDocuments = (e) => {
    const found = orderData?.data?.[0]?.store?.[0]?.invoice?.documents?.find(
      (x) => x?.code?.includes("invoice")
    );
    if (found && found?.reference) {
      e.stopPropagation();
      window.open(found?.reference);
      return true;
    }
  };

  const desktopHandlers = {
    onMouseEnter: () => setIsShowEWB(true),
    onMouseLeave: () => setIsShowEWB(false),
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <PageWrapper>
        <GoBackContainer>
          <GoBack />
        </GoBackContainer>
        {orderData?.data?.length > 0 ? (
          <ContentContainer>
            <ContentWrapper>
              <PageTitle>
                <Text type="bold">My Orders</Text>
              </PageTitle>
              {orderData?.info?._id && (
                <OrderNumberWrapper>
                  <OrderNumberContainer>
                    <OrderNumberText>
                      <OrderNumberLabel>
                        <Text type="medium">ORDER NO.</Text>
                      </OrderNumberLabel>
                      <OrderNumberValue>
                        <Text type="semi-bold">
                          #{orderData?.info?._id?.slice(-5)}
                        </Text>
                      </OrderNumberValue>
                    </OrderNumberText>
                    {getInvoice() && (
                      <DownloadReceipt onClick={(e) => handleDocuments(e)}>
                        <Text type="semi-bold">Download Receipt</Text>
                      </DownloadReceipt>
                    )}
                  </OrderNumberContainer>
                </OrderNumberWrapper>
              )}
              {orderData?.data?.map((orderItem, index) => (
                <OrderListingContainer key={index}>
                  <Accordian
                    headerText={`${orderItem?.domain} (${getItemsLength(
                      orderItem?.store
                    )})`}
                    accordianContentStyle={{ padding: "0px 16px 0px 16px" }}
                    domain={orderItem?.domain}
                    isOpen={activeAccordian?.includes(orderItem?.domain)}
                    handleAccordianToggle={handleAccordianToggle}
                  >
                    <AccordianContentContainer>
                      {orderItem?.store?.map((storeItem, storeIndex) => (
                        <Fragment key={storeIndex}>
                          <SubOrderNumberContainer>
                            <SubOrderNumberLabel>
                              <Text type="medium">SUB ORDER NO: </Text>
                            </SubOrderNumberLabel>
                            <SubOrderNumberValue>
                              <Text type="semi-bold">
                                {`#${orderData?.info?._id?.slice(
                                  -5
                                )} - ${storeItem?._id?.slice(-5)}`}
                              </Text>
                            </SubOrderNumberValue>
                          </SubOrderNumberContainer>
                          <StoreItem
                            key={storeIndex}
                            data={storeItem}
                            storeName={storeItem?.storeName}
                            storeLogo={
                              storeItem?.storeDetails?.brandingImageURL
                            }
                            pickupLocation={
                              storeItem?.storeDetails?.pickupLocation
                            }
                            terminal={storeItem?.storeDetails?.terminal}
                            subOrderId={storeItem?._id}
                            storeData={storeItem}
                            showDelAgentDetails={
                              orderType === "active" &&
                              storeItem?.delivery?.itemDeliveryOption
                                ?.toLowerCase()
                                ?.includes("gate")
                            }
                            showReportIssueModal={showReportIssueModal}
                            setShowReportIssueModal={setShowReportIssueModal}
                            setSelectedSuborderId={setSelectedSuborderId}
                            caller="bookingDetails"
                            showPreOrderTime={false}
                          />
                          {storeItem?.items?.map((item, orderIndex) => (
                            <ItemCardContainer>
                              <OrderItem
                                item={item}
                                storeData={storeItem}
                                orderData={orderItem}
                                orderInfo={orderData?.info}
                                key={orderIndex}
                                index={orderIndex}
                                showItemDivider={
                                  orderIndex !== storeItem?.items?.length - 1 ||
                                  storeIndex !== orderItem?.store?.length - 1
                                }
                                showCancelOption={orderType === "active"}
                                showDelAgentDetails={
                                  orderType === "active" &&
                                  storeItem?.delivery?.itemDeliveryOption
                                    ?.toLowerCase()
                                    ?.includes("gate")
                                }
                                showTakeMeThere={Util.isWebView()}
                                selectedSuborderId={selectedSuborderId}
                                showReportIssueModal={showReportIssueModal}
                                setShowReportIssueModal={
                                  setShowReportIssueModal
                                }
                              />
                            </ItemCardContainer>
                          ))}
                        </Fragment>
                      ))}
                    </AccordianContentContainer>
                  </Accordian>
                </OrderListingContainer>
              ))}
            </ContentWrapper>
            {orderData?.info?.cart?.summary && (
              <OrderTotalContainer>
                <OrderTotalTitle>
                  <Text type="bold">Total</Text>
                </OrderTotalTitle>
                <OrderTotalWrapper>
                  <OrderTotalTitleDesktop>
                    <Text type="bold">Total</Text>
                  </OrderTotalTitleDesktop>
                  <PriceSummaryItemWrapper>
                    <PriceSummaryLabel>
                      <Text type="medium">Subtotal</Text>
                    </PriceSummaryLabel>
                    <PriceSummaryValue>
                      <Text type="medium">
                        {formatPrice(orderData?.info?.cart?.summary?.total)}
                      </Text>
                    </PriceSummaryValue>
                  </PriceSummaryItemWrapper>
                  {orderData?.info?.cart?.summary?.discounts > 0 && (
                    <PriceSummaryItemWrapper>
                      <PriceSummaryLabel>
                        <Text type="medium">Discount</Text>
                      </PriceSummaryLabel>
                      <PriceSummaryValue>
                        <Text type="medium" style={{ color: "#71C255" }}>
                          {`${formatPrice(
                            orderData?.info?.cart?.summary?.discounts
                          )}`}
                        </Text>
                      </PriceSummaryValue>
                    </PriceSummaryItemWrapper>
                  )}
                  {orderData?.info?.cart?.summary?.delivery > 0 && (
                    <PriceSummaryItemWrapper>
                      <PriceSummaryLabel>
                        <Text type="medium">Delivery</Text>
                      </PriceSummaryLabel>
                      <PriceSummaryValue>
                        <Text type="medium">
                          {formatPrice(
                            orderData?.info?.cart?.summary?.delivery
                          )}
                        </Text>
                      </PriceSummaryValue>
                    </PriceSummaryItemWrapper>
                  )}
                  {orderData?.info?.cart?.summary?.packagingCharges > 0 && (
                    <PriceSummaryItemWrapper>
                      <PriceSummaryLabel>
                        <Text type="medium">Packaging Charges</Text>
                      </PriceSummaryLabel>
                      <PriceSummaryValue>
                        <Text type="medium">
                          {formatPrice(
                            orderData?.info?.cart?.summary?.packagingCharges
                          )}
                        </Text>
                      </PriceSummaryValue>
                    </PriceSummaryItemWrapper>
                  )}
                  {orderData?.info?.cart?.summary?.tip > 0 && (
                    <PriceSummaryItemWrapper>
                      <PriceSummaryLabel>
                        <Text type="medium">Tip</Text>
                      </PriceSummaryLabel>
                      <PriceSummaryValue>
                        <Text type="medium">
                          {formatPrice(orderData?.info?.cart?.summary?.tip)}
                        </Text>
                      </PriceSummaryValue>
                    </PriceSummaryItemWrapper>
                  )}
                  {orderData?.info?.cart?.summary?.charges?.length > 0 &&
                    orderData?.info?.cart?.summary?.charges?.map(
                      (item, index) => (
                        <>
                          {(hasWaiveOff &&
                          item?.summary?.waivedOffTotal !== null &&
                          item?.summary?.waivedOffTotal !== undefined
                            ? item?.summary?.waivedOffTotal > 0
                            : item?.summary?.total > 0) && (
                            <PriceSummaryItemWrapper key={index}>
                              <PriceSummaryLabel
                                onClick={() => handleOtherCharges(item?.name)}
                                style={{ cursor: "pointer" }}
                              >
                                <Text type="medium">{item?.name}</Text>
                                {item?.breakup?.length > 0 && (
                                  <TaxDownArrow
                                    src={ArrowBlack}
                                    expanded={
                                      showOtherChargesSummary[item?.name] ===
                                      true
                                    }
                                  />
                                )}
                              </PriceSummaryLabel>
                              <PriceSummaryValue>
                                <Text type="medium">
                                  {formatPrice(
                                    hasWaiveOff &&
                                      item?.summary?.waivedOffTotal !== null &&
                                      item?.summary?.waivedOffTotal !==
                                        undefined
                                      ? item?.summary?.waivedOffTotal
                                      : item?.summary?.total
                                  )}
                                </Text>
                              </PriceSummaryValue>
                            </PriceSummaryItemWrapper>
                          )}
                          {showOtherChargesSummary[item?.name] === true &&
                            item?.breakup?.length > 0 &&
                            item?.breakup?.map((subItem, subIndex) =>
                              (
                                hasWaiveOff &&
                                subItem?.waivedOffTotal !== null &&
                                subItem?.waivedOffTotal !== undefined
                                  ? subItem?.waivedOffTotal > 0
                                  : subItem?.total > 0
                              ) ? (
                                <PriceSummaryItemWrapper
                                  key={subIndex}
                                  style={{ paddingLeft: "8px" }}
                                >
                                  <ChargeWrapper>
                                    <PriceSummaryLabel>
                                      <Text type="medium">
                                        {subItem?.title}
                                      </Text>
                                    </PriceSummaryLabel>
                                    {subItem?.code === "EWB" && (
                                      <IconWithTooltipWrapper
                                        ref={tooltipRef}
                                        {...(!isMobileDevice() &&
                                          desktopHandlers)}
                                      >
                                        <InfoEmployeeIcon
                                          src={InfoIcon}
                                          onClick={() =>
                                            setIsShowEWB((prev) => !prev)
                                          }
                                        />
                                        {isShowEWB && (
                                          <TooltipBox>
                                            A 3% Employee Wage and Benefits Fee
                                            will be applied to all guest checks.
                                            This surcharge is not a gratuity
                                            payable to employees.
                                          </TooltipBox>
                                        )}
                                      </IconWithTooltipWrapper>
                                    )}
                                  </ChargeWrapper>
                                  <PriceSummaryValue>
                                    <Text type="medium">
                                      {formatPrice(
                                        hasWaiveOff &&
                                          subItem?.waivedOffTotal !== null &&
                                          subItem?.waivedOffTotal !== undefined
                                          ? subItem?.waivedOffTotal
                                          : subItem?.total
                                      )}
                                    </Text>
                                  </PriceSummaryValue>
                                </PriceSummaryItemWrapper>
                              ) : null
                            )}
                        </>
                      )
                    )}
                  {(orderData?.info?.cart?.summary?.discountedTax !== null &&
                  orderData?.info?.cart?.summary?.discountedTax !== undefined
                    ? orderData?.info?.cart?.summary?.discountedTax > 0
                    : orderData?.info?.cart?.summary?.taxes > 0) && (
                    <PriceSummaryItemWrapper>
                      <PriceSummaryLabel
                        onClick={() => setShowTaxSummary(!showTaxSummary)}
                        style={{ cursor: showTaxBreakup ? "pointer" : "auto" }}
                      >
                        <Text type="medium">Taxes</Text>
                        {showTaxBreakup && (
                          <TaxDownArrow
                            src={ArrowBlack}
                            expanded={showTaxSummary}
                          />
                        )}
                      </PriceSummaryLabel>
                      <PriceSummaryValue>
                        <Text type="medium">
                          {formatPrice(
                            orderData?.info?.cart?.summary?.discountedTax !==
                              null &&
                              orderData?.info?.cart?.summary?.discountedTax !==
                                undefined &&
                              orderData?.info?.cart?.summary?.discountedTax !==
                                0
                              ? orderData?.info?.cart?.summary?.discountedTax
                              : orderData?.info?.cart?.summary?.taxes
                          )}
                        </Text>
                      </PriceSummaryValue>
                    </PriceSummaryItemWrapper>
                  )}
                  {showTaxBreakup &&
                    showTaxSummary &&
                    orderData?.info?.cart?.summary?.taxBreakup?.length > 0 &&
                    orderData?.info?.cart?.summary?.taxBreakup?.map(
                      (taxItem, taxIndex) =>
                        taxItem.value > 0 ? (
                          <PriceSummaryItemWrapper
                            key={taxIndex}
                            style={{ paddingLeft: "10px" }}
                          >
                            <PriceSummaryLabel>
                              <Text type="medium">{`${taxItem.key} (${taxItem.rate}%)`}</Text>
                            </PriceSummaryLabel>
                            <PriceSummaryValue>
                              <Text type="medium">
                                {formatPrice(taxItem.value)}
                              </Text>
                            </PriceSummaryValue>
                          </PriceSummaryItemWrapper>
                        ) : null
                    )}
                  <DashedBorder />
                  <PriceSummaryItemWrapper>
                    <PriceSummaryLabel>
                      <Text type="bold">Total</Text>
                    </PriceSummaryLabel>
                    <PriceSummaryValue>
                      <Text type="bold">
                        {formatPrice(
                          orderData?.info?.cart?.summary?.priceToPay
                        )}
                      </Text>
                    </PriceSummaryValue>
                  </PriceSummaryItemWrapper>
                </OrderTotalWrapper>
              </OrderTotalContainer>
            )}
          </ContentContainer>
        ) : (
          <NoDataContainer>
            <NoDataImg src={NoActiveBooking} />
            <NoDataText style={{ paddingTop: "0px" }}>
              <Text type="semi-bold">No orders in sight</Text>
            </NoDataText>
          </NoDataContainer>
        )}
      </PageWrapper>
    );
  }
}

export default BookingDetails;
