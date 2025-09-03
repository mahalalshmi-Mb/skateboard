import { useConfig } from "context/configContext";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import noBillToPayIcon from "../../../../assets/images/cart/no-bill-to-pay.svg";
import Util from "../../../../commons/util/util";
import Text from "../../../../components/atoms/Text";
import Loader from "../../../../components/atoms/loader";
import PushAlert from "../../../../components/atoms/pushAlert";
import { NavContext } from "../../../../context/navContext";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import { getSessionStorage } from "../../../../util/storageUtil";
import rightArrow from "../../assets/rightArrow.svg";
import DineInHeader from "../../components/DineInHeader";
import OrderSummaryView from "../../components/OrderSummaryView";
import PayOptionsModal from "../../components/PayOptionsModal";
import { getOrderSummaryResponseData, getStores } from "../../util/Util";
import { formatPrice } from "commons/util/helperFunctions";

const PayBill = () => {
  const { pushHistory } = useCustomNavigation();
  const [isWebView] = useState(Util.isWebView());

  const useNav = useContext(NavContext);
  const [dineInSessionData] = useState(getSessionStorage("dine-in"));

  const [isLoading, setIsLoading] = useState(false);

  const [storeDetails, setStoreDetails] = useState({});
  const [orderSummary, setOrderSummary] = useState([]);
  const [dineInRefId] = useState(localStorage.getItem("dineInRefId") || "");

  const [grandTotal, setGrandTotal] = useState(0);
  const [showPaymentOptionsModal, setShowPaymentOptionsModal] = useState(false);
  const [paymentOptions] = useState([
    { title: "Online", paymentOption: "now" },
    { title: "At Store", paymentOption: "counter" },
  ]);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(
    paymentOptions[0]
  );

  useEffect(() => {
    getStoreDetailsAndOrderSummary();

    useNav.hideAllNavs();
    useNav.setShowDineInBottomTab(true);
    return () => {
      useNav.setShowDineInBottomTab(false);
      useNav.showAllNavs();
    };
  }, []);

  useEffect(() => {
    let grandTotalAmount = 0;

    orderSummary.forEach((order) => {
      grandTotalAmount += order?.price?.amount;
    });

    setGrandTotal(grandTotalAmount);
  }, [orderSummary]);

  const getStoreDetailsAndOrderSummary = async () => {
    setIsLoading(true);

    try {
      const [details, orderSummaryResponseData] = await Promise.all([
        getStores(dineInSessionData?.storeId, "L"),
        getOrderSummaryResponseData(dineInRefId),
      ]);

      if (details) {
        setStoreDetails(details);
      }

      if (orderSummaryResponseData) {
        setOrderSummary(orderSummaryResponseData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnReOrderClick = () => {
    pushHistory(`/storefront/${dineInSessionData?.storeId}`);
  };

  const doCheckout = (paymentOption) => {
    if (orderSummary.length > 0 && !isWebView) {
      redirectToPayment(paymentOption?.paymentOption);
    }
    if (isWebView) {
      let readyForCheckout = true;
      if (readyForCheckout)
        orderSummary.length > 0 &&
          redirectToPayment(paymentOption?.paymentOption);
      else if (!readyForCheckout)
        PushAlert.warning(`Please try again later after some time!`);
    }
  };

  const redirectToPayment = (paymentOption) => {
    localStorage.setItem("dineInPaymentOption", paymentOption);
    localStorage.setItem("redirectToPayment", "fromEdp");
    pushHistory("/paymentRedir");
  };

  const handleDiscoverMore = () => {
    pushHistory(`/storefront/${dineInSessionData?.storeId}`);
  };

  if (!isLoading) {
    return (
      <Wrapper>
        <PayOptionsModal
          isDrawerOpen={showPaymentOptionsModal}
          setIsDrawerOpen={setShowPaymentOptionsModal}
          paymentSelections={paymentOptions}
          selectedPaymentOption={selectedPaymentOption}
          setSelectedPaymentOption={setSelectedPaymentOption}
          onPaymentSelection={(paymentOption) => {
            doCheckout(paymentOption);
          }}
        />
        <DineInHeader
          tableNumber={dineInSessionData?.tableNumber}
          shopBrandImageUrl={storeDetails?.shopBrandImageUrl}
          storeName={storeDetails?.storeDisplayName}
        />
        {orderSummary?.length <= 0 ? (
          <NoBillToPayWrapper>
            <NoBillToPayImage src={noBillToPayIcon}></NoBillToPayImage>
            <NoBillToPayTitleTextWrapper>
              <Text type="bold">No bills to pay</Text>
            </NoBillToPayTitleTextWrapper>
            <NoBillToPayDescriptionTextWrapper>
              <Text type="semi-bold">
                Place an order to view your current bill
              </Text>
            </NoBillToPayDescriptionTextWrapper>
            <BrowseMenuWrapper onClick={() => handleDiscoverMore()}>
              <BrowserMenuLabelWrapper>
                <Text type="extra-bold">Browse Menu</Text>
              </BrowserMenuLabelWrapper>
            </BrowseMenuWrapper>
          </NoBillToPayWrapper>
        ) : (
          <DineInWrapper>
            <HeaderWrapper>
              <BillDetailsWrapper>
                <Text type="bold">Bill Details</Text>
              </BillDetailsWrapper>
            </HeaderWrapper>
            <ContentWrapper>
              <OrderSummaryView
                orderSummary={orderSummary}
                orderId={dineInRefId}
              />
            </ContentWrapper>
            <GrandTotalWrapper>
              <GrandTotalTextWrapper>
                <Text type="bold">Grand Total</Text>
              </GrandTotalTextWrapper>
              <GrandTotalPriceTextWrapper>
                <Text type="bold">{formatPrice(grandTotal)}</Text>
              </GrandTotalPriceTextWrapper>
            </GrandTotalWrapper>
          </DineInWrapper>
        )}
        {orderSummary?.length > 0 && (
          <PayNowWrapper>
            {dineInSessionData?.domain !== "lounge" && dineInRefId !== "" ? (
              <ContinueOrderingTextWrapper
                onClick={() => {
                  handleOnReOrderClick();
                }}
              >
                <RightArrowImage
                  src={rightArrow}
                  style={{
                    transform: "rotate(180deg)",
                  }}
                />
                <Text type="bold">Continue Ordering</Text>
              </ContinueOrderingTextWrapper>
            ) : (
              <div></div>
            )}
            <PayNowButtonWrapper
              onClick={() => {
                setShowPaymentOptionsModal(true);
              }}
            >
              <PayNowButtonTextWrapper>
                <Text type="bold">Pay Now</Text>
              </PayNowButtonTextWrapper>
              <RightArrowImage src={rightArrow} />
            </PayNowButtonWrapper>
          </PayNowWrapper>
        )}
      </Wrapper>
    );
  } else {
    return <Loader />;
  }
};

const Wrapper = styled.div`
  background: #f4f4f5;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 60px;
`;

const DineInWrapper = styled.div`
  height: -webkit-fill-available;
  padding: 0px 24px 24px 24px;
  background: #f4f4f5;
  margin-bottom: 60px;
  flex: 1;
  overflow: auto;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0px 0px 0px;
`;

const BillDetailsWrapper = styled.div`
  color: #273135;
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;
`;

const ContentWrapper = styled.div`
  display: flex;
  padding: 20px 24px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  border-radius: 8px 8px 0px 0px;
  background: #fff;
  margin: 24px 0px 0px 0px;
  width: -webkit-fill-available;
`;

const GrandTotalWrapper = styled.div`
  display: flex;
  padding: 20px 24px;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 0px 0px 8px 8px;
  background: #fff;
  width: -webkit-fill-available;
  margin-top: 4px;
`;

const GrandTotalTextWrapper = styled.div`
  color: #273135;
  font-size: 14px;
  font-weight: 700;
  line-height: normal;
`;

const GrandTotalPriceTextWrapper = styled.div`
  color: #273135;
  text-align: right;
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
`;

const PayNowWrapper = styled.div`
  display: flex;
  padding: 16px 24px;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0px 0px;
  background: var(--Primary---Dark, #096b71);
  box-shadow: -4px -1px 27px 0px rgba(0, 0, 0, 0.1);
  position: absolute;
  bottom: 60px;
  width: -webkit-fill-available;
  left: 0;
`;

const ContinueOrderingTextWrapper = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;

  display: flex;
  gap: 8px;
  align-items: center;
`;

const PayNowButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const PayNowButtonTextWrapper = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
`;

const RightArrowImage = styled.img`
  width: 12px;
  height: 12px;
`;

const NoBillToPayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  margin-bottom: 60px;
`;

const NoBillToPayImage = styled.img`
  background-size: contain;
  background-repeat: no-repeat;
`;

const NoBillToPayTitleTextWrapper = styled.div`
  margin-top: 24px;
  font-weight: 700;
  font-size: 24px;
  line-height: normal;
  text-align: center;
  color: #273135;
`;

const NoBillToPayDescriptionTextWrapper = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: normal;
  text-align: center;
  color: #273135;
  opacity: 0.6;
  margin-top: 8px;
`;

const BrowseMenuWrapper = styled.div`
  margin: 60px 24px 0px 24px;
  width: -webkit-fill-available;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  background: #04adaa;
`;

const BrowserMenuLabelWrapper = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  line-height: 130%;
  text-align: center;
`;

export default PayBill;
