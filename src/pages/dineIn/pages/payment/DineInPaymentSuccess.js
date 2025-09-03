import { useConfig } from "context/configContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import Loader from "../../../../components/atoms/loader";
import { NavContext } from "../../../../context/navContext";
import { getSessionStorage } from "../../../../util/storageUtil";
import GreenTickIcon from "../../assets/GreenTick.svg";
import InvoiceIcon from "../../assets/invoiceIcon.svg";
import OrderSummaryView from "../../components/OrderSummaryView";
import { getOrderSummaryResponseData, getStores } from "../../util/Util";
import { formatPrice } from "commons/util/helperFunctions";

const DineInPaymentSuccess = () => {
  const useNav = useContext(NavContext);
  const { orderId } = useParams();
  const [dineInSessionData] = useState(getSessionStorage("dine-in"));

  const [isLoading, setIsLoading] = useState(false);
  const [storeDetails, setStoreDetails] = useState({});
  const [orderSummary, setOrderSummary] = useState([]);

  const [grandTotal, setGrandTotal] = useState(0);

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
        getOrderSummaryResponseData(orderId),
      ]);

      if (details) {
        setStoreDetails(details);
      }

      if (orderSummaryResponseData) {
        setOrderSummary(orderSummaryResponseData);
      }

      if (details && orderSummaryResponseData) {
        localStorage.removeItem("dineInRefId");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoading) {
    return (
      <Wrapper>
        <StoreDetailsWrapper>
          <StoreImage src={storeDetails?.shopBrandImageUrl} />
          <StoreNameTextWrapper>
            <Text type="bold" variant="heading">{storeDetails?.storeDisplayName}</Text>
          </StoreNameTextWrapper>
          <ThankYouTextWrapper>
            <Text type="semi-bold">Thank you for dining with us.</Text>
          </ThankYouTextWrapper>
        </StoreDetailsWrapper>
        <ContentWrapper>
          <PaymentSuccessImage src={GreenTickIcon} />
          <PaymentCompleteWrapper>
            <PaymentCompletePriceTextWrapper>
              <Text type="semi-bold">{formatPrice(grandTotal)}</Text>
            </PaymentCompletePriceTextWrapper>
            <PaymentCompleteTextWrapper>
              <Text type="bold">Payment Complete</Text>
            </PaymentCompleteTextWrapper>
          </PaymentCompleteWrapper>
          <Divider></Divider>
          <OrderContentWrapper>
            <OrderSummaryView orderId={orderId} orderSummary={orderSummary} />
          </OrderContentWrapper>
          <Divider></Divider>
          <TotalPaidWrapper>
            <TotalPaidTextWrapper>
              <Text type="bold">Total Paid</Text>
            </TotalPaidTextWrapper>
            <TotalPaidAmountTextWrapper>
              <Text type="bold">{formatPrice(grandTotal)}</Text>
            </TotalPaidAmountTextWrapper>
          </TotalPaidWrapper>
        </ContentWrapper>
        <InvoiceWrapper>
          <InvoiceImage src={InvoiceIcon} />
          <InvoiceTextWrapper>
            <Text type="regular">
              You can view your invoice details and order history on BLR Pulse
              mobile app.
            </Text>
          </InvoiceTextWrapper>
        </InvoiceWrapper>
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
  height: -webkit-fill-available;
  margin-bottom: 60px;
  padding: 0px 24px 24px 24px;
  overflow: auto;
`;

const StoreDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 24px;
`;

const StoreImage = styled.img`
  width: 60px;
  height: 60px;
`;

const StoreNameTextWrapper = styled.div`
  color: var(--Text---Black, #273135);
  font-size: 24px;
  font-weight: 700;
  line-height: normal;
`;

const ThankYouTextWrapper = styled.div`
  color: var(--Text---Black, #273135);
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
`;

const ContentWrapper = styled.div`
  display: flex;
  padding: 32px 16px 16px 16px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border-radius: 8px;
  background: #fff;
  margin-top: 48px;
  position: relative;
`;

const PaymentSuccessImage = styled.img`
  width: 48px;
  height: 48px;
  position: absolute;
  top: -24px;
`;

const PaymentCompleteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const PaymentCompletePriceTextWrapper = styled.div`
  color: var(--Primary---Teal, #04adaa);
  font-size: 32px;
  font-weight: 600;
  line-height: normal;
`;

const PaymentCompleteTextWrapper = styled.div`
  color: #273135;
  font-size: 12px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 1.2px;
  opacity: 0.6;
  text-transform: uppercase;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(223, 223, 226, 0.3);
  width: -webkit-fill-available;
`;

const OrderContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;

const TotalPaidWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const TotalPaidTextWrapper = styled.div`
  color: #273135;
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
`;

const TotalPaidAmountTextWrapper = styled.div`
  color: #273135;
  text-align: right;
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
`;

const InvoiceWrapper = styled.div`
  display: flex;
  padding: 16px;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  background: #fff;
  margin-top: 12px;
`;

const InvoiceImage = styled.img`
  width: 17px;
  height: 23px;
`;

const InvoiceTextWrapper = styled.div`
  color: #273135;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
`;

export default DineInPaymentSuccess;
