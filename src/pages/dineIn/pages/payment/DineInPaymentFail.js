import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import Util from "../../../../commons/util/util";
import Text from "../../../../components/atoms/Text";
import PushAlert from "../../../../components/atoms/pushAlert";
import { NavContext } from "../../../../context/navContext";
import exclamationIcon from "../../assets/exclamation.svg";
import { getOrderSummaryResponseData } from "../../util/Util";
import Loader from "../../../../components/atoms/loader";
import { getSessionStorage } from "../../../../util/storageUtil";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";

const DineInPaymentFail = () => {
  const history = useHistory();
  const useNav = useContext(NavContext);
  const { pushHistory } = useCustomNavigation();
  const [isWebView] = useState(Util.isWebView());
  const [dineInSessionData] = useState(getSessionStorage("dine-in"));

  const { orderId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState();

  useEffect(() => {
    getOrderSummary();

    useNav.hideAllNavs();
    useNav.setShowDineInBottomTab(false);
    return () => {
      useNav.setShowDineInBottomTab(false);
      useNav.showAllNavs();
    };
  }, []);

  const getOrderSummary = async () => {
    setIsLoading(true);

    const orderSummaryResponseData = await getOrderSummaryResponseData(orderId);
    if (orderSummaryResponseData) {
      setOrderSummary(orderSummaryResponseData);
    }

    setIsLoading(false);
  };

  const doCheckout = () => {
    if (!orderSummary) {
      if (dineInSessionData && dineInSessionData?.storeId) {
        pushHistory(
          `/dine-in?storeId=${dineInSessionData?.storeId}&tableNumber=${dineInSessionData?.tableNumber}`
        );
      } else {
        pushHistory("/");
      }
    }
    if (orderSummary?.length > 0 && !isWebView) {
      redirectToPayment();
    }
    if (isWebView) {
      let readyForCheckout = true;
      if (readyForCheckout) orderSummary.length > 0 && redirectToPayment();
      else if (!readyForCheckout)
        PushAlert.warning(`Please try again later after some time!`);
    }
  };

  const redirectToPayment = () => {
    pushHistory("/paymentRedir");
    localStorage.setItem("dineInPaymentOption", "now");
    localStorage.setItem("redirectToPayment", "fromEdp");
  };

  const handleBackToMenuClick = () => {
    if (dineInSessionData && dineInSessionData?.storeId) {
      pushHistory(`/storefront/${dineInSessionData?.storeId}`);
    } else {
      pushHistory("/");
    }
  };

  if (!isLoading) {
    return (
      <Wrapper>
        <ExclamationImage src={exclamationIcon} />
        <PaymentFailedTextWrapper>
          <Text type="bold" variant="heading">Payment Failed!</Text>
        </PaymentFailedTextWrapper>
        <DescriptionTextWrapper>
          <Text>Your payment encountered unexpected error.</Text>
        </DescriptionTextWrapper>
        <ButtonsWrapper>
          <RetryButtonWrapper
            onClick={() => {
              doCheckout();
            }}
          >
            <Text type="bold">Retry</Text>
          </RetryButtonWrapper>
          <BackToHomeButtonWrapper
            onClick={() => {
              handleBackToMenuClick();
            }}
          >
            <Text type="bold">Back to Menu</Text>
          </BackToHomeButtonWrapper>
        </ButtonsWrapper>
      </Wrapper>
    );
  } else {
    return <Loader />;
  }
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const ExclamationImage = styled.img`
  width: 150px;
  height: 150px;
  border: 1px solid #c0070b;
  border-radius: 100px;
`;

const PaymentFailedTextWrapper = styled.div`
  font-size: 24px;
  margin-top: 24px;
`;

const DescriptionTextWrapper = styled.div`
  font-size: 18px;
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 0px 24px;
  gap: 24px;
  margin-top: 48px;
`;

const RetryButtonWrapper = styled.div`
  padding: 16px 24px;
  background: #ffffff;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;

  font-size: 16px;
  font-weight: 400;
  color: #04adaa;
  border: 1px solid rgb(4, 173, 170);
`;

const BackToHomeButtonWrapper = styled.div`
  padding: 16px 24px;
  background: #04adaa;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;

  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
`;

export default DineInPaymentFail;
